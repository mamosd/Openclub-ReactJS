import React from 'react'
import Radio, { Group as AntRadioGroup } from 'antd/lib/radio';

const RadioGroup = ({ input, options, meta, ...rest }) => {
  const children = options.map(({ value, label, ...other }) => <Radio key={value} value={value} {...other}>{label}</Radio>)

  return (
    <AntRadioGroup {...input} {...rest}>
      {children}
    </AntRadioGroup>
  )
}

export default RadioGroup
