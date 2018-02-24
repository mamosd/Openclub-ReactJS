import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input, { Group as InputGroup } from 'antd/lib/input'
import Alert from 'antd/lib/alert'
import { bankByCountry } from 'constants/index'
import _ from 'lodash';

class StripeBankAccountField extends Component {
  static propTypes = {
    country: PropTypes.string,
    input: PropTypes.object
  }
  constructor(props) {
    super(props)

    this.state = {
      account_number: '',
      transit_number: '',
      routing_number: '',
      validate: {
        account_number: false,
        transit_number: false,
        routing_number: false,
      }
    }

    this.handleInput = this.handleInput.bind(this)
  }
  update() {
    const { account_number, transit_number, routing_number } = this.state;
    this.props.input.onChange({
      account_number,
      routing_number: transit_number + routing_number
    });
  }
  handleInput(validation, e) {
    let obj = this.state;
    obj[e.target.name] = e.target.value;
    obj.validate[e.target.name] = validation(e.target.value);
    this.setState(obj);
    this.update();
  }
  render() {
    const { account_number, routing_number, transit_number } = _.get(bankByCountry, `[${this.props.country}]`, {});
    return (
      <div>
        <InputGroup compact className="bottom-gap">
          {transit_number ? <Input
            key="transit_number"
            type="text"
            name="transit_number"
            placeholder={transit_number.name}
            value={this.state.transit_number}
            onChange={this.handleInput.bind(this, transit_number.validation)}
            style={{ width: transit_number.width }}
            /> : null}
          {routing_number ? <Input
            key="routing_number"
            type="text"
            name="routing_number"
            placeholder={routing_number.name}
            value={this.state.routing_number}
            onChange={this.handleInput.bind(this, routing_number.validation)}
            style={{ width: routing_number.width }}
            /> : null}
          {account_number ? <Input
            key="account_number"
            type="text"
            name="account_number"
            placeholder={account_number.name}
            value={this.state.account_number}
            style={{ width: account_number.width }}
            onChange={this.handleInput.bind(this, account_number.validation)}
            /> : null}
        </InputGroup>
        {Object.keys(this.state.validate).map(n => this.state.validate[n] ? <Alert message={this.state.validate[n]} type="error" key={n} /> : null)}
      </div>
    );
  }
}
export default StripeBankAccountField;
