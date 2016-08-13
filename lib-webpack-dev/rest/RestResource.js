var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RestResourceService = function () {
    function RestResourceService(store) {
        _classCallCheck(this, RestResourceService);

        this.store = store;
    }

    _createClass(RestResourceService, [{
        key: "criteria",
        value: function criteria(connectedUser, _criteria) {
            if (!(connectedUser == null || connectedUser instanceof Object)) {
                throw new TypeError("Value of argument \"connectedUser\" violates contract.\n\nExpected:\n?Object\n\nGot:\n" + _inspect(connectedUser));
            }

            if (!(_criteria instanceof Object)) {
                throw new TypeError("Value of argument \"criteria\" violates contract.\n\nExpected:\nObject\n\nGot:\n" + _inspect(_criteria));
            }

            return {};
        }
    }, {
        key: "sort",
        value: function sort(connectedUser, _sort) {
            if (!(connectedUser == null || connectedUser instanceof Object)) {
                throw new TypeError("Value of argument \"connectedUser\" violates contract.\n\nExpected:\n?Object\n\nGot:\n" + _inspect(connectedUser));
            }

            if (!(_sort instanceof Object)) {
                throw new TypeError("Value of argument \"sort\" violates contract.\n\nExpected:\nObject\n\nGot:\n" + _inspect(_sort));
            }

            return {};
        }
    }, {
        key: "transform",
        value: function transform(result) {
            if (!(result instanceof Object)) {
                throw new TypeError("Value of argument \"result\" violates contract.\n\nExpected:\nObject\n\nGot:\n" + _inspect(result));
            }

            return result;
        }
    }]);

    return RestResourceService;
}();

export default RestResourceService;

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === "undefined" ? "undefined" : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(function (key) {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=RestResource.js.map