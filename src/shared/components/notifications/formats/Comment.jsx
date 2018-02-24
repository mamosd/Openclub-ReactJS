import React from 'react';
import PropTypes from 'prop-types';
import { basePropTypes } from '../FormatNotification'

const Comment = ({ notification }) => {
  return <div />
}
Comment.propTypes = {
  ...basePropTypes,
  actor_name: PropTypes.string,
  actor_photo: PropTypes.string,
  comment_exerpt: PropTypes.string,
  type: PropTypes.oneOf([
    'comment',
    'reply'
  ]),
}
export default Comment;
