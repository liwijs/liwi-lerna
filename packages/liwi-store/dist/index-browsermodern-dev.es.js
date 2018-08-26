import assert from 'assert';

class AbstractConnection {}

var _Symbol$iterator = Symbol.iterator;

/* eslint-disable no-await-in-loop */
class AbstractCursor {
  constructor(store) {
    this.key = void 0;
    this._store = void 0;
    this._store = store;
  }

  get store() {
    return this._store;
  }

  nextResult() {
    var _this = this;

    return this.next().then(function () {
      return _this.result();
    });
  }

  result() {
    if (!this.key) throw new Error('Cannot call result() before next()');
    return this.store.findByKey(this.key);
  }

  delete() {
    return this.store.deleteByKey(this.key);
  }

  async forEachKeys(callback) {
    while (true) {
      const key = await this.next();
      if (!key) return;
      await callback(key);
    }
  }

  forEach(callback) {
    var _this2 = this;

    return this.forEachKeys(function () {
      return _this2.result().then(function (result) {
        return callback(result);
      });
    });
  }

  *keysIterator() {
    while (true) {
      yield this.next();
    }
  }

  *[_Symbol$iterator]() {
    var _this3 = this;

    // eslint-disable-next-line no-restricted-syntax
    for (const keyPromise of this.keysIterator()) {
      yield keyPromise.then(function (key) {
        return key && _this3.result();
      });
    }
  } // TODO Symbol.asyncIterator, https://phabricator.babeljs.io/T7356

  /*
    async *keysAsyncIterator() {
        while (true) {
             const key = await this.next();
             if (!key) return;
              yield key;
        }
     }
      async *[Symbol.asyncIterator] {
        for await (let key of this.keysAsyncIterator()) {
            yield await this.result();
        }
     }
     */


}

class AbstractQuery {
  constructor(store) {
    this.store = void 0;
    this.store = store;
  }

  fetchAndSubscribe(callback, ...args) {
    return this._subscribe(callback, true, args);
  }

  subscribe(callback, ...args) {
    return this._subscribe(callback, false, args);
  }

}

class AbstractStore {
  constructor(connection, keyPath) {
    this._connection = void 0;
    this.keyPath = void 0;
    assert(connection);
    this._connection = connection;
    this.keyPath = keyPath;
  }

  get connection() {
    return this._connection;
  }

  findAll(criteria, sort) {
    return this.cursor(criteria, sort).then(function (cursor) {
      return cursor.toArray();
    });
  }

}

export { AbstractConnection, AbstractCursor, AbstractQuery, AbstractStore };
//# sourceMappingURL=index-browsermodern-dev.es.js.map