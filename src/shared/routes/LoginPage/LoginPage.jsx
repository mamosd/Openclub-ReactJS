import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { inlineLogin, hideInlineLogin }  from 'modules/auth/actions'
import ReactPlayer from 'react-player'
import { Row, Col } from 'antd'

import '../Home/Home.scss'

class LoginPageView extends Component {
  static propTypes = {
      login: PropTypes.func,
      inlineLogin: PropTypes.func,
      hideInlineLogin: PropTypes.func
  }
  componentDidMount() {
    this.props.inlineLogin('home-lock-container');
  }
  componentWillUnmount() {
    this.props.hideInlineLogin('home-lock-container');
  }
  render() {
    return (
      <section>
        <div className="bg-full bg-pic1 container-fluid">
          <div className="container-content">
            <Row gutter={16} className="help-login" style={{ maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
              <div className="text">
                <h1>
                  Login to OpenClub
                </h1>
              </div>
                <div id="home-lock-container" className="login" />
            </Row>
          </div>
          <ReactPlayer
            url="https://www.youtube.com/embed/131eQ5HePfg"
            playing
            loop
            volume={0}
            playbackRate={0.6}
            className="video-container hidden-sm hidden-xs"
            width=""
            height=""
            style={{}}
          />
        </div>
      </section>
    )
  }
}

export default connect(null, { inlineLogin, hideInlineLogin })(LoginPageView)
