
import AbstractCursor from '../store/AbstractCursor';
let MongoCursor = class extends AbstractCursor {
  constructor(store, cursor) {
    super(store);
    this._cursor = cursor;
  }

  advance(count) {
    this._cursor.skip(count);
  }

  next() {
    var _this = this;

    return this._cursor.next().then(function (value) {
      _this._result = value;
      _this.key = value && value._id;
      return _this.key;
    });
  }

  limit(newLimit) {
    this._cursor.limit(newLimit);
    return Promise.resolve(this);
  }

  count(applyLimit = false) {
    return this._cursor.count(applyLimit);
  }

  result() {
    return Promise.resolve(this._result);
  }

  close() {
    if (this._cursor) {
      this._cursor.close();
      this._cursor = undefined;
      this._store = undefined;
      this._result = undefined;
    }

    return Promise.resolve();
  }

  toArray() {
    return this._cursor.toArray();
  }
};
export { MongoCursor as default };
//# sourceMappingURL=MongoCursor.js.map