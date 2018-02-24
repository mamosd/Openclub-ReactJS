import React from 'react';
import PropTypes from 'prop-types';
import { basePropTypes } from '../FormatNotification'

const Like = ({ notification }) => {
  return <div />
}
Like.propTypes = {
  ...basePropTypes,
  actor_name: PropTypes.string,
  actor_photo: PropTypes.string,
  post_exerpt: PropTypes.string,
}
export default Like;
