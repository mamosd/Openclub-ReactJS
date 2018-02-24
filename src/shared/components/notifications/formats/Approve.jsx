import React from 'react';
import PropTypes from 'prop-types';
import { basePropTypes } from '../FormatNotification'

const Approve = ({ notification }) => {
  return <div />
}
Approve.propTypes = {
  ...basePropTypes,
  club_slug: PropTypes.string,
  club_name: PropTypes.string,
  club_photo: PropTypes.string,
  accepted: PropTypes.bool,
}
export default Approve;
