import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag'
import apolloClient from 'modules/apollo'
import { connect } from 'react-redux'
import { formPrefix, bankByCountry, countries } from 'constants/index'
import { Field, reduxForm } from 'redux-form'
import union from 'lodash/union'
import cx from 'classnames'
import {
  Form,
  FieldSet,
  FieldContainer,
  Input,
  InputGroup,
  Select,
  Address,
  Button,
  DatePicker
} from 'components/form_controls'
import {
  StripeCountrySelector,
  Terms
} from 'components/custom_form_fields'
import { Alert, Col, message, Spin, Modal } from 'antd'
import { required, maxLength, email, empty, number } from 'utils/form_validation/errors'
import _ from 'lodash'

const fieldExplainers = {
  'legal_entity.personal_id_number': 'personal ID number',
  'legal_entity.verification.document': 'copy of Personal ID'
}

const accountTypeOptions = [
  {
    value: 'company',
    title: 'Business or Registered Association',
  },
  {
    value: 'individual',
    title: 'Individual'
  }
]

const genderOptions = [
  {
    value: 'male',
    title: 'Male'
  },
  {
    value: 'female',
    title: 'Female'
  }
]

class StripeAccountForm extends Component {
  static defaultProps = {
    additional_verifications: []
  }
  static propTypes = {
    handleSubmit: PropTypes.func,
    form_values: PropTypes.object,
    additional_verifications: PropTypes.arrayOf(PropTypes.string),
    club: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.state = {
      country_spec: null,
      account_type: 'company',
      country_spec_query: false
    }

    this.loadCountryValues = this.loadCountryValues.bind(this)
  }
  componentDidMount() {
    const { club } = this.props;
    if (club.stripe_account && club.stripe_account.data) {
      this.loadCountryValues({}, club.stripe_account.data.country);
    }
  }
  async loadCountryValues(e, newValue, pastValue) {
    if (newValue !== pastValue) {
      try {
        this.setState({ country_spec_query: true });
        const query = await apolloClient.query({
          query: countrySpecQuery,
          variables: {
            country_code: newValue
          }
        });
        this.setState({
          country_spec: query.data.countrySpec,
          country_spec_query: false
        });
      } catch (er) {
        Modal.error({
          title: 'Error',
          content: er.message
        })
        this.setState({ country_spec_query: false });
      }
    }
  }
  getVerifications(level = 'minimum') {
    const { stripe_account: stripeAccount } = this.props.club;
    let additionalFields = _.get(stripeAccount, 'data.verifications.fields_needed', []);

    const { country_spec: countrySpec } = this.state

    if (!countrySpec) return [];
    const { verification_fields } = countrySpec;
    return union(verification_fields[this.getType()][level], additionalFields);
  }
  getType() {
    const { form_values } = this.props;
    return _.get(form_values, 'legal_entity-type', 'company');
  }
  isFieldRequired(field) {
    return this.getVerifications('minimum').indexOf(field) > -1
  }
  isFieldDisabled(field) {
    const { form_values } = this.props;
    if (_.get(form_values, 'legal_entity.type', false)) return this.isFieldRequired(field) === false && this.getVerifications('additional').indexOf(field) < 0
    return true;
  }
  ifFieldRequired(field) {
    return this.isFieldRequired(field) ? required : empty
  }
  requiredIf(condition) {
    return condition ? required : empty;
  }
  formatAdditionalFields() {
    const additionalFields = this.getVerifications('additional');
    return additionalFields.length > 0 ? additionalFields.map((value) => fieldExplainers[value]).join(', ') : '';
  }
  getAccountTypes() {
    if (!this.state.country_spec) return [];
    const { verification_fields: verificationFields } = this.state.country_spec;
    if (!verificationFields) return [];
    const types = [];
    if ('company' in verificationFields) types.push(accountTypeOptions[0])
    if ('individual' in verificationFields) types.push(accountTypeOptions[1])
    return types;
  }
  render() {
    const { handleSubmit, additional_verifications, form_values, club, submitting } = this.props
    const { stripe_account } = club;
    const { country_spec } = this.state

    const existingAccount = _.get(club, 'stripe_account.data', false);

    const accountTypes = this.getAccountTypes();

    const businessTaxId = _.get(bankByCountry, `[${_.get(form_values, 'country', 'NONE')}].taxId`, 'Business Number')

    const businessTaxIdProvided = _.get(club, 'stripe_account.data.legal_entity.business_tax_id_provided', false);

    return (
      <Form onSubmit={handleSubmit}>
        <Spin
          tip="Loading country specifications..."
          spinning={this.state.country_spec_query}
          >
          <FieldContainer required title="Country">
            {existingAccount ? (
              <div>{_.find(countries, { value: _.get(stripe_account, 'data.country') }).title}<br />
              <small>Once a country is set, you cannot change it.</small></div>
            ) : (
              <StripeCountrySelector
                name="country"
                help="Please set your country. This cannot be changed later."
                onChange={this.loadCountryValues}
                placeholder="Select your country"
                />
            )}
          </FieldContainer>
        </Spin>
        <FieldContainer required title="Type">
          <Field
            name="legal_entity.type"
            component={Select}
            help="Please select the type of entity that will be reciving funds."
            options={accountTypes}
            initialValue="company"
            disabled={country_spec === null}
            />
        </FieldContainer>
        <div className="bottom-gap-large"/>
        <hr/>
        <div className="bottom-gap-large"/>
        <div className={cx({ 'hidden': !country_spec })}>
          <h4 className="bottom-gap-large">Verification Fields</h4>
          <p>Our payment provider may require additional information depending on the region you're operating in. We will notify you if any additional information is required.</p>
        </div>
        {
          additional_verifications.length > 0 ? <Alert
            message="Additional Verifications Required"
            description={`Our payment provider has requested additional information to verify your account or identity.`}
            type="warning"
            showIcon
          /> : null
        }
        <FieldContainer required={this.isFieldRequired('legal_entity.business_name')} title="Entity Name" deleted={this.isFieldDisabled('legal_entity.business_name')}>
          <Field
            name="legal_entity.business_name"
            type="text"
            help="The full, legally registered business name. (eg. OpenClub Pty Ltd)"
            validate={[required, maxLength(128)]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer required={this.isFieldRequired('legal_entity.business_tax_id') && !businessTaxIdProvided} title={businessTaxId} deleted={this.isFieldDisabled('legal_entity.business_tax_id')}>
          <Field
            name="legal_entity.business_tax_id"
            type="text"
            help={businessTaxIdProvided ? `Your ${businessTaxId} is already securely stored. Only enter a value if you wish to change it.` : `Please provide your ${businessTaxId}.`}
            validate={[this.requiredIf(!businessTaxIdProvided), maxLength(64)]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer required={this.isFieldRequired('legal_entity.business_vat_id')} title="VAT ID" deleted={this.isFieldDisabled('legal_entity.business_vat_id')}>
          <Field
            name="legal_entity.business_vat_id"
            type="text"
            help="Our payment provider has requested your VAT ID."
            validate={[required, maxLength(64)]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer required={this.isFieldRequired('legal_entity.first_name') || this.isFieldRequired('legal_entity.last_name')} title="Full Name" deleted={this.isFieldDisabled('legal_entity.first_name') || this.isFieldDisabled('legal_entity.last_name')}>
          <InputGroup>
            <Col span={12}>
              <Field
                name="legal_entity.first_name"
                type="text"
                validate={[this.ifFieldRequired('legal_entity.first_name'), maxLength(64)]}
                component={Input}
                placeholder="First"
                disabled={this.isFieldDisabled('legal_entity.first_name')}
              />
            </Col>
            <Col span={12}>
              <Field
                name="legal_entity.last_name"
                type="text"
                validate={[this.ifFieldRequired('legal_entity.last_name'), maxLength(64)]}
                component={Input}
                placeholder="Last"
                disabled={this.isFieldDisabled('legal_entity.last_name')}
              />
            </Col>
            <div className={`${formPrefix}-explain`} key="help">
              Please enter the first and last name of the account holder or representative.
            </div>
          </InputGroup>
        </FieldContainer>
        <FieldContainer required={this.isFieldRequired('legal_entity.gender')} title="Gender" deleted={this.isFieldDisabled('legal_entity.gender')}>
          <Field
            name="legal_entity.gender"
            component={Select}
            help="In some regions, we require your gender as a verification field."
            options={genderOptions}
            />
        </FieldContainer>
        <FieldContainer required={this.isFieldRequired('legal_entity.ssn_last4')} title="Social Security Number" deleted={this.isFieldDisabled('legal_entity.ssn_last4')}>
          <Field
            name="legal_entity.ssn_last4"
            type="text"
            help="Enter the last 4 digits of your social security number."
            validate={[this.ifFieldRequired('legal_entity.ssn_last4'), maxLength(4), number]}
            component={Input}
          />
        </FieldContainer>
        <FieldContainer required={this.isFieldRequired('legal_entity.address.city')} title="Account Address" deleted={this.isFieldDisabled('legal_entity.address.city')}>
          <Field
            name="legal_entity.address"
            help="What is the address of the club or club account representative?"
            validate={[this.ifFieldRequired('legal_entity.address.city'), maxLength(64)]}
            component={Address}
          />
        </FieldContainer>
        <FieldContainer required={this.isFieldRequired('legal_entity.dob.month')} title="Date of Birth" deleted={this.isFieldDisabled('legal_entity.dob.month')}>
          <Field
            name="legal_entity.dob"
            help="The date of birth of the account's legal representative."
            validate={[this.ifFieldRequired('legal_entity.dob.month')]}
            component={DatePicker}
            />
        </FieldContainer>
        <FieldContainer required title="Additional Verifications" deleted={this.isFieldDisabled('legal_entity.additional_owners')}>
          <div>Our payment provider has additional verification requirements in this region that may require that you contact us. Please email support@openclub.co if you have any difficulties.</div>
        </FieldContainer>
        {!existingAccount && (
          <FieldContainer required title="Terms and Conditions" deleted={this.isFieldDisabled('tos_acceptance.date')}>
            <Field
              component={Terms}
              name="tos_acceptance"
              text="I agree to the OpenClub Club Engagement Agreement"
              frameUrl="https://lawdocs.openclub.co/en_AU/club_engagement"
              required
              />
          </FieldContainer>
        )}
        <div className="bottom-gap-large" />
        <FieldContainer>
          <Button type="primary" htmlType="submit" disabled={country_spec === null} loading={submitting}>Save Account Details</Button>
        </FieldContainer>
      </Form>
    )
  }
}

const countrySpecQuery = gql`
  query country_spec($country_code: String!) {
    countrySpec(country_code: $country_code) {
      country_code
      default_currency
      supported_bank_account_currencies
      supported_payment_currencies
      supported_payment_methods
      verification_fields
    }
  }`

const StripeAccountFormReduxForm = reduxForm({
  form: 'club_stripe_account'
})(StripeAccountForm)

const StripeAccountFormReduxConnect = connect(state => {
  if (!state.form || 'club_stripe_account' in state.form === false) return {};
  return {
    form_values: 'values' in state.form.club_stripe_account ? state.form.club_stripe_account.values : {}
  }
})(StripeAccountFormReduxForm)

export default StripeAccountFormReduxConnect
