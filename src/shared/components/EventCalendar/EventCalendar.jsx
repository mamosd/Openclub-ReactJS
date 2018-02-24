import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import m from 'moment';

import CalendarItem from './CalendarItem';
import './EventCalendar.scss';

class EventCalendar extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.array
    ])
  }
  constructor(props) {
    super(props);

    this.calendar = {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'Do MMM YYYY'
    };
  }
  renderMonthHeader(date) {
    const monthStyle = {
      backgroundImage: `url(/img/calendar/${m(date).format('MMMM').toLowerCase()}.jpg)`,
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: 150
    }
    return (
      <div className="card-item month-header" key={`month-header-${m(date).format('MM')}`}>
        <div className="fw img-responsive paralax" style={monthStyle}/>
        <div className="card-item-text bg-transparent">
          <h4>{m(date).format('MMMM')}</h4>
        </div>
      </div>
    );
  }
  renderDayHeader(date, key) {
    return <li key={`day-header-${date.getDay}-${key}`} className="timeline-separator" data-datetime={m(date).calendar(null, this.calendar)} />
  }
  renderEventCard(card, key) {
    const { props } = card;
    return (
      <li key={`${props.date.getTime()}${key}`}>
        <div className="timeline-badge bg-primary" />
        <div className="timeline-panel">
          {card}
        </div>
      </li>
    );
  }
  renderDay(events, month, year) {
    let dayEvs = [];
    Object.keys(events).map((day, key) => {
      dayEvs.push(this.renderDayHeader(new Date(`${year}-${month}-${day}`), key));
      Object.keys(events[`${day}`]).map((i) => dayEvs.push(this.renderEventCard(events[`${day}`][i], i)))
      return true;
    });
    return <ul className="timeline-alt ml-lg mr-lg">{dayEvs}</ul>;
  }
  renderMonth(events, year) {
    return Object.keys(events).map((month) => (
      <div className="card-body month fw p0" key={`month-${month}`}>
        {this.renderMonthHeader(new Date(`${year}-${month}-01`))}
        {this.renderDay(events[`${month}`], month, year)}
      </div>
    ));
  }
  renderYear(events) {
    return Object.keys(events).map((year) =>
      <div key={`year-${year}`}>{this.renderMonth(events[`${year}`], year)}</div>
    );
  }

  render() {
    const { children } = this.props;
    let events = {}

    let lastChildPath;
    let someInc = 0;

    Children.forEach(children, (child) => {
      if (child.type === CalendarItem) {
        let childPath = m(child.props.date).format(`'YYYY'.'MM'.'DD'`);
        if (lastChildPath === childPath) {
          someInc += 1;
        } else {
          lastChildPath = childPath;
          someInc = 0;
        }
        childPath += `.'${someInc}'`
        _.setWith(events, childPath, child, Object);
      }
    });
    return (

      <div className="card calendar">
        {this.renderYear(events)}
      </div>
    );
  }
}
export default EventCalendar;
