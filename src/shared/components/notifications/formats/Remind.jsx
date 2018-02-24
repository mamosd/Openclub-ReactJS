import React from 'react';
import PropTypes from 'prop-types';
import { basePropTypes } from '../FormatNotification'

const Remind = ({ notification }) => {
  return <div />
}
Remind.propTypes = {
  ...basePropTypes,
  event_slug: PropTypes.string,
  event_name: PropTypes.string,
  event_time: PropTypes.string,
  event_photo: PropTypes.string
}
export default Remind;
