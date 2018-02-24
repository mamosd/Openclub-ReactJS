import React from 'react'
import PropTypes from 'prop-types';

const Loading = ({ tip }) => (
  <div className="loader">
    <div className="middle">
      <i className="fa fa-5x fa-fw fa-spinner fa-pulse mb" />
      <h5>{tip || 'Loading. Please wait...'}</h5>
    </div>
  </div>
)
Loading.propTypes = {
  tip: PropTypes.string
}
export default Loading
