import React, { Component } from 'react'
import { MiddleArea } from 'components/layout'

class EventsPage extends Component {
  render() {
    return (
      <MiddleArea>
        <div className="text-center">
          <i className="fa fa-fw fa-5x fa-calendar mb" />
          <h4>OpenClub Events</h4>
          <hr className="mb mt" />
          <p className="text-md">
            Events are coming soon. Stay tuned.
          </p>
        </div>
      </MiddleArea>
    )
  }
}
export default EventsPage;
