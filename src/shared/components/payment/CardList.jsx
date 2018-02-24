import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ds from 'deli-space'
import cx from 'classnames'
import Tooltip from 'antd/lib/tooltip';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import Button, { Group as ButtonGroup } from 'antd/lib/button';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import error from 'utils/error';

import CreditCard from 'components/cards/CreditCard'

import './CardList.scss'

class CardList extends Component {
  static propTypes = {
    cards: PropTypes.array,
    defaultCard: PropTypes.string,
    deleteCreditCard: PropTypes.func,
    changePrimaryCard: PropTypes.func
  }
  constructor(props) {
    super(props)

    this.deleteCard = this.deleteCard.bind(this);
    this.changePrimaryCard = this.changePrimaryCard.bind(this);
  }
  async deleteCard(card) {
    const { deleteCreditCard } = this.props;

    try {
      await deleteCreditCard({
        variables: {
          card
        }
      });
      message.success('Card Deleted', 15);
    } catch (err) {
      Modal.error({
        title: "Error deleting card",
        content: error(err)
      });
    }
  }
  async changePrimaryCard(card) {
    const { changePrimaryCard } = this.props;

    try {
      await changePrimaryCard({
        variables: {
          card
        }
      });
      message.success('Primary card updated', 15);
    } catch (err) {
      Modal.error({
        title: "Error changing primary card",
        content: error(err)
      });
    }
  }
  confirmDeleteCard(card, primary) {
    Modal.confirm({
      title: 'Delete Card',
      content: primary ? 'Are you sure you wish to delete this card? Any automatic renewals will fail until you add a new card.' : 'Are you sure you wish to delete this card?',
      onOk: this.deleteCard.bind(this, card),
      okText: 'Delete Card',
      cancelText: 'Cancel'
    })
  }
  confirmChangePrimaryCard(card, primary) {
    if (primary) {
      message.warning('This is already your primary card.', 10);
      return;
    }
    Modal.confirm({
      title: 'Change Primary Card',
      content: 'Are you sure you wish to change your primary card? Any automatic payments will now come from this card.',
      onOk: this.changePrimaryCard.bind(this, card),
      okText: 'Make Primary',
      cancelText: 'Cancel'
    })
  }
  render() {
    const { cards, defaultCard } = this.props;

    const isPrimary = id => id === defaultCard;

    const actions = (id) => (
      <ButtonGroup>
        <Tooltip title={cx({ 'Make Default': !isPrimary(id), 'Default Card': isPrimary(id) })}>
          <Button
            type={cx({ 'primary': !isPrimary(id), 'default': isPrimary(id) })}
            icon={cx({ 'credit-card': !isPrimary(id), 'check': isPrimary(id)})}
            onClick={this.confirmChangePrimaryCard.bind(this, id, isPrimary(id))}
            />
        </Tooltip>
        <Tooltip title="Delete Card">
          <Button
            type="danger"
            icon="delete"
            onClick={this.confirmDeleteCard.bind(this, id, isPrimary(id))}
            />
        </Tooltip>
      </ButtonGroup>
    )

    return (
      <ul className="credit-card-list">
        {cards.map(card => !card ? null : <li key={card.id} className="card-li"><CreditCard {...card} actions={actions(card.id)} /></li>)}
      </ul>
    )
  }
}

const DeleteCardQuery = gql`
  mutation deleteCreditCard($card: String!) {
    deleteCreditCard(card: $card) {
      _id
      stripe_account {
        cards
        default_source
      }
    }
  }
`

const ChangePrimaryCardQuery = gql`
  mutation changePrimaryCard($card: String!) {
    changePrimaryCard(card: $card) {
      _id
      stripe_account {
        cards
        default_source
      }
    }
  }
`

const CardListApollo = compose(
  graphql(DeleteCardQuery, {
      name: 'deleteCreditCard'
    }),
    graphql(ChangePrimaryCardQuery, {
        name: 'changePrimaryCard'
    })
)(CardList);

export default CardListApollo;
