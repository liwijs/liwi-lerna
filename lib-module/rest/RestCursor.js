var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RestCursor = function () {
  function RestCursor(restResource, connectedUser, cursor) {
    _classCallCheck(this, RestCursor);

    this._restResource = restResource;
    this._connectedUser = connectedUser;
    this._cursor = cursor;
  }

  _createClass(RestCursor, [{
    key: "toArray",
    value: function toArray() {
      var _this = this;

      return this._cursor.toArray().then(function (results) {
        return results && results.map(function (result) {
          return _this._restResource.transform(result, _this._connectedUser);
        });
      });
    }
  }]);

  return RestCursor;
}();

export { RestCursor as default };
//# sourceMappingURL=RestCursor.js.map