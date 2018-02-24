import React from 'react';
import PropTypes from 'prop-types';
import { basePropTypes } from '../FormatNotification'

const Join = ({ notification }) => {
  return <div />
}
Join.propTypes = {
  ...basePropTypes,
  actor_name: PropTypes.string,
  actor_photo: PropTypes.string,
  club_name: PropTypes.string,
  actor_plan: PropTypes.string,
  club_slug: PropTypes.string,
  pending_approval: PropTypes.bool,
}
export default Join;
