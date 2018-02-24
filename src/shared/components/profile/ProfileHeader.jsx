import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd'
import cx from 'classnames'
import './ProfileHeader.scss'
import _ from 'lodash';

class ProfileHeader extends Component {
  static defaultProps = {
    collapsed: false
  }
  renderProfileBackdrop() {
    const { images, name, collapsed } = this.props
    const square = images && images.square ? images.square : '/empty-club.png'
    const classes = cx({
      'media-object': true,
      'img-rounded-corners': collapsed === false,
      'img-light-border': collapsed === false,
      'thumb128': collapsed === false
    })
    return (
      <div className="media-left">
        <div className="profile-backdrop">
          <a href="#">
            <img src={square} alt={name} className={classes} />
          </a>
        </div>
      </div>
    )
  }
  renderHeading() {
    const { name, location } = this.props

    let contents = []
    if (typeof name !== 'undefined') {
      contents.push(<h4 className="objectpage-heading" key="op-heading">{name}</h4>)
    }
    if (typeof tagline !== 'undefined') {
      contents.push(<span className="location" key="op-location">{location}</span>)
    }

    return (
      <div className="media-body media-bottom objectpage-label">
        {contents}
      </div>
    )
  }
  render() {
    const { buttons } = this.props

    const headerImageStyles = {
      backgroundImage: `url(${_.get(this.props, 'images.background') || '/coverphoto.jpg'})`
    }

    const classes = cx({
      'objectpage-header-container': true,
      'collapsed': this.props.collapsed
    })

    return (
      <div className={classes}>
        <div className="banner-container">
          <div className="background" style={headerImageStyles} />
          <div className="header-details">
            <div className="details-container">
              {this.renderProfileBackdrop()}
              {this.renderHeading()}
            </div>
            <div className="header-buttons">
              {buttons}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ProfileHeader.propTypes = {
  name: PropTypes.string,
  location: PropTypes.string,
  images: PropTypes.object,
  collapsed: PropTypes.bool
}

export default ProfileHeader
