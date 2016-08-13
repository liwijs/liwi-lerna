var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import Logger from 'nightingale-logger';

var MAX_OPENED_CURSORS = 5;
var logger = new Logger('liwi.rest-websocket');

export default function init(io, restService) {
    io.on('connection', socket => {
        var openCursors = new Map();
        var timeouts = new Map();
        var activeListeners = new Map();

        var closeCursor = id => {
            clearTimeout(timeouts[id]);
            timeouts.delete(id);
            openCursors[id].close();
            openCursors.delete(id);
        };

        socket.on('disconnect', () => {
            openCursors.forEach(cursor => cursor.close());
            timeouts.forEach(timeout => clearTimeout(timeout));
            activeListeners.forEach(listener => listener.close());

            openCursors = timeouts = activeListeners = null;
        });

        var nextIdCursor = 1;

        socket.on('rest', (_ref, args, callback) => {
            var type = _ref.type;
            var restName = _ref.restName;

            logger.info('rest', { type, restName, args });
            switch (type) {
                case 'createCursor':
                    {
                        var _ret = function () {
                            if (openCursors.size > MAX_OPENED_CURSORS) return {
                                    v: callback('too many cursors')
                                };

                            var id = nextIdCursor++;

                            var _args = _slicedToArray(args, 1);

                            var options = _args[0];

                            var cursor = restService.createCursor(restName, options);
                            if (!cursor) return {
                                    v: callback('failed to create cursor')
                                };

                            timeouts.set(id, setTimeout(() => {
                                logger.warn('socket closed by timeout', { id, restName });
                                closeCursor(id);
                            }));

                            return {
                                v: callback(null, id)
                            };
                        }();

                        if (typeof _ret === "object") return _ret.v;
                    }

                case 'cursor toArray':
                    {
                        var _args2 = _slicedToArray(args, 1);

                        var _options = _args2[0];

                        return restService.createCursor(restName, _options).then(cursor => cursor.toArray()).then(results => callback(null, results)).catch(err => callback(err.message));
                    }

                case 'cursor':
                    {
                        var _args3 = _slicedToArray(args, 2);

                        var _args3$ = _args3[0];
                        var typeCursorAction = _args3$.type;
                        var idCursor = _args3$.id;
                        var cursorArgs = _args3[1];


                        var _cursor = openCursors.get(idCursor);
                        if (!_cursor) return callback(`failed to find cursor "${ idCursor }"`);
                        switch (typeCursorAction) {
                            case 'close':
                                closeCursor(idCursor);
                                return callback();

                            case 'advance':
                            case 'next':
                            case 'count':
                                return _cursor[type](...cursorArgs).then(result => callback(null, result)).catch(err => callback(err.message || err));
                            /* cursor.next().then((key) => {
                                if (!key) return callback(null);
                                return cursor.result();
                            }).then(result => {
                                    response(null, restService.transform(data));
                                });
                            }, () => {
                                response(null);
                            }); */

                            default:
                                callback(`Unknown command: "${ type }"`);
                        }

                        break;
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
                    return restService[type](restName, ...args).then(result => callback(null, result)).catch(err => callback(err.message || err));

                default:
                    callback(`Unknown command: "${ type }"`);
            }
        });
    });
}
//# sourceMappingURL=_next.js.map