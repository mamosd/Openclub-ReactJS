import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { checkAuthentication } from 'modules/auth/actions'
import Spin from 'antd/lib/spin'

class AuthLoader extends Component {
  static propTypes = {
    checkAuthentication: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.element
    ]),
    auth0Loaded: PropTypes.bool
  }
  componentWillMount() {
    this.props.checkAuthentication()
  }

  render() {
    const { auth0Loaded, children } = this.props
    // only render the app if the auth0 process has completed
    // or we are doing ssr
    return (auth0Loaded || process.env.IS_SERVER) ? React.cloneElement(children, {...this.props}) : <Spin tip="Loading..."><div style={{ display: 'block', width: '100%', height: '100vh' }} /></Spin>
  }
}

export default connect(state => ({
  auth0Loaded: state.auth.auth0Loaded,
  token: state.auth.token
}), { checkAuthentication })(AuthLoader)

export {
  AuthLoader
}
