import React from 'react';
import PropTypes from 'prop-types';
import { basePropTypes } from '../FormatNotification'

const Post = ({ notification }) => {
  return <div />
}
Post.propTypes = {
  ...basePropTypes,
  feed_url: PropTypes.string,
  feed_name: PropTypes.string,
  feed_photo: PropTypes.string,
  actor_name: PropTypes.string,
  actor_photo: PropTypes.string,
  post_exerpt: PropTypes.string,
}
export default Post;
