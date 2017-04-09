var _class, _temp;

import { PropTypes, Component } from 'react';
import AbstractQuery from '../store/AbstractQuery';

let FindComponent = (_temp = _class = class extends Component {

  componentDidMount() {
    const { query, action, dispatch } = this.props;
    this._find = query.fetch(result => {
      if (!this._find) return;
      dispatch(action(result));
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
    return this.props.children;
  }
}, _class.propTypes = {
  dispatch: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  query: PropTypes.instanceOf(AbstractQuery).isRequired,
  children: PropTypes.node
}, _temp);
export { FindComponent as default };
//# sourceMappingURL=Find.js.map