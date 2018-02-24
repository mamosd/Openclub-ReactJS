import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createCardElement } from 'utils/stripe'
import Spin from 'antd/lib/spin'
import message from 'antd/lib/message'

import './StripeCreditCardField.scss'

class StripeCreditCardField extends Component {
  static propTypes = {
    input: PropTypes.object,
    storeError: PropTypes.func
  }
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      ready: false
    }
  }
  ready() {
    this.setState({ ready: true })
  }
  async componentDidMount() {
    const { onChange } = this.props.input;
    try {
      const { mount, unmount, submit } = await createCardElement({ hidePostalCode: true }, this.cc, this.props.storeError);

      mount();
      this.unmount = unmount;
      this.ready();

      onChange(submit);
    } catch (err) {
      message.error(err, 10);
    }
  }
  componentWillUnmount() {
    if (this.unmount) this.unmount();
  }
  render() {
    return (
      <Spin spinning={!this.state.ready} tip="Loading gateway...">
        <div className="credit-card-form">
          <div className="bottom-gap" ref={cc => { this.cc = cc }} />
        </div>
      </Spin>
    );
  }
}
export default StripeCreditCardField
