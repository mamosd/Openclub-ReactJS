import React from 'react'

import './Form.scss'

const Form = ({ children, ...rest }) => (
  <form className="oc-form" {...rest}>{children}</form>
)

export default Form
