'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _desc, _value, _class, _descriptor, _class2, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _types = require('alp-react-redux/types');

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

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

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const ReactComponentType = _flowRuntime2.default.tdz(() => _types.ReactComponentType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.object(_flowRuntime2.default.property('name', _flowRuntime2.default.string()), _flowRuntime2.default.property('query', _flowRuntime2.default.ref(_AbstractQuery2.default)), _flowRuntime2.default.property('component', _flowRuntime2.default.ref(ReactComponentType)), _flowRuntime2.default.property('loadingComponent', _flowRuntime2.default.nullable(_flowRuntime2.default.ref(ReactComponentType)))));

let FindComponent = (_dec = _flowRuntime2.default.decorate(PropsType), (_class = (_temp2 = _class2 = class extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), _initDefineProp(this, 'props', _descriptor, this), this.state = {
      fetched: false,
      result: undefined
    }, _temp;
  }

  componentDidMount() {
    const { query } = this.props;
    this._find = query.fetch(result => {
      let _resultType = _flowRuntime2.default.any();

      _flowRuntime2.default.param('result', _resultType).assert(result);

      if (!this._find) return;
      this.setState({
        fetched: true,
        result
      });
      delete this._find;
    });
  }

  componentWillUnmount() {
    if (this._find) {
      // this._find.cancel();
      delete this._find;
    }
  }

  render() {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactNodeType));

    if (!this.state.fetched) {
      return _returnType.assert(this.props.loadingComponent ? _react2.default.createElement(this.props.loadingComponent) : null);
    }

    return _returnType.assert(_react2.default.createElement(this.props.component, { [this.props.name]: this.state.result }));
  }
}, _class2.propTypes = _flowRuntime2.default.propTypes(PropsType), _temp2), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'props', [_dec], {
  enumerable: true,
  initializer: null
})), _class));
exports.default = FindComponent;
//# sourceMappingURL=Find.js.map