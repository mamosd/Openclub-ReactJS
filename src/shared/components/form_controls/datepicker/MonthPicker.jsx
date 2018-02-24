import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { DatePicker as AntDatePicker } from 'antd'

const AntMonthPicker = AntDatePicker.MonthPicker

const MonthPicker = ({ input, meta, ...rest }) => {
  if (!input.value) input.value = new Date();

  return <AntMonthPicker {...input} value={moment(input.value)} format="MMMM YYYY" {...rest} />
}
MonthPicker.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object
}
export default MonthPicker
