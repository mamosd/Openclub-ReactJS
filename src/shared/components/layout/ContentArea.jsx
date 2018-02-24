/**
 * This component represents the area on a page that shows content.
 * For example, on a large desktop this shows a smaller width area,
 * but on mobile it fills the page.
 */
import React from 'react'
import './ContentArea.scss'

const ContentArea = ({ largeFont, children }) => (
  <div className="oc-content-area">
    {children}
  </div>
)

export default ContentArea
