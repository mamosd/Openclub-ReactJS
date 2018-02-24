import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, reduxForm } from 'redux-form'
import { Icon, Col, Alert } from 'antd'
import {
  Form,
  FieldContainer,
  Input,
  Checkbox,
  Select,
  Button,
  InputGroup
} from 'components/form_controls'
import { required, maxLength } from 'utils/form_validation/errors'
import { durations } from 'constants/index'

import './MembershipPlanForm.css'

class MembershipPlanForm extends Component {
  static propTypes = {
    id: PropTypes.string,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    cancel: PropTypes.func
  }
  constructor(props) {
    super(props)

    this.renderPrices = this.renderPrices.bind(this)
  }
  renderPrices({ fields, meta: { touched, error } }) {
    return (
      <div>
        {fields.length <= 0 &&
          <Alert showIcon message="Plans are free until you add prices." type="info" />
        }
        {fields.map((price, index) =>
          <InputGroup key={index} className="membership-price-item" compact>
            <Col xs={6}>
              <Field
                name={`prices[${index}].price.amount`}
                type="text"
                placeholder="Fee"
                basic
                prefix="$"
                validate={[required, maxLength(8)]}
                component={Input}
                required
              />
            </Col>
            <Col xs={6}>
              <Field
                name={`prices[${index}].duration`}
                component={Select}
                placeholder="Duration"
                validate={[required]}
                options={durations.list.map(d => ({ value: d, title: durations.lookup[d] }))}
              />
            </Col>
            <Col xs={6}>
              <Field
                basic
                name={`prices[${index}].setup_price.amount`}
                type="text"
                placeholder="Setup fee"
                prefix="$"
                validate={[required, maxLength(8)]}
                component={Input}
                required
                />
            </Col>
            <Col xs={2}>
              <Button type="danger" icon="delete" ghost onClick={() => fields.remove(index)} />
            </Col>
          </InputGroup>
        )}
        <Button icon="plus" onClick={() => fields.push({})}>Add Price Option</Button>
      </div>
    )
  }
  render() {
    const { id, cancel, handleSubmit, submitting } = this.props
    return (
      <Form onSubmit={handleSubmit}>
        <FieldContainer required title="Name">
          <Field
            name="name"
            type="text"
            help="What is the name of this plan?"
            validate={[required, maxLength(64)]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer required title="Description">
          <Field
            name="description"
            type="textarea"
            help="What is the description of this plan?"
            validate={[required, maxLength(2000)]}
            component={Input}
            autosize
          />
        </FieldContainer>
        <FieldContainer title="Plan Availability">
          <Field
            name="public"
            label="Public listed plan."
            component={Checkbox}
            autosize
            defaultValue
          />
        </FieldContainer>
        <FieldContainer title="Approval">
          <Field
            name="approval"
            label="Approve new registrations."
            component={Checkbox}
            autosize
            defaultValue={false}
          />
        </FieldContainer>
        <FieldContainer required title="Prices">
          <FieldArray name="prices" component={this.renderPrices} />
        </FieldContainer>
        <Button className="btn-rightgap" type="primary" icon="save" htmlType="submit" loading={submitting}>Save Plan</Button>
        {id ? null : <Button className="btn-rightgap" onClick={cancel} loading={submitting}>Cancel</Button>}
      </Form>
    )
  }
}

export default reduxForm({
  enableReinitialize: true
})(MembershipPlanForm)

export {
  MembershipPlanForm
}
