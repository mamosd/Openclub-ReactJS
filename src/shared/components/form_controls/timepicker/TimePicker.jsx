import React from 'react'
import { TimePicker as AntTimePicker } from 'antd'

const TimePicker = ({ input, meta, ...rest }) => (
  <AntTimePicker {...input } {...rest}/>
)

export default TimePicker
