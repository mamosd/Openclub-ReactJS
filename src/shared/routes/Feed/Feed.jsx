import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Layout } from 'antd'
import AggregatedNewsFeed from 'components/newsfeed/AggregatedNewsFeed'
import { CalendarItem } from 'components/EventCalendar'
import UserProfile from 'modules/forms/UserProfile'
import { ContentArea, ContentPage } from 'components/layout';

import './Feed.scss';

const { Content } = Layout;

class Feed extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    location: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.state = {
      activeRequest: false,
      posts: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(submission, success) {
    this.setState({ activeRequest: true });
    let posts = this.state.posts;
    posts.push(submission);
    this.timeout = setTimeout(() => { this.setState({ activeRequest: false, posts }); success() }, 2000);
    return true;
  }
  render() {
    const { viewer } = this.props;
    return (
      <Row gutter={8}>
        <Col lg={16} xs={24}>
          <div className="feed-container">
            <AggregatedNewsFeed viewer={this.props.viewer} />
          </div>
        </Col>
        <Col lg={8} className="hidden-xs hidden-sm hidden-md">
          {viewer && (!viewer.email || !viewer.birthday) && (
            <ContentArea>
              <ContentPage>
                <h3 className="mb">Profile Details</h3>
                <p>Some details are missing from your profile. Your OpenClub profile is portable between the clubs that you join. This means that once this is set, you'll never need to change it elsewhere again.</p>
                <hr className="mb mt" />
                <UserProfile />
              </ContentPage>
            </ContentArea>
          )}
        </Col>
      </Row>
    );
  }
}
export default Feed;
