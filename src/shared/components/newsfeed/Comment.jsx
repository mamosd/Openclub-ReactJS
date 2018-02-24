import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { truncate } from 'lodash';
import { Button, Badge } from 'antd';
import m from 'moment';

// Utils
import userPhoto from 'utils/user_photo'

class Comment extends Component {
  static propTypes = {
    likes: PropTypes.array,
    likes_count: PropTypes.number,
    text: PropTypes.string,
    images: PropTypes.array,
    user: PropTypes.object,
    attachment: PropTypes.object,
    indexInArray: PropTypes.number,
    highlighted: PropTypes.bool
  }
  constructor(props) {
    super(props);

    this.state = {
      expanded: this.props.highlighted || false
    }
  }
  render() {
    const { datetime, likes, likes_count: likesCount, text, images, user, attachment, indexInArray, highlighted } = this.props;
    return (
      <div className="comment">
        <div className="media">
          <div className="creator-image">
            <img src={userPhoto(user)} alt={user.name} role="presentation" />
          </div>
        </div>
        <div className="comment-body">
          <div className="creator-title">
            <p className="m0 text-bold">{user.name || 'No name'} <small>commented {m(datetime).fromNow()}</small></p>
          </div>
          <div className={cx('text', { 'expanded': this.state.expanded })}>
            {this.state.expanded ? text : truncate(text, { length: 128, separator: ' ' })} {!this.state.expanded && text.length > 128 && <a href="#" onClick={e => { e.preventDefault(); this.setState({ expanded: true }) }}>load more</a>}
          </div>
          <div className="like">
            <Button icon="like" size="small" type="primary" onClick={this.like}>Like{`${likesCount ? ' (' + likesCount + ')' : ''}`}</Button>
          </div>
        </div>
      </div>
    )
  }
}
export default Comment;
