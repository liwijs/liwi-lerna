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

import { ObjectID } from 'mongodb';
import Collection from 'mongodb/lib/collection';
import Db from 'mongodb/lib/db';
import MongoConnection from './MongoConnection';
import AbstractStore from '../store/AbstractStore';
import MongoCursor from './MongoCursor';
import { InsertType as _InsertType, UpdateType as _UpdateType, ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
const InsertType = t.tdz(() => _InsertType);
const UpdateType = t.tdz(() => _UpdateType);
const ResultType = t.tdz(() => _ResultType);
let MongoStore = (_dec = t.decorate(function () {
  return t.union(t.ref(Collection), t.ref('Promise', t.ref(Collection)));
}), (_class = class extends AbstractStore {

  constructor(connection, collectionName) {
    let _connectionType = t.ref(MongoConnection);

    let _collectionNameType = t.string();

    t.param('connection', _connectionType).assert(connection);
    t.param('collectionName', _collectionNameType).assert(collectionName);

    super(connection);

    _initDefineProp(this, '_collection', _descriptor, this);

    this.keyPath = '_id';
    t.bindTypeParameters(this, t.ref(MongoConnection));
    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${collectionName}"`);
    }

    this._collection = connection.getConnection().then(db => {
      let _dbType = t.ref(Db);

      t.param('db', _dbType).assert(db);
      return this._collection = db.collection(collectionName);
    }).catch(err => this._collection = Promise.reject(err));
  }

  get collection() {
    const _returnType = t.return(t.ref(Collection));

    if (this.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed')).then(_arg => _returnType.assert(_arg));
    }

    return Promise.resolve(this._collection).then(_arg2 => _returnType.assert(_arg2));
  }

  create() {
    const _returnType2 = t.return(t.ref('Promise'));

    return _returnType2.assert(Promise.resolve());
  }

  insertOne(object) {
    let _objectType = t.ref(InsertType);

    const _returnType3 = t.return(t.ref(ResultType));

    t.param('object', _objectType).assert(object);

    if (!object._id) {
      object._id = new ObjectID().toString();
    }
    if (!object.created) {
      object.created = new Date();
    }

    return this.collection.then(collection => collection.insertOne(object)).then(({ result, connection, ops }) => {
      if (!result.ok || result.n !== 1) {
        throw new Error('Fail to insert');
      }
    }).then(() => object).then(_arg3 => _returnType3.assert(_arg3));
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    let _objectType2 = t.ref(InsertType);

    const _returnType4 = t.return(t.ref(ResultType));

    t.param('object', _objectType2).assert(object);

    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(collection => collection.updateOne({ _id: object._id }, object)).then(() => object).then(_arg4 => _returnType4.assert(_arg4));
  }

  upsertOne(object) {
    let _objectType3 = t.ref(InsertType);

    const _returnType5 = t.return(t.ref(ResultType));

    t.param('object', _objectType3).assert(object);

    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(collection => collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true })).then(() => object).then(_arg5 => _returnType5.assert(_arg5));
  }

  replaceSeveral(objects) {
    let _objectsType = t.array(t.ref(InsertType));

    const _returnType6 = t.return(t.array(t.ref(ResultType)));

    t.param('objects', _objectsType).assert(objects);

    return Promise.all(objects.map(object => this.updateOne(object))).then(_arg6 => _returnType6.assert(_arg6));
  }

  _partialUpdate(partialUpdate) {
    let _partialUpdateType = t.object();

    t.param('partialUpdate', _partialUpdateType).assert(partialUpdate);

    // https://docs.mongodb.com/manual/reference/operator/update/
    // if has a mongo operator
    if (Object.keys(partialUpdate).some(key => key[0] === '$')) {
      return partialUpdate;
    } else {
      return { $set: partialUpdate };
    }
  }

  partialUpdateByKey(key, partialUpdate) {
    let _keyType = t.any();

    let _partialUpdateType2 = t.ref(UpdateType);

    const _returnType7 = t.return(t.ref(ResultType));

    t.param('key', _keyType).assert(key);
    t.param('partialUpdate', _partialUpdateType2).assert(partialUpdate);

    partialUpdate = _partialUpdateType2.assert(this._partialUpdate(partialUpdate));
    return this.collection.then(collection => collection.updateOne({ _id: key }, partialUpdate)).then(_arg7 => _returnType7.assert(_arg7));
  }

  partialUpdateOne(object, partialUpdate) {
    let _objectType4 = t.ref(ResultType);

    let _partialUpdateType3 = t.ref(UpdateType);

    const _returnType8 = t.return(t.ref(ResultType));

    t.param('object', _objectType4).assert(object);
    t.param('partialUpdate', _partialUpdateType3).assert(partialUpdate);

    partialUpdate = _partialUpdateType3.assert(this._partialUpdate(partialUpdate));
    return this.partialUpdateByKey(object._id, partialUpdate).then(() => this.findByKey(object._id)).then(_arg8 => _returnType8.assert(_arg8));
  }

  partialUpdateMany(criteria, partialUpdate) {
    let _partialUpdateType4 = t.ref(UpdateType);

    const _returnType9 = t.return(t.void());

    t.param('partialUpdate', _partialUpdateType4).assert(partialUpdate);

    partialUpdate = _partialUpdateType4.assert(this._partialUpdate(partialUpdate));
    return this.collection.then(collection => collection.updateMany(criteria, partialUpdate)).then(() => null).then(_arg9 => _returnType9.assert(_arg9)); // TODO return updated object
  }

  deleteByKey(key) {
    let _keyType2 = t.any();

    const _returnType10 = t.return(t.void());

    t.param('key', _keyType2).assert(key);

    return this.collection.then(collection => collection.removeOne({ _id: key })).then(() => null).then(_arg10 => _returnType10.assert(_arg10));
  }

  cursor(criteria, sort) {
    let _criteriaType = t.nullable(t.object());

    let _sortType = t.nullable(t.object());

    const _returnType11 = t.return(t.ref(MongoCursor, t.ref(ResultType)));

    t.param('criteria', _criteriaType).assert(criteria);
    t.param('sort', _sortType).assert(sort);

    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => new MongoCursor(this, cursor)).then(_arg11 => _returnType11.assert(_arg11));
  }

  findByKey(key) {
    let _keyType3 = t.any();

    const _returnType12 = t.return(t.nullable(t.ref(ResultType)));

    t.param('key', _keyType3).assert(key);

    return this.findOne({ _id: key }).then(_arg12 => _returnType12.assert(_arg12));
  }

  findOne(criteria, sort) {
    let _criteriaType2 = t.object();

    let _sortType2 = t.nullable(t.object());

    const _returnType13 = t.return(t.nullable(t.ref(ResultType)));

    t.param('criteria', _criteriaType2).assert(criteria);
    t.param('sort', _sortType2).assert(sort);

    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => cursor.limit(1).next()).then(_arg13 => _returnType13.assert(_arg13));
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, '_collection', [_dec], {
  enumerable: true,
  initializer: null
})), _class));
export { MongoStore as default };
//# sourceMappingURL=MongoStore.js.map