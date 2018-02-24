import React from 'react'
import { Field } from 'redux-form'
import { Select } from 'components/form_controls'

import { countries } from 'constants/index'

const StripeCountrySelector = props => (
  <Field
    {...props}
    component={Select}
    options={countries}
  />
)

export default StripeCountrySelector
