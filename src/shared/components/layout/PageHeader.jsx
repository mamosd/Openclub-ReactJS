import React from 'react'
import { Link } from 'teardrop'

import './PageHeader.scss'

const PageHeader = ({ title, subtitle, link }) => (
  <div className="oc-page-header">
    {link ? <Link to={link}><h3>{title}</h3><small>{subtitle}</small></Link> : <div><h3>{title}</h3><small>{subtitle}</small></div>}
  </div>
)

export default PageHeader
