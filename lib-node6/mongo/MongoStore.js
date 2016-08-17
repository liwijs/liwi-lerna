'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongodb = require('mongodb');

var _collection = require('mongodb/lib/collection');

var _collection2 = _interopRequireDefault(_collection);

var _db = require('mongodb/lib/db');

var _db2 = _interopRequireDefault(_db);

var _MongoConnection = require('./MongoConnection');

var _MongoConnection2 = _interopRequireDefault(_MongoConnection);

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _MongoCursor = require('./MongoCursor');

var _MongoCursor2 = _interopRequireDefault(_MongoCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MongoStore extends _AbstractStore2.default {

    constructor(connection, collectionName) {
        super(connection);

        this.keyPath = '_id';
        if (!collectionName) {
            throw new Error(`Invalid collectionName: "${ collectionName }"`);
        }

        this._collection = connection.getConnection().then(db => this._collection = db.collection(collectionName));
    }

    get collection() {
        if (this.connection.connectionFailed) {
            return Promise.reject(new Error('MongoDB connection failed'));
        }

        return Promise.resolve(this._collection);
    }

    insertOne(object) {
        if (!object._id) {
            object._id = new _mongodb.ObjectID().toString();
        }
        if (!object.created) {
            object.created = new Date();
        }

        return this.collection.then(collection => collection.insertOne(object)).then(_ref => {
            let result = _ref.result;
            let connection = _ref.connection;
            let ops = _ref.ops;

            if (!result.ok || result.n !== 1) {
                throw new Error('Fail to insert');
            }
        }).then(() => object);
    }

    updateOne(object) {
        if (!object.updated) {
            object.updated = new Date();
        }

        return this.collection.then(collection => collection.updateOne({ _id: object._id }, object)).then(() => object);
    }

    upsertOne(object) {
        if (!object.updated) {
            object.updated = new Date();
        }

        return this.collection.then(collection => collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true })).then(() => object);
    }

    updateSeveral(objects) {
        return Promise.all(objects.map(object => this.updateOne(object)));
    }

    _partialUpdate(partialUpdate) {
        // https://docs.mongodb.com/manual/reference/operator/update/
        // if has a mongo operator
        if (Object.keys(partialUpdate).some(key => key[0] === '$')) {
            return partialUpdate;
        } else {
            return { $set: partialUpdate };
        }
    }

    partialUpdateByKey(key, partialUpdate) {
        partialUpdate = this._partialUpdate(partialUpdate);
        return this.collection.then(collection => collection.updateOne({ _id: key }, partialUpdate));
    }

    partialUpdateOne(object, partialUpdate) {
        partialUpdate = this._partialUpdate(partialUpdate);
        return this.partialUpdateByKey(object._id, partialUpdate).then(res => this.findByKey(object._id));
    }

    partialUpdateMany(criteria, partialUpdate) {
        partialUpdate = this._partialUpdate(partialUpdate);
        return this.collection.then(collection => collection.updateMany(criteria, partialUpdate)).then(res => null); // TODO return updated object
    }

    deleteByKey(key) {
        return this.collection.then(collection => collection.removeOne({ _id: key })).then(() => null);
    }

    cursor(criteria, sort) {
        return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => new _MongoCursor2.default(this, cursor));
    }

    findByKey(key) {
        return this.findOne({ _id: key });
    }

    findOne(criteria, sort) {
        return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => cursor.limit(1).next());
    }
}
exports.default = MongoStore;
//# sourceMappingURL=MongoStore.js.map