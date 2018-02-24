import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Button } from 'antd'
import cx from 'classnames'
import Select, { Option } from 'antd/lib/select'
import { Field } from 'redux-form'
import { durations } from 'constants/index'
import _ from 'lodash'
import n from 'numeral'
import './PlanCard.scss'

class PlanCard extends Component {
  static propTypes = {
    plan: PropTypes.object,
    input: PropTypes.object,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func
  }
  constructor(props) {
    super(props)

    this.state = {
      currentSelection: 0
    }

    this.setNewPriceOption = this.setNewPriceOption.bind(this);
    this.onSelectPlan = this.onSelectPlan.bind(this);
  }
  onChange(priceId) {
    const { _id } = this.props.plan;
    this.props.input.onChange(`${_id}::${priceId}`)
    if (this.props.onChange) this.props.onChange(`${_id}::${priceId}`);
  }
  onSelectPlan() {
    const { prices } = this.props.plan;
    if (!prices) return this.onChange(0);
    this.onChange(prices[this.state.currentSelection]._id);
  }
  setNewPriceOption(newSelection) {
    const { plan } = this.props;
    const currentSelection = this.state.currentSelection;
    this.setState({ currentSelection: newSelection });
    if (this.props.input.value === `${plan._id}::${plan.prices[currentSelection]._id}`) this.onChange(plan.prices[newSelection]._id);
  }
  render() {
    const { input, plan } = this.props;
    const { currentSelection } = this.state;

    const selected = input.value === `${plan._id}::${plan.prices ? plan.prices[currentSelection]._id : 0}`;

    const currentPrice = plan.prices ? plan.prices[currentSelection] : {
      price: {
        amount_float: -1,
      },
      setup_price: {
        amount_float: -1,
      }
    }

    const cardClasses = cx({
      'plan-card': true,
      'selected': selected
    });

    return (
      <Card title={plan.name} className={cardClasses}>
        <Col xs={24} md={8} className="pricing">
          <h2>{currentPrice.price.amount ? `$${n(currentPrice.price.amount).format('0,0.00')}` : 'FREE'}</h2>
          {currentPrice.setup_price.amount_float > 0 ? <small>{`a $${n(currentPrice.setup_price.amount).format('0,0.00')} one-time fee applies`}</small> : null}
          {
            plan.prices && plan.prices.length > 1 ? (
              <Select onChange={this.setNewPriceOption} defaultValue="0">
                {plan.prices.map((p, k) => <Option key={p._id} value={`${k}`}>{durations.lookup[p.duration]}</Option>)}
              </Select>
            ) : (
              <div>{currentPrice.duration ? durations.lookup[currentPrice.duration] : ''}</div>
            )
          }
          {selected ? <Button icon="check">Selected</Button> : <Button onClick={this.onSelectPlan} icon="plus" type="primary">Select Plan</Button>}
        </Col>
        <Col xs={24} md={16} className="description">
          {plan.description.split('\n').map((ln, k) => <span key={`${plan._id}-ln-${k}`}>{ln}<br /></span>)}
        </Col>
      </Card>
    );
  }
}

const PlanCardWrappedInField = props => <Field {...props} name="selectedPlan" size="large" component={PlanCard} />;

export default PlanCardWrappedInField
