import React from 'react'
import { Field } from 'redux-form'
import { money } from 'utils/form_validation/errors'

const numbersAndDecimals = value => value.replace(/[^0-9.]/g, '')

const MoneyField = props => (
  <Field
    {...props}
    normalize={numbersAndDecimals}
    validation={money}
  />
)

export default MoneyField
