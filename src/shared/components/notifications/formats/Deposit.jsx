import React from 'react';
import PropTypes from 'prop-types';
import { basePropTypes } from '../FormatNotification'

const Deposit = ({ notification }) => {
  return <div />
}
Deposit.propTypes = {
  ...basePropTypes,
  club_name: PropTypes.string,
  club_slug: PropTypes.string,
  club_photo: PropTypes.string,
  bank_account: PropTypes.string,
  amount: PropTypes.string,
  currency: PropTypes.string,
}
export default Deposit;
