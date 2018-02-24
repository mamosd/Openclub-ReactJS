import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FieldContainer,
  Button,
} from 'components/form_controls'
import StripeCreditCardField from 'components/custom_form_fields/StripeCreditCardField'
import Spin from 'antd/lib/spin'
import message from 'antd/lib/message';

class AddCardForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
  }
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
    this.handleCreditCardInput = this.handleCreditCardInput.bind(this);
    this.storeError = this.storeError.bind(this);

    this.state = {
      generateTokenFunction: null,
      loading: false,
      error: null
    }
  }
  storeError(error) {
    this.setState({ error })
  }
  async submit(e) {
    if (this.state.error) return message.error(this.state.error, 10);
    e.preventDefault();
    this.setState({ loading: true });
    const { onSubmit } = this.props;
    let token;

    try {
      token = await this.state.generateTokenFunction();
      this.setState({ loading: false })
    } catch (err) {
      this.setState({ loading: false })
      throw new Error(err);
    }

    onSubmit(token);
  }
  handleCreditCardInput(submit) {
    this.setState({
      generateTokenFunction: submit,
    });
  }
  render() {
    return (
      <Spin spinning={this.state.loading}>
        <FieldContainer id="payment">
          <div>
            Please enter a credit card number that you wish to add to your OpenClub account.
            <StripeCreditCardField input={{onChange: this.handleCreditCardInput}} storeError={this.storeError} />
            <Button className="bottom-gap" icon="plus" type="primary" onClick={this.submit} loading={this.state.loading} disabled={this.state.error}>Add Card</Button>
          </div>
        </FieldContainer>
      </Spin>
    )
  }
}

export default AddCardForm;
