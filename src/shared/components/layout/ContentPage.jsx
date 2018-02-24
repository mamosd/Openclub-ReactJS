import React from 'react'
import classNames from 'classnames'
import './ContentPage.scss'

const ContentPage = ({ largeFont, children, className }) => {
  const cls = classNames(className, 'oc-content-page', {
    'oc-content-page-lg-font': largeFont
  })

  return (
    <div className={cls}>{children}</div>
  )
}

export default ContentPage
