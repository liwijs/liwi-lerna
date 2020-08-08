import { decode, encode } from 'extended-json';
import { ResourcesServerError } from 'liwi-resources-server';
import Logger from 'nightingale-logger';
import WebSocket from 'ws';

/* eslint-disable complexity, max-lines */
const logger = new Logger('liwi:resources-websocket-client');
const createWsServer = function createWsServer(server, path = '/ws', resourcesServerService, getAuthenticatedUser) {
  const wss = new WebSocket.Server({
    noServer: true
  });

  const getResource = function getResource(payload) {
    logger.debug('resource', {
      resourceName: payload.resourceName
    });
    const resource = resourcesServerService.getServiceResource(payload.resourceName);
    return resource;
  };

  const createQuery = function createQuery(payload, resource, authenticatedUser) {
    if (!payload.key.startsWith('query')) {
      throw new Error('Invalid query key');
    }

    return resource.queries[payload.key](payload.params, authenticatedUser);
  };

  wss.on('connection', function (ws, authenticatedUser) {
    ws.isAlive = true;
    const openSubscriptions = new Map();

    const sendMessage = function sendMessage(type, id, error, result) {
      if (!id) throw new Error('Invalid id');
      logger.debug('sendMessage', {
        type,
        id,
        error,
        result
      });
      ws.send(encode([type, id, error, result]));
    };

    const createSafeError = function createSafeError(error) {
      if (error instanceof ResourcesServerError) {
        return {
          code: error.code,
          message: error.message
        };
      }

      return {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error'
      };
    };

    const sendAck = function sendAck(id, error, result) {
      sendMessage('ack', id, error && createSafeError(error), result);
    };

    const logUnexpectedError = function logUnexpectedError(error, message, payload) {
      logger.error(message, {
        error,
        payload: payload
      });
    };

    const logUnexpectedErrorAndSendAck = function logUnexpectedErrorAndSendAck(message, error) {
      logUnexpectedError(error, message.type, message.payload);
      sendAck(message.id, error);
    };

    const sendSubscriptionMessage = function sendSubscriptionMessage(subscriptionId, error, result) {
      sendMessage('subscription', subscriptionId, error && createSafeError(error), result);
    };

    const createSubscription = function createSubscription(type, id, payload, resource, query) {
      const {
        subscriptionId
      } = payload;

      if (openSubscriptions.has(subscriptionId)) {
        logger.warn("Already have a watcher for this id. Cannot add a new one", {
          subscriptionId,
          key: payload.key
        });
        throw new ResourcesServerError('ALREADY_HAVE_WATCHER', "Already have a watcher for this id. Cannot add a new one");
      }

      const subscription = query[type](function (error, result) {
        if (error) {
          logUnexpectedError(error, type, payload);
        }

        sendSubscriptionMessage(subscriptionId, error, result);
      });
      subscription.then(function () {
        return sendAck(id, null);
      }, function (err) {
        logger.error(type, {
          err
        });
        sendAck(id, err);
      });
      const subscribeHook = resource.subscribeHooks && resource.subscribeHooks[payload.key];
      openSubscriptions.set(subscriptionId, {
        subscription,
        subscribeHook,
        params: subscribeHook ? payload.params : undefined
      });

      if (subscribeHook) {
        subscribeHook.subscribed(authenticatedUser, payload.params);
      }
    };

    const unsubscribeSubscription = function unsubscribeSubscription({
      subscription,
      subscribeHook,
      params
    }) {
      subscription.stop();

      if (subscribeHook) {
        subscribeHook.unsubscribed(authenticatedUser, params);
      }
    };

    const handleDecodedMessage = async function handleDecodedMessage(message) {
      switch (message.type) {
        case 'fetch':
          {
            try {
              const resource = getResource(message.payload);
              const query = createQuery(message.payload, resource, authenticatedUser);
              await query.fetch(function (result) {
                return sendAck(message.id, null, result);
              });
            } catch (err) {
              logUnexpectedErrorAndSendAck(message, err);
            }

            break;
          }

        case 'fetchAndSubscribe':
          {
            try {
              const resource = getResource(message.payload);
              const query = createQuery(message.payload, resource, authenticatedUser);
              createSubscription('fetchAndSubscribe', message.id, message.payload, resource, query);
            } catch (err) {
              logUnexpectedErrorAndSendAck(message, err);
            }

            break;
          }

        case 'subscribe':
          {
            try {
              const resource = getResource(message.payload);
              const query = createQuery(message.payload, resource, authenticatedUser);
              createSubscription('subscribe', message.id, message.payload, resource, query);
            } catch (err) {
              logUnexpectedErrorAndSendAck(message, err);
            }

            break;
          }
        // case 'subscribe:changePayload': {
        //   break;
        // }

        case 'subscribe:close':
          {
            try {
              const {
                subscriptionId
              } = message.payload;
              const SubscriptionAndSubscribeHook = openSubscriptions.get(subscriptionId);

              if (!SubscriptionAndSubscribeHook) {
                logger.warn('tried to unsubscribe non existing watcher', {
                  subscriptionId
                });
              } else {
                openSubscriptions.delete(subscriptionId);
                unsubscribeSubscription(SubscriptionAndSubscribeHook);
              }
            } catch (err) {
              logUnexpectedError(err, message.type, message.payload);
            }

            break;
          }

        case 'do':
          {
            try {
              const resource = getResource(message.payload);
              const {
                operationKey,
                params
              } = message.payload;
              const operation = resource.operations[operationKey];

              if (!operation) {
                throw new ResourcesServerError('OPERATION_NOT_FOUND', `Operation not found: ${operationKey}`);
              }

              operation(params, authenticatedUser).then(function (result) {
                return sendAck(message.id, null, result);
              }, function (err) {
                logUnexpectedErrorAndSendAck(message, err);
              });
            } catch (err) {
              logUnexpectedErrorAndSendAck(message, err);
            }

            break;
          }
      }
    };

    ws.on('pong', function () {
      ws.isAlive = true;
    });
    ws.on('close', function () {
      openSubscriptions.forEach(unsubscribeSubscription);
    });
    ws.on('message', function (message) {
      if (message === 'close') return;

      if (typeof message !== 'string') {
        logger.warn('got non string message');
        return;
      }

      const decoded = decode(message);

      try {
        const [type, id, payload] = decoded;
        logger.debug('received', {
          type,
          id,
          payload
        });
        handleDecodedMessage({
          type,
          id,
          payload
        });
      } catch (err) {
        logger.notice('invalid message', {
          decoded
        });
      }
    });
    ws.send('connection-ack');
  }); // https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections

  const interval = setInterval(function () {
    wss.clients.forEach(function (ws) {
      const extWs = ws;
      if (!extWs.isAlive) return ws.terminate();
      extWs.isAlive = false;
      ws.ping(null, undefined);
    });
  }, 60000);

  const handleUpgrade = function handleUpgrade(request, socket, upgradeHead) {
    if (request.url !== path) return;
    const authenticatedUserPromise = Promise.resolve(getAuthenticatedUser(request));
    wss.handleUpgrade(request, socket, upgradeHead, function (ws) {
      authenticatedUserPromise.catch(function (err) {
        logger.warn('getAuthenticatedUser threw an error, return null instead.', {
          err
        });
        return null;
      }).then(function (authenticatedUser) {
        wss.emit('connection', ws, authenticatedUser);
      });
    });
  };

  server.on('upgrade', handleUpgrade);
  return {
    wss,

    close() {
      wss.close();
      server.removeListener('upgrade', handleUpgrade);
      clearInterval(interval);
    }

  };
};

export { createWsServer };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
