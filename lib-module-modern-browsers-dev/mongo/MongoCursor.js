import Cursor from 'mongodb/lib/cursor';
import MongoStore from './MongoStore';
import AbstractCursor from '../store/AbstractCursor';
import { ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
const ResultType = t.tdz(function () {
  return _ResultType;
});
let MongoCursor = class extends AbstractCursor {
  constructor(store, cursor) {
    let _storeType = t.ref(MongoStore);

    let _cursorType = t.ref(Cursor);

    t.param('store', _storeType).assert(store);
    t.param('cursor', _cursorType).assert(cursor);

    super(store);
    t.bindTypeParameters(this, t.ref(MongoStore));
    this._cursor = cursor;
  }

  advance(count) {
    let _countType = t.number();

    t.return(t.void());
    t.param('count', _countType).assert(count);

    this._cursor.skip(count);
  }

  next() {
    var _this = this;

    const _returnType2 = t.return(t.any());

    return this._cursor.next().then(function (value) {
      _this._result = value;
      _this.key = value && value._id;
      return _this.key;
    }).then(function (_arg) {
      return _returnType2.assert(_arg);
    });
  }

  limit(newLimit) {
    let _newLimitType = t.number();

    const _returnType3 = t.return(t.ref('Promise'));

    t.param('newLimit', _newLimitType).assert(newLimit);

    this._cursor.limit(newLimit);
    return _returnType3.assert(Promise.resolve(this));
  }

  count(applyLimit = false) {
    let _applyLimitType = t.boolean();

    t.param('applyLimit', _applyLimitType).assert(applyLimit);

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
    const _returnType4 = t.return(t.array(t.ref(ResultType)));

    return this._cursor.toArray().then(function (_arg2) {
      return _returnType4.assert(_arg2);
    });
  }
};
export { MongoCursor as default };
//# sourceMappingURL=MongoCursor.js.map