/**
 * component for displaying a column icon with a header and content text
 */
import React from 'react'
import { Icon } from 'antd'

import './TextInfoIcon.css'

const TextInfoIcon = ({ icon, title, children }) => (
  <div className="oc-textinfoicon">
    <div className="oc-textinfoicon-icon">
      <Icon type={icon}/>
    </div>
    <div className="oc-textinfoicon-content">
      <h4>{title}</h4>
      {children}
    </div>
  </div>
)

export default TextInfoIcon
