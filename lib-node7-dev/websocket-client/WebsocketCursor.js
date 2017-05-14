'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

var _WebsocketStore = require('./WebsocketStore');

var _WebsocketStore2 = _interopRequireDefault(_WebsocketStore);

var _AbstractCursor = require('../store/AbstractCursor');

var _AbstractCursor2 = _interopRequireDefault(_AbstractCursor);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

const ResultType = _flowRuntime2.default.tdz(() => _types.ResultType);

let WebsocketCursor = (_dec = _flowRuntime2.default.decorate(_flowRuntime2.default.nullable(_flowRuntime2.default.number())), _dec2 = _flowRuntime2.default.decorate(_flowRuntime2.default.nullable(_flowRuntime2.default.object())), _dec3 = _flowRuntime2.default.decorate(_flowRuntime2.default.nullable(_flowRuntime2.default.object())), (_class = class extends _AbstractCursor2.default {

  constructor(store, options) {
    let _storeType = _flowRuntime2.default.ref(_WebsocketStore2.default);

    _flowRuntime2.default.param('store', _storeType).assert(store);

    super(store);

    _initDefineProp(this, '_idCursor', _descriptor, this);

    _initDefineProp(this, '_options', _descriptor2, this);

    _initDefineProp(this, '_result', _descriptor3, this);

    _flowRuntime2.default.bindTypeParameters(this, _flowRuntime2.default.ref(_WebsocketStore2.default));

    this._options = options;
  }

  /* options */

  limit(newLimit) {
    let _newLimitType = _flowRuntime2.default.number();

    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.this(this));

    _flowRuntime2.default.param('newLimit', _newLimitType).assert(newLimit);

    if (this._idCursor) throw new Error('Cursor already created');
    this._options.limit = newLimit;
    return Promise.resolve(this).then(_arg => _returnType.assert(_arg));
  }

  /* results */

  _create() {
    if (this._idCursor) throw new Error('Cursor already created');
    return this.store.connection.emit('createCursor', this._options).then(idCursor => {
      if (!idCursor) return;
      this._idCursor = idCursor;
    });
  }

  emit(type, ...args) {
    const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.any());

    if (!this._idCursor) {
      return this._create().then(() => this.emit(type, ...args)).then(_arg2 => _returnType2.assert(_arg2));
    }

    return this.store.emit('cursor', { type, id: this._idCursor }, args).then(_arg3 => _returnType2.assert(_arg3));
  }

  advance(count) {
    let _countType = _flowRuntime2.default.number();

    _flowRuntime2.default.param('count', _countType).assert(count);

    this.emit('advance', count);
    return this;
  }

  next() {
    const _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.nullable(_flowRuntime2.default.any()));

    return this.emit('next').then(result => {
      this._result = result;
      this.key = result && result[this._store.keyPath];
      return this.key;
    }).then(_arg4 => _returnType3.assert(_arg4));
  }

  result() {
    const _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.nullable(_flowRuntime2.default.ref(ResultType)));

    return Promise.resolve(this._result).then(_arg5 => _returnType4.assert(_arg5));
  }

  count(applyLimit = false) {
    let _applyLimitType = _flowRuntime2.default.boolean();

    _flowRuntime2.default.param('applyLimit', _applyLimitType).assert(applyLimit);

    return this.emit('count', applyLimit);
  }

  close() {
    const _returnType5 = _flowRuntime2.default.return(_flowRuntime2.default.void());

    if (!this._store) return Promise.resolve().then(_arg6 => _returnType5.assert(_arg6));

    const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
    this._idCursor = null;
    this._options = null;
    this._store = undefined;
    this._result = undefined;
    return closedPromise.then(_arg7 => _returnType5.assert(_arg7));
  }

  toArray() {
    const _returnType6 = _flowRuntime2.default.return(_flowRuntime2.default.array(_flowRuntime2.default.array(_flowRuntime2.default.ref(ResultType))));

    return this.store.emit('cursor toArray', this._options).then(result => {
      this.close();
      return result;
    }).then(_arg8 => _returnType6.assert(_arg8));
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, '_idCursor', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, '_options', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, '_result', [_dec3], {
  enumerable: true,
  initializer: null
})), _class));
exports.default = WebsocketCursor;
//# sourceMappingURL=WebsocketCursor.js.map