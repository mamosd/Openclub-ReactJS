import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import apolloClient from 'modules/apollo'

import { logoutUser } from 'modules/auth/actions';
import Loading from 'components/Loading/Loading';
import message from 'antd/lib/message';

class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  componentDidMount() {
    this.props.logout();
    setTimeout(() => {
      apolloClient.resetStore();
      localStorage.clear();
      message.success('Logged out');
      this.context.router.transitionTo('/login')
    }, 5);
  }
  render() {
    return <Loading />;
  }
}

export default connect(state => ({
  token: state.auth.token
}), {
  logout: logoutUser
})(Logout);
