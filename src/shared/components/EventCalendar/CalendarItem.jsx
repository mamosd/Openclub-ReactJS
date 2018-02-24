import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'teardrop';
import cx from 'classnames';
import m from 'moment';

import './CalendarItem.scss';

class CalendarItem extends Component {
  /*
  TODO: Make this work properly with:
    {
      slug: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageSet: PropTypes.shape({
        background: PropTypes.string.isRequired
      }).isRequired, // --end-imageSet-shape
      host: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        imageSet: PropTypes.shape({
          square: PropTypes.string.isRequired
        }).isRequired,
        details: PropTypes.string.isRequired
      }).isRequired // --end-host-shape
    }
  */
    static propTypes = {
      slug: PropTypes.string,
      date: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
      link: PropTypes.string,
      liked: PropTypes.bool,
      attending: PropTypes.bool,
      suggested: PropTypes.bool, // Suggested cards show the event photo on top
      className: PropTypes.string
    }
    constructor(props) {
      super(props);
      this.state = {
        expanded: false
      }

      this.whenYouPokeItItGrows = this.whenYouPokeItItGrows.bind(this);
      this.goToEvent = this.goToEvent.bind(this);
    }
    whenYouPokeItItGrows(e) {
      e.preventDefault();
      this.setState({
        expanded: this.state.expanded === false
      });
    }
    goToEvent(e, paths = '') {
      const { slug } = this.props;
      e.preventDefault();
      browserHistory.push(`/event/${id}${paths}`);
    }
    render() {
      const cardClasses = cx({
        'card': true,
        'event-card': true,
        'mb-sm block': true,
        'expanded': this.state.expanded || this.props.suggested,
      });
      const containerClass = this.props.className || cx({
        'col-xs-12': true,
        'col-sm-6': this.props.suggested,
        'p0': true
      });
      const buttonClasses = cx({
        'btn btn-circle': true,
        'btn-primary': this.state.expanded,
        'btn-default': !this.state.expanded
      })
      const optionsClasses = cx({
        'event-options': true,
        'hidden': !this.props.full
      })
      return (
        <div className={containerClass}>
          <div className={cardClasses}>
            {this.props.suggested ? <div className="card-item">
              <img alt="because facebook's annoying" src="/img/pic2.jpg" className="img-responsive fw" />
            </div> : null}
            <div className="event-details-container" onClick={this.whenYouPokeItItGrows}>
                <div className="date-icon-container">
                  <h5 className="month">{m(this.props.date).format('MMM')}</h5>
                  <h6 className="day">{m(this.props.date).format('DD')}</h6>
                </div>
                <div className="event-details">
                  <h5 className="m0">{this.props.title}</h5>
                  <p>Some event host title here</p>
                  <p>8:00 pm &mdash; 10:30 pm</p>
                </div>
                <div className={optionsClasses}>
                  {this.props.attending ? (<div>
                    <button className={buttonClasses}>
                      {this.state.expanded ? <i className="fa fa-fw fa-2x fa-caret-up" /> : <i className="fa fa-fw fa-2x fa-caret-down" />}
                    </button>
                  </div>) : (<div>
                    <small>Tickets</small>
                    <br />
                    from $69.00
                  </div>)}
                </div>
            </div>
            {!this.props.suggested ? (<div className="event-expansion">
              <div className="event-e-photo">
                <img src="/img/pic1.jpg" className="img-responsive" alt={this.props.title} />
              </div>
              <div className="event-e-description">
                Some event description can go here as well as some details about how to provide prostitution services in Queensland, legitimately.
              </div>
              <div className="event-e-buttons">
                <button type="button" className="btn btn-flat ripple btn btn-default fw text-left"><i className="fa fa-fw fa-location-arrow" /> Directions</button>
                <button type="button" className="btn btn-flat ripple btn btn-default fw text-left"><i className="fa fa-fw fa-ticket" /> Buy Tickets</button>
              </div>
            </div>) : null}
          </div>
        </div>
      );
    }
}
export default CalendarItem;
