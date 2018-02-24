import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Card from 'antd/lib/card';
import _ from 'lodash';
import { Link } from 'teardrop';
import { MiddleArea } from 'components/layout';
import InfiniteScroll from 'react-infinite-scroll-component';
import Button from 'antd/lib/button';
import clubPermissions from 'utils/club_permissions';
import FeedItem from './FeedItem';
import './NewsFeed.scss';

class AggregatedNewsFeed extends Component {
  static propTypes = {
    data: PropTypes.object,
    viewer: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.paginate = this.paginate.bind(this);
  }
  async paginate() {
    const { data } = this.props;
    const { fetchMore } = data;
    const cursor = _.get(data, 'aggregateFeed.posts.page_info.next_page_cursor');

    if (cursor) {
      await fetchMore({
        variables: {
          first: 15,
          cursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            ...fetchMoreResult,
            aggregateFeed: {
              ...prev.aggregateFeed,
              ...fetchMoreResult.aggregateFeed,
              posts: {
                ...prev.aggregateFeed.posts,
                ...fetchMoreResult.aggregateFeed.posts,
                edges: _.uniqBy([...prev.aggregateFeed.posts.edges, ...fetchMoreResult.aggregateFeed.posts.edges], edge => {
                  return edge.post._id
                }),
              }
            }
          }
        }
      })
    }
    return null;
  }
  render() {
    const { data, viewer } = this.props;
    const pageInfo = _.get(data, 'aggregateFeed.posts.page_info', {});
    const posts = _.get(data, 'aggregateFeed.posts.edges', []);

    if ((!data || data.loading) && posts.length === 0) {
      return <Card loading style={{ width: '100%' }} />
    }

    if (posts.length <= 0) {
      return (
        <MiddleArea className="text-center">
          <i className="fa fa-fw fa-5x fa-newspaper-o mb" />
          <h2>Welcome to your news feed!</h2>
          <hr className="mb mt" />
          <p className="p mb">
            Posts from clubs you follow or join will appear here. We recommend following OpenClub for updates and news.
          </p>
          <Link to="/openclub" className="btn btn-primary btn-lg"><i className="fa fa-fw fa-chevron-right" /> {"Let's go"}</Link>
        </MiddleArea>
      )
    }
    return (
      <div>
        <Button onClick={() => data.refetch()} type="primary" loading={data.loading}><i className="fa fa-refresh" /></Button>
        <div className="posts-container">
          <InfiniteScroll
            pullDownToRefresh
            pullDownToRefreshContent={<h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>}
            releaseToRefreshContent={<h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>}
            refreshFunction={() => data.refetch()}
            hasMore={pageInfo.has_next_page}
            next={this.paginate}
            endMessage=" "
            loader={<Card className="post" loading style={{ width: '100%' }} />}
          >
            {posts.map(edge => <FeedItem perm={clubPermissions(viewer, _.find(viewer.memberships, { club_id: _.get(edge, 'post.owner.owner_id') }))} baseQuery="aggregateFeed" post={edge.post} key={edge.post._id} viewer={viewer} />)}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

const NewsFeedGQL = gql`
  query aggregateFeed($first: Int!, $cursor: MongoID) {
    aggregateFeed {
      posts(first: $first, cursor: $cursor) {
        page_info{
          next_page_cursor
          has_next_page
        }
        edges{
          post{
            _id
            datetime
            user_id
            user{
              name
              images{
                square
              }
              fbid
            }
            text
            likes_count
            comments_count
            liked
            attachment
            owner{
              type
              slug
            }
            images{
              thumb
              background
            }
            privacy
          }
        }
      }
    }
  }
`

const AggregatedNewsFeedQuery = graphql(NewsFeedGQL, {
  options: props => {
    if (!props.viewer) return false;
    return {
      variables: {
        first: 15
      }
    }
  },
  skip: props => {
    if (!props.viewer) return true;
  }
})(AggregatedNewsFeed);

export default AggregatedNewsFeedQuery;
