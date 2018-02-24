import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { inlineLogin }  from 'modules/auth/actions'
import ReactPlayer from 'react-player'
import { Row, Col } from 'antd'

import './Home.scss'

class HomeView extends Component {
  static propTypes = {
      login: PropTypes.func,
      inlineLogin: PropTypes.func
  }
  componentDidMount() {
    this.props.inlineLogin('home-lock-container');
  }
  render() {
    return (
      <section>
        <div className="bg-full bg-pic1 container-fluid">
          <div className="container-content">
            <Row gutter={16} className="home-intro" style={{ margin: 0 }}>
              <Col xs={{span:24, offset:0}} md={{span:15, offset:1}} className="home-title">
                <div className="text">
                  <h1>Bringing your club to the social web.</h1>
                  <a className="btn-xl btn" href="#" onClick={this.props.login}>Explore</a>
                  <a className="btn-xl btn" href="https://www.openclub.co/#features" rel="noopener noreferrer" target="_blank">Features</a>
                </div>
              </Col>
              <Col xs={{span:24, offset:0}} md={{span:6, offset:1}} className="home-login">
                <div id="home-lock-container" className="login"/>
              </Col>
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
/*
<section>
  <div className="bg-full bg-pic1 container-fluid">
    <div className="container-content">
      <div className="intro">
        <div className="col-md-8">
          <div className="text">
            <h1>Bringing your club to the social web.</h1>
            <a className="btn-xl btn hidden-sm hidden-xs" href="#" onClick={this.props.login}>Explore</a>
            <a className="btn-xl btn hidden-sm hidden-xs" href="https://www.openclub.co/#features" rel="noopener noreferrer" target="_blank">Features</a>
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <div id="home-lock-container" className="login"/>
        </div>
      </div>
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
*/

export default connect(null, { inlineLogin })(HomeView)
