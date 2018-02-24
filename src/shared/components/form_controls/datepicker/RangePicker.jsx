import React from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'

const AntRangePicker = DatePicker.RangePicker

const RangePicker = ({ input, ...rest }) => (
  <AntRangePicker {...input} value={input.value.map(d => moment(d))}{...rest} />
)

export default RangePicker
