import React from 'react'
import PropTypes from 'prop-types'
import { formPrefix } from 'constants/index'
import AntInput from 'antd/lib/input';
import { Item as FormItem } from 'antd/lib/form';
import cx from 'classnames'

const Input = ({ input = {}, meta = {}, help, type = 'input', basic = false, ...rest }) => {
  if (basic) {
    return <AntInput {...input} type={type} {...rest} />
  }

  let validateStatus;
  if (meta.touched && meta.error) validateStatus = 'error';
  if (meta.touched && meta.warning) validateStatus = 'warning';
  return (
    <FormItem validateStatus={validateStatus} isFieldTouched={meta.touched} help={meta.touched ? meta.error || meta.warning : help} hasFeedback={meta.touched && (meta.error || meta.warning)}>
      <AntInput {...input} type={type} {...rest} />
    </FormItem>
  )
}
Input.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  help: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.element
  ]),
  basic: PropTypes.bool,
  type: PropTypes.string
}

export default Input
