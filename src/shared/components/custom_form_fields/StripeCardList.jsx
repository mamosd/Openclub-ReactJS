
// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select, { Option } from 'antd/lib/select';
import CreditCard from 'components/cards/CreditCard'

// Stylesheets
import './StripeCardList.scss'

class StripeCardList extends Component {
  static propTypes = {
    cards: PropTypes.array,
    addCard: PropTypes.func,
    setCard: PropTypes.func
  }
  constructor(props) {
    super(props);

    this.selectValue = this.selectValue.bind(this);

    this.state = {
      value: null
    }
  }
  selectValue(id) {
    this.setState({ value: id });
    if (id === 'add' && this.props.addCard) this.props.addCard();
    if (id !== 'add' && this.props.setCard) this.props.setCard(id);
  }
  componentDidMount() {
    const { cards = [] } = this.props;
    if (cards.length > 0) this.selectValue(cards[0].id);
  }
  componentWillReceiveProps(nextProps) {
    const { cards: currentCards = [] } = this.props;
    const { cards: nextCards = [] } = nextProps;
    if (currentCards.length === 0 && nextCards.length > 0) {
      this.selectValue(nextCards[0].id)
    }
    if (currentCards.length !== 0 && nextCards.length > currentCards.length) {
      this.selectValue(nextCards[nextCards.length - 1].id);
    }
  }
  render() {
    const { cards = [], addCard } = this.props;

    return (
      <Select size="large" onSelect={this.selectValue} value={this.state.value}>
        {cards.map(card => <Option value={card.id} key={card.id}><CreditCard key={card.id} {...card} /></Option>)}
        {addCard && <Option value="add" key="add"><i className="fa fa-plus" /> Add New Card</Option>}
      </Select>
    )
  }
}
export default StripeCardList;
