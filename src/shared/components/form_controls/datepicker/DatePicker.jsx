import React from 'react'
import moment from 'moment'
import { DatePicker as AntDatePicker } from 'antd'

const dateFormat = 'DD/MM/YYYY'

const DatePicker = ({ input, meta, onChange }) => {
  const handleChange = (dt) => {
    if (onChange) onChange(dt.toDate());
    return input.onChange(dt.toDate());
  }
  let f = {};
  let value;
  let defaultValue;

  if (input.value) {
    value = (input.value && input.value.day && input.value.month && input.value.year) ? new Date(`${input.value.year}-${input.value.month}-${input.value.day}`) : input.value;
    f.value = moment(value);
  }
  if (input.defaultValue) {
    defaultValue = (input.defaultValue && input.defaultValue.day && input.defaultValue.month && input.defaultValue.year) ? new Date(`${input.defaultValue.year}-${input.defaultValue.month}-${input.defaultValue.day}`) : input.defaultValue;
    f.defaultValue = moment(defaultValue);
  }
  return <AntDatePicker {...f} format={dateFormat} onChange={handleChange} placeholder="Select date" />
}

export default DatePicker
