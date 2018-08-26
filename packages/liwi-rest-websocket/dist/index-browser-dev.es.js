import Logger from 'nightingale-logger';
import { encode, decode } from 'extended-json';

/* eslint-disable complexity */
var logger = new Logger('liwi:rest-websocket');
function init(io, restService) {
  io.on('connection', function (socket) {
    var openWatchers = new Set();
    socket.on('disconnect', function () {
      openWatchers.forEach(function (watcher) {
        return watcher.stop();
      });
    });
    socket.on('rest', function (_ref, callback) {
      var type = _ref.type,
          restName = _ref.restName,
          json = _ref.json,
          _ref2,
          options,
          key,
          eventName,
          _args$,
          otherArgs;

      try {
        var args = decode(json);

        if (!Array.isArray(args)) {
          logger.debug('args', {
            args: args
          });

          if (callback) {
            throw new Error('Invalid args');
          }
        }

        var restResource = restService.get(restName);
        logger.info('rest', {
          type: type,
          restName: restName,
          args: args
        });

        switch (type) {
          case 'cursor toArray':
            {
              _ref2 = args, options = _ref2[0];
              return restService.createCursor(restResource, socket.user, options).then(function (cursor) {
                return cursor.toArray();
              }).then(function (results) {
                return callback(null, encode(results));
              }).catch(function (err) {
                logger.error(type, err);
                callback(err.message);
              });
            }

          case 'insertOne':
          case 'replaceOne':
          case 'upsertOne':
          case 'partialUpdateByKey':
          case 'partialUpdateOne':
          case 'partialUpdateMany':
          case 'deleteByKey':
          case 'deleteOne':
          case 'findOne':
            try {
              if (!restResource[type]) {
                throw new Error("rest: " + restName + "." + type + " is not available");
              } // eslint-disable-next-line prettier/prettier


              return restResource[type].apply(restResource, [socket.user].concat(args)).then(function (result) {
                return callback(null, encode(result));
              }).catch(function (err) {
                logger.error(type, {
                  err: err
                });
                callback(err.message);
              });
            } catch (err) {
              logger.error(type, {
                err: err
              });
              callback(err.message || err);
            }

            break;

          case 'fetch':
          case 'subscribe':
          case 'fetchAndSubscribe':
            try {
              key = args[0], eventName = args[1], _args$ = args[2], otherArgs = _args$ === void 0 ? [] : _args$;

              if (!key.startsWith('query')) {
                throw new Error('Invalid query key');
              }

              var query = restResource.queries[key]; // todo pass connected user

              if (!query) {
                throw new Error("rest: " + restName + "." + type + "." + key + " is not available");
              }

              if (type === 'fetch') {
                return query[type].apply(query, [function (result) {
                  return callback(null, result && encode(result));
                }].concat(otherArgs)).catch(function (err) {
                  logger.error(type, {
                    err: err
                  });
                  callback(err.message || err);
                });
              } else {
                var watcher = query[type](function (err, result) {
                  if (err) {
                    logger.error(type, {
                      err: err
                    });
                  }

                  socket.emit(eventName, err, result && encode(result));
                });
                watcher.then(function () {
                  return callback(null);
                }, function (err) {
                  logger.error(type, {
                    err: err
                  });
                  callback(err.message);
                });
                openWatchers.add(watcher);
              }
            } catch (err) {
              logger.error(type, {
                err: err
              });
              callback(err.message || err);
            }

            break;

          default:
            try {
              logger.warn('Unknown command', {
                type: type
              });
              callback("rest: unknown command \"" + type + "\"");
            } catch (err) {
              logger.error(type, {
                err: err
              });
              callback(err.message || err);
            }

        }
      } catch (err) {
        logger.warn('rest error', {
          err: err
        });
        callback(err.message || err);
      }
    });
  });
}

export default init;
//# sourceMappingURL=index-browser-dev.es.js.map