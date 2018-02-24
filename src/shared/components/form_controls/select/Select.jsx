import React from 'react'
import { formPrefix } from 'constants/index'
import { Select as AntSelect } from 'antd'
import cx from 'classnames';

const Option = AntSelect.Option

const Select = ({ input, options, basic, meta, help, ...rest }) => {
  const handleChange = (val) => {
    input.onChange(val);
  }
  const children = options.map(({ title, value }) => <Option key={value} value={value}>{title || value}</Option>)

  const wrapClasses = cx(`${formPrefix}-item-control`, {
    'has-feedback': meta.touched,
    'has-error': meta.touched && meta.error,
    'has-warning': meta.touched && meta.warning
  })

  if (!input.value) delete input.value;

  const select = (
    <AntSelect {...input} {...rest} onChange={handleChange}>
      {children}
    </AntSelect>
  )

  if (basic) return select

  return (
    <div className={wrapClasses}>
      {select}
      <div className={`${formPrefix}-explain`} key="help">
        {meta.touched && meta.error && meta.error}
        {(!meta.touched || !meta.error) && help}
      </div>
    </div>
  )
}

export default Select
