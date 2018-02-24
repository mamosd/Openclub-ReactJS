import React from 'react'
import { Checkbox } from 'antd'

const AntCheckboxGroup = Checkbox.Group

const CheckboxGroup = ({ input, options }) => {

  // map out any default values if necessary
  const defaults = Object.keys(input.value).filter(k => input.value[k])

  const handleChange = onItems => {
    const newValues = {}
    onItems.forEach(item => newValues[item] = true)
    input.onChange(newValues)
  }

  return (
    <AntCheckboxGroup
      options={options}
      onChange={handleChange}
      defaultValue={defaults}
    />
  )
}

export default CheckboxGroup
