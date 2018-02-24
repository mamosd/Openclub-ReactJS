// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Spin from 'antd/lib/spin';

// Components
import StripeCardList from 'components/custom_form_fields/StripeCardList';
import AddCard from 'components/payment/AddCard';

// Utilities

class StripePaymentMethod extends Component {
  static propTypes = {
    input: PropTypes.object,
    data: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.addCard = this.addCard.bind(this)
    this.setCard = this.setCard.bind(this);
    this.successCallback = this.successCallback.bind(this);

    this.state = {
      addCard: false
    }
  }
  successCallback() {
    this.setState({ addCard: false });
  }
  addCard() {
    this.setState({ addCard: true });
  }
  setCard(token) {
    this.props.input.onChange(token);
  }
  render() {
    const { user, loading = true } = this.props.data;
    if (!user) return <div />;
    const { cards = [] } = user.stripe_account || {};
    return (
      <Spin spinning={loading}>
        Existing payment method:
        <StripeCardList
          cards={cards}
          addCard={this.addCard}
          setCard={this.setCard}
          />
        {(this.state.addCard || cards.length === 0) && <div style={{ display: 'block' }}>
          <AddCard successCallback={this.succcessCallback} />
        </div>}
      </Spin>
    );
  }
}

const stripeAccountQuery = gql`
query user {
  user{
    _id
    stripe_account {
      cards
      default_source
    }
  }
}
`

const StripePaymentMethodApollo = graphql(stripeAccountQuery, {
  skip: props => !props.token
})(StripePaymentMethod)

const StripePaymentMethodField = props => <Field {...props} name="paymentSource" size="large" component={StripePaymentMethodApollo} />

const StripePaymentMethodRedux = connect(state => ({
  token: state.auth.token
}))(StripePaymentMethodField);

export default StripePaymentMethodRedux;
