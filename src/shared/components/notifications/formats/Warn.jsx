import React from 'react';
import PropTypes from 'prop-types';
import { basePropTypes } from '../FormatNotification'

const Warn = ({ notification }) => {
  return <div />
}
Warn.propTypes = {
  ...basePropTypes,
  path: PropTypes.string,
  message: PropTypes.string,
  severity: PropTypes.string,
}
export default Warn;
