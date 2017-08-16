var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = void 0; try { for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !(i && _arr.length === i)); _n = true); } catch (err) { _d = true, _e = err; } finally { try { !_n && _i["return"] && _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) return arr; if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i); throw new TypeError("Invalid attempt to destructure non-iterable instance"); }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } return Array.from(arr); }

import Logger from 'nightingale-logger';
import { encode, decode } from '../extended-json';

var logger = new Logger('liwi:rest-websocket');

export default function init(io, restService) {
  io.on('connection', function (socket) {
    var openWatchers = new Set();

    socket.on('disconnect', function () {
      openWatchers.forEach(function (watcher) {
        return watcher.stop();
      });
    }), socket.on('rest', function (_ref, args, callback) {
      var type = _ref.type,
          restName = _ref.restName,
          json = _ref.json;

      try {
        if (json && (callback = args, args = decode(json), !Array.isArray(args) && (logger.debug('args', { args: args }), callback))) throw new Error('Invalid args');

        if (!callback) return void logger['error']('callback missing');

        var restResource = restService.get(restName);

        switch (logger.info('rest', { type: type, restName: restName, args: args }), type) {
          case 'cursor toArray':
            {
              var _args = args,
                  _args2 = _slicedToArray(_args, 1),
                  options = _args2[0];

              return restService.createCursor(restResource, socket.user, options).then(function (cursor) {
                return cursor.toArray();
              }).then(function (results) {
                return callback(null, encode(results));
              }).catch(function (err) {
                logger.error(type, err), callback(err.message);
              });
            }

          case 'insertOne':
          case 'updateOne':
          case 'updateSeveral':
          case 'partialUpdateByKey':
          case 'partialUpdateOne':
          case 'partialUpdateMany':
          case 'deleteByKey':
          case 'deleteOne':
          case 'findOne':
            try {

              // eslint-disable-next-line prettier/prettier
              return restResource[type].apply(restResource, [socket.user].concat(_toConsumableArray(args))).then(function (result) {
                return callback(null, encode(result));
              }).catch(function (err) {
                logger.error(type, { err: err }), callback(err.message || err);
              });
            } catch (err) {
              logger.error(type, { err: err }), callback(err.message || err);
            }
            break;

          case 'fetch':
          case 'subscribe':
          case 'fetchAndSubscribe':
            try {
              var _args3 = args,
                  _args4 = _slicedToArray(_args3, 3),
                  key = _args4[0],
                  eventName = _args4[1],
                  _args4$ = _args4[2],
                  otherArgs = _args4$ === void 0 ? [] : _args4$;

              if (!key.startsWith('query')) throw new Error('Invalid query key');

              var query = restResource.queries[key]; // todo pass connected user
              if (!query) throw new Error('rest: ' + restName + '.' + type + '.' + key + ' is not available');

              if (type === 'fetch')
                // eslint-disable-next-line prettier/prettier
                return query[type].apply(query, [function (result) {
                  return callback(null, result && encode(result));
                }].concat(_toConsumableArray(otherArgs))).catch(function (err) {
                  logger.error(type, { err: err }), callback(err.message || err);
                });

              var watcher = query[type](function (err, result) {
                err && logger.error(type, { err: err }), socket.emit(eventName, err, result && encode(result));
              });
              watcher.then(function () {
                return callback();
              }, function (err) {
                logger.error(type, { err: err }), callback(err.message || err);
              }), openWatchers.add(watcher);
            } catch (err) {
              logger.error(type, { err: err }), callback(err.message || err);
            }
            break;

          default:
            try {
              logger.warn('Unknown command', { type: type }), callback('rest: unknown command "' + type + '"');
            } catch (err) {
              logger.error(type, { err: err }), callback(err.message || err);
            }
        }
      } catch (err) {
        logger.warn('rest error', { err: err }), callback(err.message || err);
      }
    });
  });
}
//# sourceMappingURL=index.js.map