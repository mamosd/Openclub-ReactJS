import React from 'react'
import AntCheckbox from 'antd/lib/checkbox'
import Switch from 'antd/lib/switch'

const Checkbox = ({ input, label, isSwitch }) => {
  if (isSwitch) {
    return (
      <label className="ant-checkbox-wrapper">
        <span className="ant-checkbox">
          <Switch {...input} defaultChecked={!!input.value} />
        </span>
        <span>
          {label}
        </span>
      </label>
    )
  }

  return (
  <AntCheckbox
    {...input}
    defaultChecked={!!input.value}
  >
    {label}
  </AntCheckbox>
)
}

export default Checkbox
