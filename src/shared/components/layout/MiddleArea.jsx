import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './MiddleArea.scss'

const MiddlePage = ({ children, className }) => (
  <div className={classNames("middle-area", className)}>{children}</div>
)
MiddlePage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ]),
  className: PropTypes.string
}

export default MiddlePage
