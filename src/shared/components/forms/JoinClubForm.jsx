import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Row, Col, Card, Alert } from 'antd'
import { Field, reduxForm } from 'redux-form'
import { EmbeddedProfile } from 'routes/Profile/Profile'
import _ from 'lodash'
import { required, maxLength, slug } from 'utils/form_validation/errors'
import UserProfile from 'modules/forms/UserProfile'
import {
  Form,
  FieldSet,
  FieldContainer,
  Input,
  Button,
  FileUploader,
  Checkbox
} from 'components/form_controls'
import { Terms, StripePaymentMethodField } from 'components/custom_form_fields'
import { PlanCard } from 'components/display'
import Steps, { Step } from 'antd/lib/steps'
import Popover from 'antd/lib/popover'
import n from 'numeral'

class JoinClubForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    club: PropTypes.object,
    form_values: PropTypes.object,
    viewer: PropTypes.object,
    loading: PropTypes.bool
  }
  constructor(props) {
    super(props)

    this.steps = ['plan', 'profile', 'confirm']
    this.state = {
      step: 'plan'
    }
    this.changePlan = this.changePlan.bind(this)
  }
  nextStep() {
    this.setState({
      step: this.steps[this.steps.indexOf(this.state.step) + 1]
    });
  }
  prevStep() {
    this.setState({
      step: this.steps[this.steps.indexOf(this.state.step) - 1]
    });
  }
  planStep() {
    const { form_values: formValues } = this.props;
    const status = !!(formValues && formValues.selectedPlan);

    if (status === true) return 'finish';
    if (this.state.step === 'plan') return 'process';
    return 'wait';
  }
  profileStep() {
    if (this.state.step === 'profile') return 'process'
    if (this.state.step === 'confirm') return 'finish'
    return 'wait';
  }
  confirmStep() {
    if (this.state.step === 'confirm') return 'process'
    return 'wait'
  }
  changePlan() {
    this.nextStep();
  }
  toStep(step, e) {
    e.preventDefault();
    this.setState({ step: this.steps[step] });
  }
  getPlan() {
    const { form_values: formValues, club: { membership_plans: membershipPlans } } = this.props;
    if (!formValues || !formValues.selectedPlan) return {};
    const [plan, price] = formValues.selectedPlan.split('::');
    const membershipPlan = membershipPlans[_.findIndex(membershipPlans, { _id: plan })];
    if (price === '0') return membershipPlan;
    const selectedPrice = membershipPlan.prices[_.findIndex(membershipPlan.prices, { _id: price })];
    return {
      ...membershipPlan,
      selectedPrice
    }
  }
  render() {
    const { loading, form_values, viewer, handleSubmit, club: { membership_plans: membershipPlans = [], name: clubName = 'this club' } } = this.props;
    const selectedPlan = this.getPlan();

    console.log(form_values);

    if (!membershipPlans) {
      return (
        <Alert
          message="Uh oh!"
          description="There aren't any plans for you to join."
          type="error"
          showIcon />
      );
    }

    const customDot = (dot, { index, title, status }) => (
      <a href="#" onClick={status !== 'wait' ? this.toStep.bind(this, index) : null}>
        <Popover content={title}>{dot}</Popover>
      </a>
    )
    return (
      <Form onSubmit={handleSubmit}>
        <Steps current={this.steps.indexOf(this.state.step)} progressDot={customDot}>
          <Step
            key="plan"
            title="Select Plan"
            description="Select a plan and price"
            status={this.planStep()}
            />
          <Step
            key="profile"
            title="Complete Profile"
            description="Ensure your profile is complete"
            status={this.profileStep()}
            />
          <Step
            key="confirm"
            title="Confirmation"
            description="Confirm payment details and join"
            status={this.confirmStep()}
            />
        </Steps>
        <div className="bottom-gap" />
        <hr />
        <div className="bottom-gap-large" />
        { this.state.step === 'plan' && (
          <div>
            <h4 className="bottom-gap">Choose a plan</h4>
            {membershipPlans.map(plan => <PlanCard plan={plan} onChange={this.changePlan} key={plan.name} />)}
          </div>
        )}
        { this.state.step === 'profile' && (
          <div>
            <h4 className="bottom-gap">Member Details</h4>
            <UserProfile
              viewer={viewer}
              customSubmitCallback={this.nextStep.bind(this)}
              customButtonRender={(submit, loading) => (
                <div>
                  <Button onClick={this.prevStep.bind(this)} size="large">Previous</Button>
                  <Button type="primary" onClick={submit} className="pull-right" size="large" loading={loading}>Next</Button>
                </div>
              )} />
          </div>
        )}
        { this.state.step === 'confirm' && (
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <h4 className="bottom-gap">Verification</h4>
              <p>The club will receive the following information.</p>
              <ul>
                <li>- Full name</li>
                <li>- Date of birth</li>
                <li>- Street address</li>
                <li>- Email address</li>
                <li>- Phone number</li>
              </ul>
              <h4>Club Agreement</h4>
              <p>{clubName} has their own agreement. Please accept this agreement before proceeding.</p>
              <Field
                name="acceptTerms"
                component={Terms}
                content={"<div>Some terms and conditions</div>"}
                text={`I accept ${clubName}'s agreement and any conditions of entry.`}
              />
            </Col>
            <Col xs={24} md={12}>
              {!selectedPlan.selectedPrice && (
                <div>
                  <h4 className="bottom-gap">Free to join</h4>
                  <p>{"No payment is due to join this club. Please click 'Join' to proceed."}</p>
                </div>
              )}
              {selectedPlan.selectedPrice && (
                <div>
                  <h4 className="bottom-gap">Payment</h4>
                  <p>Total due today: <strong>${n((selectedPlan.selectedPrice.price ? selectedPlan.selectedPrice.price.amount_float || 0 : 0) + (selectedPlan.selectedPrice.price ? selectedPlan.selectedPrice.setup_price.amount_float || 0 : 0)).format('0,0.00')}</strong>,
                    with <strong>${n((selectedPlan.selectedPrice.price ? selectedPlan.selectedPrice.price.amount_float || 0 : 0)).format('0,0.00')}</strong> recurring {selectedPlan.selectedPrice.duration.toLowerCase()}.</p>
                  <p><strong>Breakdown:</strong></p>
                  <ul>
                    {selectedPlan.selectedPrice.price && <li>- Recurring Membership Fee: ${n((selectedPlan.selectedPrice.price ? selectedPlan.selectedPrice.price.amount_float || 0 : 0)).format('0,0.00')} {selectedPlan.selectedPrice.duration.toLowerCase()}</li>}
                    {selectedPlan.selectedPrice.setup_price && <li>- One-time Setup Fee: ${n((selectedPlan.selectedPrice.setup_price ? selectedPlan.selectedPrice.setup_price.amount_float || 0 : 0)).format('0,0.00')}</li>}
                  </ul>
                  <p><strong>Payment method:</strong><br />
                  Please select a payment method to use for this membership.
                  </p>
                  <StripePaymentMethodField />
                  <p><strong>Automatic renewals:</strong><br />
                  Let us take care of your renewals. Use automatic renewals for peace of mind, ensuring your membership stays current.
                  <Field
                    component={Checkbox}
                    name="autoRenew"
                    label={`Automatically renew my membership for ${n((selectedPlan.selectedPrice.price ? selectedPlan.selectedPrice.price.amount_float || 0 : 0)).format('0,0.00')}, ${selectedPlan.selectedPrice.duration.toLowerCase()}.`}
                    />
                  </p>
                </div>
              )}
            </Col>
          </Row>
        )}
        <div className="bottom-gap-large" />
        {this.state.step === 'confirm' && <Button onClick={this.prevStep.bind(this)} size="large">Previous</Button>}
        {this.planStep() === 'finish' && this.state.step === 'plan' && <Button type="primary" onClick={this.nextStep.bind(this)} className="pull-right" size="large">Next</Button>}
        {this.state.step === 'confirm' && <Button type="primary" htmlType="submit" className="pull-right" size="large" loading={loading}>Join Club</Button>}
        <div className="bottom-gap" />
        <hr />
      </Form>
    )
  }
}

const JoinClubReduxForm = reduxForm({
  form: 'join_club'
})(JoinClubForm)

const JoinClubReduxConnect = connect(state => {
  if (!state.form || 'join_club' in state.form === false) return {};
  return {
    form_values: _.get(state, 'form.join_club.values', {}),
    initialValues: {
      autoRenew: true,
      acceptTerms: false
    }
  }
})(JoinClubReduxForm)

export default JoinClubReduxConnect

export {
  JoinClubForm
}
