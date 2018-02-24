import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './EventItem.scss'

class EventItem extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <li>
        <time dateTime="2014-07-20" style={{ background: 'https://farm4.staticflickr.com/3100/2693171833_3545fb852c_q.jpg' }}>
          <span className="day">4</span>
          <span className="month">Jul</span>
          <span className="year">2014</span>
          <span className="time">ALL DAY</span>
        </time>
        <div className="info">
          <h2 className="title">Independence Day</h2>
          <p className="desc">United States Holiday</p>
        </div>
        <div className="social">
          <ul>
            <li className="facebook" style={{ width: '33%' }}>
              <a href="#facebook">
                <span className="fa fa-facebook" />
              </a>
            </li>
            <li className="twitter" style={{ width: '33%' }}>
              <a href="#twitter">
                <span className="fa fa-twitter" />
              </a>
            </li>
            <li className="google-plus" style={{ width: '33%' }}>
              <a href="#google-plus">
                <span className="fa fa-google-plus" />
              </a>
            </li>
          </ul>
        </div>
      </li>
    );
  }
}
export default EventItem;
