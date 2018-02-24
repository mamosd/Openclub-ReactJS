// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ds from 'deli-space';

import './CreditCard.scss';

class CreditCard extends Component {
  static propTypes = {
    brand: PropTypes.string,
    exp_month: PropTypes.number,
    exp_year: PropTypes.number,
    last4: PropTypes.string,
    actions: PropTypes.element
  }
  render() {
    const { brand, exp_month: expMonth, exp_year: expYear, last4, actions } = this.props;

    const brandLogo = () => {
      const brandClasses = cx({
        'visa': brand === 'Visa',
        'mastercard': brand === 'MasterCard',
        'amex': brand === 'American Express',
        'discover': brand === 'Discover',
        'jcb': brand === 'JCB',
        'diners': brand === 'Diners Club',
        'creditcard': brand === 'Unknown',
      })
      return brandClasses;
    }

    const numberFormat = () => {
      let format = brand === 'American Express' ? [4, 6, 1, 0] : brand === 'Diners Club' ? [4, 6, 0] : [4, 4, 4, 0]; //eslint-disable-line
      return <span style={{ whiteSpace: 'nowrap' }}>{ds('•', ' ', ...format)}{last4}</span>;
    }

    return (
      <div className="credit-card">
        <div className="brand">
          <img src={`/img/cc/${brandLogo()}.png`} alt={brand} />
        </div>
        <div className="card-number">
          {numberFormat()}
        </div>
        <div className="exp">
          <span>{expMonth} / {expYear}</span>
        </div>
        { actions && <div className="actions">
          {actions}
        </div>}
      </div>
    )
  }
}
export default CreditCard;
