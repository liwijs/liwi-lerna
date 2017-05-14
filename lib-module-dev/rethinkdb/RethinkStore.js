var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class, _descriptor;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['defineProperty'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import RethinkConnection from './RethinkConnection';
import AbstractStore from '../store/AbstractStore';
import Query from './Query';
// import RethinkCursor from './RethinkCursor';
import { InsertType as _InsertType, UpdateType as _UpdateType, ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
var InsertType = t.tdz(function () {
  return _InsertType;
});
var UpdateType = t.tdz(function () {
  return _UpdateType;
});
var ResultType = t.tdz(function () {
  return _ResultType;
});
var RethinkStore = (_dec = t.decorate(t.string()), (_class = function (_AbstractStore) {
  _inherits(RethinkStore, _AbstractStore);

  function RethinkStore(connection, tableName) {
    _classCallCheck(this, RethinkStore);

    var _connectionType = t.ref(RethinkConnection);

    var _tableNameType = t.string();

    t.param('connection', _connectionType).assert(connection);
    t.param('tableName', _tableNameType).assert(tableName);

    var _this = _possibleConstructorReturn(this, (RethinkStore.__proto__ || Object.getPrototypeOf(RethinkStore)).call(this, connection));

    _initDefineProp(_this, 'tableName', _descriptor, _this);

    _this.keyPath = 'id';
    t.bindTypeParameters(_this, t.ref(RethinkConnection));

    _this._tableName = tableName;
    _this.r = _this.connection._connection;
    return _this;
  }

  _createClass(RethinkStore, [{
    key: 'table',
    value: function table() {
      return this.r.table(this._tableName);
    }
  }, {
    key: 'createQuery',
    value: function createQuery(query) {
      return new Query(this, query);
    }
  }, {
    key: 'query',
    value: function query() {
      return this.table();
    }
  }, {
    key: '_query',
    value: function _query(criteria, sort) {
      var _this2 = this;

      var _criteriaType = t.nullable(t.object());

      var _sortType = t.nullable(t.object());

      t.param('criteria', _criteriaType).assert(criteria);
      t.param('sort', _sortType).assert(sort);

      var query = this.table();

      if (criteria) {
        query.filter(criteria);
      }

      if (sort) {
        Object.keys(sort).forEach(function (key) {
          if (sort[key] === -1) {
            query.orderBy(_this2.r.desc(key));
          } else {
            query.orderBy(key);
          }
        });
      }

      return query;
    }
  }, {
    key: 'create',
    value: function create() {
      var _returnType = t.return(t.void());

      return this.r.tableCreate(this._tableName).then(function () {
        return null;
      }).then(function (_arg) {
        return _returnType.assert(_arg);
      });
    }
  }, {
    key: 'insertOne',
    value: function insertOne(object) {
      var _objectType = t.ref(InsertType);

      var _returnType2 = t.return(t.ref(ResultType));

      t.param('object', _objectType).assert(object);

      if (!object.created) object.created = new Date();

      return this.table().insert(object).then(function (_ref) {
        var inserted = _ref.inserted,
            generatedKeys = _ref.generated_keys;

        if (inserted !== 1) throw new Error('Could not insert');
        if (object.id == null) {
          object.id = generatedKeys[0];
        }
      }).then(function () {
        return object;
      }).then(function (_arg2) {
        return _returnType2.assert(_arg2);
      });
    }
  }, {
    key: 'updateOne',
    value: function updateOne(object) {
      return this.replaceOne(object);
    }
  }, {
    key: 'replaceOne',
    value: function replaceOne(object) {
      var _objectType2 = t.ref(InsertType);

      var _returnType3 = t.return(t.ref(ResultType));

      t.param('object', _objectType2).assert(object);

      if (!object.created) object.created = new Date();
      if (!object.updated) object.updated = new Date();

      return this.table().get(object.id).replace(object).then(function () {
        return object;
      }).then(function (_arg3) {
        return _returnType3.assert(_arg3);
      });
    }
  }, {
    key: 'upsertOne',
    value: function upsertOne(object) {
      var _objectType3 = t.ref(UpdateType);

      var _returnType4 = t.return(t.ref(ResultType));

      t.param('object', _objectType3).assert(object);

      if (!object.updated) object.updated = new Date();

      return this.table().insert(object, { conflict: 'replace' }).run().then(function () {
        return object;
      }).then(function (_arg4) {
        return _returnType4.assert(_arg4);
      });
    }
  }, {
    key: 'replaceSeveral',
    value: function replaceSeveral(objects) {
      var _this3 = this;

      var _objectsType = t.array(t.ref(InsertType));

      var _returnType5 = t.return(t.array(t.ref(ResultType)));

      t.param('objects', _objectsType).assert(objects);

      return Promise.all(objects.map(function (object) {
        return _this3.replaceOne(object);
      })).then(function (_arg5) {
        return _returnType5.assert(_arg5);
      });
    }
  }, {
    key: 'partialUpdateByKey',
    value: function partialUpdateByKey(key, partialUpdate) {
      var _keyType = t.any();

      var _partialUpdateType = t.object();

      var _returnType6 = t.return(t.void());

      t.param('key', _keyType).assert(key);
      t.param('partialUpdate', _partialUpdateType).assert(partialUpdate);

      return this.table().get(key).update(partialUpdate).run().then(function (_arg6) {
        return _returnType6.assert(_arg6);
      });
    }
  }, {
    key: 'partialUpdateOne',
    value: function partialUpdateOne(object, partialUpdate) {
      var _objectType4 = t.ref(ResultType);

      var _partialUpdateType2 = t.ref(UpdateType);

      var _returnType7 = t.return(t.ref(ResultType));

      t.param('object', _objectType4).assert(object);
      t.param('partialUpdate', _partialUpdateType2).assert(partialUpdate);

      return this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(function (res) {
        return res.changes.new_val;
      }).then(function (_arg7) {
        return _returnType7.assert(_arg7);
      });
    }
  }, {
    key: 'partialUpdateMany',
    value: function partialUpdateMany(criteria, partialUpdate) {
      var _partialUpdateType3 = t.object();

      var _returnType8 = t.return(t.void());

      t.param('partialUpdate', _partialUpdateType3).assert(partialUpdate);

      return this.table().filter(criteria).update(partialUpdate).run().then(function (_arg8) {
        return _returnType8.assert(_arg8);
      });
    }
  }, {
    key: 'deleteByKey',
    value: function deleteByKey(key) {
      var _keyType2 = t.any();

      var _returnType9 = t.return(t.void());

      t.param('key', _keyType2).assert(key);

      return this.table().get(key).delete().run().then(function (_arg9) {
        return _returnType9.assert(_arg9);
      });
    }
  }, {
    key: 'cursor',
    value: function cursor(query, sort) {
      var _sortType2 = t.nullable(t.object());

      t.param('sort', _sortType2).assert(sort);
      // : Promise<RethinkCursor<ModelType>> {
      if (sort) throw new Error('sort is not supported');
      throw new Error('Not Supported yet, please use query().run({ cursor: true })');
    }
  }, {
    key: 'findAll',
    value: function findAll() {
      t.return(t.void());

      throw new Error('Not supported, please use query().run()');
    }
  }, {
    key: 'findByKey',
    value: function findByKey(key) {
      var _keyType3 = t.any();

      var _returnType11 = t.return(t.nullable(t.ref(ResultType)));

      t.param('key', _keyType3).assert(key);

      return this.table().get(key).run().then(function (_arg10) {
        return _returnType11.assert(_arg10);
      });
    }
  }, {
    key: 'findOne',
    value: function findOne(query) {
      var _returnType12 = t.return(t.nullable(t.ref(ResultType)));

      return query.run({ cursor: true }).then(function (cursor) {
        return cursor.next().catch(function () {
          return null;
        });
      }).then(function (_arg11) {
        return _returnType12.assert(_arg11);
      });
    }
  }]);

  return RethinkStore;
}(AbstractStore), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'tableName', [_dec], {
  enumerable: true,
  initializer: null
})), _class));
export { RethinkStore as default };
//# sourceMappingURL=RethinkStore.js.map