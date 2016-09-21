var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import AbstractQuery from '../store/AbstractQuery';

var Query = function (_AbstractQuery) {
  _inherits(Query, _AbstractQuery);

  function Query(store, key) {
    _classCallCheck(this, Query);

    var _this = _possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).call(this, store));

    _this.key = key;
    return _this;
  }

  _createClass(Query, [{
    key: 'fetch',
    value: function fetch(callback) {
      return this.store.emit('query:fetch', this.key).then(callback);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(callback) {
      throw new Error('Will be implemented next minor');
      // let subscribeKey;
      var promise = this.store.emit('query:subscribe', this.key).then(function (eventName) {
        // subscribeKey = eventName;
        // this.connection.on(eventName, callback);
      });

      var stop = function stop() {
        if (!promise) return;
        promise.then(function () {
          promise = null;
          // this.store.emit('query:subscribe:stop', subscribeKey);
        });
      };
      var cancel = stop;

      return { cancel: cancel, stop: stop };
    }
  }]);

  return Query;
}(AbstractQuery);

export default Query;
//# sourceMappingURL=Query.js.map