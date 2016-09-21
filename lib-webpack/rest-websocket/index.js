var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* global PRODUCTION */
import Logger from 'nightingale-logger';
import { encode, decode } from '../msgpack';

var logger = new Logger('liwi.rest-websocket');

export default function init(io, restService) {
  io.on('connection', function (socket) {
    socket.on('rest', function (_ref, args, callback) {
      var type = _ref.type;
      var restName = _ref.restName;
      var buffer = _ref.buffer;

      if (buffer) {

        callback = args;
        args = decode(buffer);
        console.log(args);
      }

      logger.info('rest', { type: type, restName: restName, args: args });
      switch (type) {
        case 'cursor toArray':
          {
            var _args = args;

            var _args2 = _slicedToArray(_args, 1);

            var options = _args2[0];

            return restService.createCursor(restName, socket.user, options).then(function (cursor) {
              return cursor.toArray();
            }).then(function (results) {
              return callback(null, encode(results));
            }).catch(function (err) {
              logger.error(type, err);
              callback(err.message);
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
            var restResource = restService.get(restName);


            return restResource[type].apply(restResource, [socket.user].concat(_toConsumableArray(args))).then(function (result) {
              return callback(null, encode(result));
            }).catch(function (err) {
              logger.error(type, { err: err });
              callback(err.message || err);
            });
          } catch (err) {
            logger.error(type, { err: err });
            callback(err.message || err);
          }
          break;

        case 'query:fetch':
        case 'query:subscribe':
          if (type === 'query:fetch') {
            type = 'fetch';
          }
          if (type === 'query:subscribe') {
            type = 'subscribe';
          }

          try {
            var _restResource = restService.get(restName);
            var key = args[0];

            var query = _restResource.query.apply(_restResource, [socket.user].concat(_toConsumableArray(args)));
            if (!query) {
              throw new Error('rest: ' + restName + '.' + type + '.' + key + ' is not available');
            }

            if (type === 'fetch') {
              return query[type](function (result) {
                return callback(null, encode(result));
              }).catch(function (err) {
                logger.error(type, { err: err });
                callback(err.message || err);
              });
            } else {
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
            }
          } catch (err) {
            logger.error(type, { err: err });
            callback(err.message || err);
          }
          break;

        default:
          try {
            logger.warn('Unknown command', { type: type });
            callback('rest: unknown command "' + type + '"');
          } catch (err) {
            logger.error(type, { err: err });
            callback(err.message || err);
          }
      }
    });
  });
}
//# sourceMappingURL=index.js.map