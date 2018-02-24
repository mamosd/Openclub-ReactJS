import React from 'react'
import MiddleArea from 'components/layout/MiddleArea'
import parseError from 'utils/error';

class Error extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      developer: false
    }
  }
  render() {
    const { developer } = this.state;
    const { error } = this.props;
    const style = {
      maxWidth: 500,
      marginLeft: 'auto',
      marginRight: 'auto',
      top: '5vh'
    }
    let config = {
      style,
      showIcon: true,
      type: 'error'
    }
    if (error && error.networkError) {
      config = {
        ...config,
        message: 'Network error',
        description: 'You are not connected to the internet. Please reconnect and try again.',
      }
    } else {
      config = {
        ...config,
        message: process.env.NODE_ENV === "production" ? "Uh-oh! We've encountered a problem" : "DEVELOPMENT: ERROR",
        description: process.env.NODE_ENV === "production" ? "OpenClub failed to load because of an error. Please try again or contact support@openclub.co." : (error ? error.message : 'Undefined error, see console.')
      }
    }
    return (
      <MiddleArea>
        <div className="text-center">
          <i className="fa fa-5x fa-fw fa-exclamation-triangle text-danger mb" />
          <h3 className="mb text-danger">Uh-oh!</h3>
          <h5 className="text-danger">We've encountered an error</h5>
          <hr className="mb mt" />
          <p>{error ? parseError(error) : 'Unknown Error'}</p>
          {developer && (
            <pre className="mt">
              {error ? error.stack : "We weren't kidding. We really have no error."}
            </pre>
          )}
          <hr className="mb mt" />
          <p className="mb">We recommend reloading to try again</p>
          <div className="btn-group">
            <button onClick={() => { window.location.reload() }} className="btn btn-lg btn-danger"><i className="fa fa-fw fa-refresh" />Reload</button>
            <button onClick={() => { window.location.reload() }} className="btn btn-lg btn-primary"><i className="fa fa-fw fa-life-ring" /> Helpdesk</button>
          </div>
          <small className="mt"><a onClick={() => this.setState({ developer: !developer })}>{!developer ? 'I am a developer.' : 'I\'ve decided against being a developer.'}</a></small>
        </div>
      </MiddleArea>
    )
  }
}
export default Error
