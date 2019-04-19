import Logger from 'nightingale-logger';
import { decode } from 'extended-json';
import { AbstractQuery } from 'liwi-store';

const logger = new Logger('liwi:resources:query');
class ClientQuery extends AbstractQuery {
  constructor(client, key, params) {
    super();
    this.client = client;
    this.key = key;
    this.params = params;
  }

  fetch(onFulfilled) {
    logger.debug('fetch', {
      resourceName: this.client.resourceName,
      key: this.key
    });
    return this.client.send('fetch', [this.key, this.params, undefined]).then(onFulfilled);
  }

  _subscribe(callback, _includeInitial = false) {
    const eventName = `subscribe:${this.client.resourceName}.${this.key}`;
    logger.debug('subscribe', {
      eventName
    });

    const listener = (err, result) => {
      const decodedResult = result && decode(result);
      logger.debug(eventName, {
        result,
        decodedResult
      });
      callback(err, decodedResult);
    };

    this.client.on(eventName, listener);

    let _stopEmitSubscribeOnConnect;

    let promise = this.client.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', [this.key, this.params, eventName]).then(stopEmitSubscribe => {
      _stopEmitSubscribeOnConnect = stopEmitSubscribe;
      logger.debug('subscribed', {
        resourceName: this.client.resourceName,
        key: this.key
      });
    }, err => {
      this.client.off(eventName, listener);
      throw err;
    });

    const stop = () => {
      if (!promise) return;
      promise.then(() => {
        logger.debug('unsubscribe', {
          resourceName: this.client.resourceName,
          key: this.key
        });

        _stopEmitSubscribeOnConnect();

        this.client.send('unsubscribe', [this.key]);
        promise = undefined;
        this.client.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: cb => Promise.resolve(promise).then(cb)
    };
  }

}

class AbstractClient {
  constructor(resourceName, keyPath) {
    this.resourceName = resourceName;

    if (!resourceName) {
      throw new Error(`Invalid resourceName: "${resourceName}"`);
    }

    this.keyPath = keyPath;
  }

  createQuery(key, params) {
    return new ClientQuery(this, key, params);
  }

  // cursor(
  //   criteria?: Criteria<Model>,
  //   sort?: Sort<Model>,
  // ): Promise<ClientCursor<Model, KeyPath>> {
  //   return Promise.resolve(new ClientCursor(this, { criteria, sort }));
  // }
  findByKey() {
    throw new Error('Use operations instead');
  }

  replaceOne() {
    throw new Error('Use operations instead');
  }

  partialUpdateByKey() {
    throw new Error('Use operations instead');
  }

  deleteByKey() {
    throw new Error('Use operations instead');
  }

}

const createResourceClientService = (client, options) => {
  const queries = {};
  const operations = {};
  options.queries.forEach(queryKey => {
    queries[queryKey] = params => client.createQuery(queryKey, params);
  });
  options.operations.forEach(operationKey => {
    operations[operationKey] = params => client.send('do', [operationKey, params]);
  });
  return {
    queries: queries,
    operations: operations
  };
};
/** @deprecated use createResourceClientService instead */

const createResourceClient = createResourceClientService;

export { createResourceClientService, createResourceClient, AbstractClient };
//# sourceMappingURL=index-node10-dev.es.js.map
