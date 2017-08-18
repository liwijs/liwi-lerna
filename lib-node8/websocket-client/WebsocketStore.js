'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _WebsocketCursor = require('./WebsocketCursor');

var _WebsocketCursor2 = _interopRequireDefault(_WebsocketCursor);

var _extendedJson = require('../extended-json');

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('liwi:websocket-client');

let WebsocketStore = class extends _AbstractStore2.default {

  constructor(websocket, restName) {

    if (super(websocket), this.keyPath = 'id', !restName) throw new Error(`Invalid restName: "${restName}"`);

    this.restName = restName;
  }

  createQuery(key) {
    return logger.debug('createQuery', { key }), new _Query2.default(this, key);
  }

  emit(type, ...args) {
    if (logger.debug('emit', { type, args }), this.connection.isDisconnected()) throw new Error('Websocket is not connected');

    return this.connection.emit('rest', {
      type,
      restName: this.restName,
      json: (0, _extendedJson.encode)(args)
    }).then(result => result && (0, _extendedJson.decode)(result));
  }

  emitSubscribe(type, ...args) {
    const emit = () => this.emit(type, ...args);
    return emit().then(() => (this.connection.on('reconnect', emit), () => this.connection.off('reconnect', emit)));
  }

  insertOne(object) {
    return this.emit('insertOne', object);
  }

  updateOne(object) {
    return this.emit('updateOne', object);
  }

  updateSeveral(objects) {
    return this.emit('updateSeveral', objects);
  }

  partialUpdateByKey(key, partialUpdate) {
    return this.emit('partialUpdateByKey', key, partialUpdate);
  }

  partialUpdateOne(object, partialUpdate) {
    return this.emit('partialUpdateOne', object, partialUpdate);
  }

  partialUpdateMany(criteria, partialUpdate) {
    return this.emit('partialUpdateMany', criteria, partialUpdate);
  }

  deleteByKey(key) {
    return this.emit('deleteByKey', key);
  }

  deleteOne(object) {
    return this.emit('deleteOne', object);
  }

  cursor(criteria, sort) {
    return Promise.resolve(new _WebsocketCursor2.default(this, { criteria, sort }));
  }

  findByKey(key) {
    return this.findOne({ id: key });
  }

  findOne(criteria, sort) {
    return this.emit('findOne', criteria, sort);
  }
};
exports.default = WebsocketStore;
//# sourceMappingURL=WebsocketStore.js.map