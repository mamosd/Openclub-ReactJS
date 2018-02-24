import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { StripeBankAccountField } from 'components/custom_form_fields'
import {
  Form,
  FieldSet,
  FieldContainer,
  Input,
  RadioGroup,
  Button
} from 'components/form_controls'
import { required, maxLength } from 'utils/form_validation/errors'

const StripeBankAccountForm = ({ handleSubmit, submitting, country, change }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <FieldContainer required title="Account Holder Type">
        <Field
          name="account_holder_type"
          component={RadioGroup}
          options={[
            { label: 'Individual', value: 'individual' },
            { label: 'Company', value: 'company' }
          ]}
        />
      </FieldContainer>
      <FieldContainer required title="Account Holder Name">
        <Field
          name="account_holder_name"
          type="text"
          help="What is the name associated with the bank account?"
          validate={[required, maxLength(64)]}
          component={Input}
        />
      </FieldContainer>
      <FieldContainer required title="Account Details">
        <Field
          country={country}
          name="bank_account"
          type="number"
          validate={[required, maxLength(24)]}
          component={StripeBankAccountField}
        />
      </FieldContainer>
      <FieldContainer>
        <Button type="primary" htmlType="submit" loading={submitting}>{change ? 'Change Bank Account' : 'Submit Bank Account'}</Button>
      </FieldContainer>
    </Form>
  )
}

const StripeBankAccountReduxForm = reduxForm({
  form: 'stripe_bank_account'
})(StripeBankAccountForm)

const StripeBankAccountReduxConnect = connect(state => {
  if (!state.form || 'stripe_bank_account' in state.form === false) return {};
  return {
    form_values: 'values' in state.form.stripe_bank_account ? state.form.stripe_bank_account.values : {}
  }
})(StripeBankAccountReduxForm)

export default StripeBankAccountReduxConnect
