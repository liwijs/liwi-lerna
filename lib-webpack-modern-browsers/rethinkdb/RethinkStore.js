import RethinkConnection from './RethinkConnection';
import AbstractStore from '../store/AbstractStore';
import Query from './Query';
// import RethinkCursor from './RethinkCursor';

export default class RethinkStore extends AbstractStore {

  constructor(connection, tableName) {
    super(connection);
    this.keyPath = 'id';
    this._tableName = tableName;
    this.r = this.connection._connection;
  }

  table() {
    return this.r.table(this._tableName);
  }

  createQuery(query) {
    return new Query(this, query);
  }

  query() {
    return this.table();
  }

  _query(criteria, sort) {
    var query = this.table();

    if (criteria) {
      query.filter(criteria);
    }

    if (sort) {
      Object.keys(sort).forEach(key => {
        if (sort[key] === -1) {
          query.orderBy(this.r.desc(key));
        } else {
          query.orderBy(key);
        }
      });
    }

    return query;
  }

  create() {
    return this.r.tableCreate(this._tableName);
  }

  insertOne(object) {
    if (!object.created) {
      object.created = new Date();
    }

    return this.table().insert(object).then(_ref => {
      var inserted = _ref.inserted;
      var generatedKeys = _ref.generated_keys;

      if (inserted !== 1) throw new Error('Could not insert');
      object.id = generatedKeys[0];
    }).then(() => object);
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.table().get(object.id).replace(object).then(() => object);
  }

  upsertOne(object) {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.table().insert(object, { conflict: 'replace' }).run().then(() => object);
  }

  replaceSeveral(objects) {
    return Promise.all(objects.map(object => this.replaceOne(object)));
  }

  partialUpdateByKey(key, partialUpdate) {
    return this.table().get(key).update(partialUpdate).run();
  }

  partialUpdateOne(object, partialUpdate) {
    return this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(res => res.changes.new_val);
  }

  partialUpdateMany(criteria, partialUpdate) {
    return this.table().filter(criteria).update(partialUpdate).run();
  }

  deleteByKey(key) {
    return this.table().get(key).delete().run();
  }

  cursor(criteria, sort) {
    // : Promise<RethinkCursor<ModelType>> {
    throw new Error('Not Supported yet, please use query().run({ cursor: true })');
  }

  findAll(criteria, sort) {
    var query = this._query(criteria, sort);
    return query.run();
  }

  findByKey(key) {
    return this.table().get(key).run();
  }

  findOne(criteria, sort) {
    var query = this._query(criteria, sort);
    return query.run({ cursor: true }).then(cursor => cursor.next().catch(err => null));
  }
}
//# sourceMappingURL=RethinkStore.js.map