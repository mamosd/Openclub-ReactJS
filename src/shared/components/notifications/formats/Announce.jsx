import React from 'react';
import PropTypes from 'prop-types';
import { basePropTypes } from '../FormatNotification'

const Announce = ({ notification }) => {
  return <div />
}
Announce.propTypes = {
  ...basePropTypes,
  message: PropTypes.string,
  path: PropTypes.string,
  image: PropTypes.string
}
export default Announce;
