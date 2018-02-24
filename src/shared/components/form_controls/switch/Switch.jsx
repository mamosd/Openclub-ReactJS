import React from 'react'
import { Switch as AntSwitch } from 'antd'

const Switch = ({ input, meta, ...rest }) => (
  <AntSwitch {...input} {...rest}/>
)

export default Switch
