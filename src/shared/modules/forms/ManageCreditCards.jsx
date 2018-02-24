import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'antd/lib/tooltip'
import Button, { Group as ButtonGroup } from 'antd/lib/button'
import CardList from 'components/payment/CardList'

import AddCard from 'components/payment/AddCard';

class ManageCreditCards extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    data: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.state = { loading: false }
  }
  makePrimary(id) {
    return true;
  }
  deleteCard(id) {
    return true;
  }
  render() {
    const { viewer } = this.props;
    return (
      <div className="max-form">
        {viewer.stripe_account && viewer.stripe_account.cards && viewer.stripe_account.cards.length > 0 && (
        <CardList
          cards={viewer.stripe_account.cards}
          defaultCard={viewer.stripe_account.default_source}
          actions={card => (
            <ButtonGroup style={{ whiteSpace: 'nowrap' }}>
              <Tooltip placement="top" title="Make primary card"><Button type="primary" icon="credit-card" onClick={this.makePrimary.bind(this, card.id)}>Primary</Button></Tooltip>
              <Tooltip placement="top" title="Delete card"><Button type="danger" icon="delete" onClick={this.deleteCard.bind(this, card.id)}>Delete</Button></Tooltip>
            </ButtonGroup>
          )}
        />)}
        <AddCard />
      </div>
    )
  }
}

export default ManageCreditCards;
