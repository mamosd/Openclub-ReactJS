import React from 'react'
import MiddleArea from 'components/layout/MiddleArea'
import { Link } from 'teardrop'

const Error = () => (
  <MiddleArea>
    <div className="text-center">
      <i className="fa fa-5x fa-fw fa-exclamation-triangle text-danger mb" />
      <h3 className="mb text-danger">Not Found!</h3>
      <h5 className="text-danger">The page you're looking for can't be found</h5>
      <hr className="mb mt" />
      <p className="mb">We recommend reloading or returning to the homepage</p>
      <div className="btn-group">
        <button onClick={() => { window.location.reload() }} className="btn btn-lg btn-danger"><i className="fa fa-fw fa-refresh" />Reload</button>
        <Link to="/" className="btn btn-lg btn-primary"><i className="fa fa-fw fa-house" /> Homepage</Link>
      </div>
    </div>
  </MiddleArea>
)
export default Error
