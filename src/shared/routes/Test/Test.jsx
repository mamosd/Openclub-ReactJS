import React from 'react'
import {
  ContentPage,
  PageHeader
} from 'components/layout'

import { StripeBankAccountField } from 'components/custom_form_fields'

export default props => (
  <ContentPage>
    <PageHeader title="Test Stuff" />
    AU
      <StripeBankAccountField country="AU" />
      CA
      <StripeBankAccountField country="CA" />
      IE
      <StripeBankAccountField country="IE" />
      SG
      <StripeBankAccountField country="SG" />
      NZ
      <StripeBankAccountField country="NZ" />
      GB
      <StripeBankAccountField country="GB" />
      US
      <StripeBankAccountField country="US" />
  </ContentPage>
)
