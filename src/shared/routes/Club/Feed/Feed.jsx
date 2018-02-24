import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet'
import NewsFeed from 'components/newsfeed/NewsFeed';
import PostPage from 'components/newsfeed/PostPage'
import { MatchGroup, Match } from 'teardrop';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import _ from 'lodash';

// WIDGETS
import ClubInviteWidget from 'components/widgets/ClubInviteWidget'

class Feed extends Component {
  static propTypes = {
    club: PropTypes.object,
    viewer: PropTypes.object,
    location: PropTypes.object,
    perm: PropTypes.object
  }
  render() {
    const { club, viewer, location, perm, slug } = this.props;

    const regex = /^\/[\w\d]+\/feed\/([\w\d]+)/;
    let firstPostId;

    if (regex.test(location.pathname)) {
      let match = location.pathname.match(regex)[1];
      firstPostId = match;
    }
    return (
      <div>
        <Helmet title={`${club.name} — Feed`} />
        <Row gutter={16}>
          <Col xs={24} lg={16}>
            <MatchGroup>
              <Match pattern={`/${slug}/feed`} render={() => <NewsFeed feedOwnerId={_.get(club, '_id')} feedOwnerType="clubs" slug={slug} viewer={viewer} firstPostId={firstPostId} perm={perm} />} />
              <Match pattern={`/${slug}/feed/post/:post_id`} render={params => <PostPage perm={perm} viewer={viewer} {...params} />} />
            </MatchGroup>
          </Col>
          <Col lg={8} className="hidden-xs hidden-sm hidden-md">
            {viewer && <ClubInviteWidget club={club} />}
          </Col>
        </Row>
      </div>
    )
  }
}

export default Feed
