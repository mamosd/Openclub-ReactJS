import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Modal } from 'antd';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import cx from 'classnames';
import _ from 'lodash';
import message from 'antd/lib/message';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ContentPage } from 'components/layout';

import NewsFeedPostForm from 'components/forms/NewsFeedPostForm';
import feedPermissions from 'utils/feed_permissions';
import FeedItem from './FeedItem';
import './NewsFeed.scss';

class NewsFeed extends Component {
  static propTypes = {
    feedOwnerId: PropTypes.string,
    feedOwnerType: PropTypes.string,
    feed: PropTypes.object,
    viewer: PropTypes.object,
    perm: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }

    this.paginate = this.paginate.bind(this);
  }
  async paginate() {
    const { feed } = this.props;
    const { fetchMore } = feed;
    const cursor = _.get(data, 'feed.posts.page_info.next_page_cursor');

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
            feed: {
              ...prev.feed,
              ...fetchMoreResult.feed,
              posts: {
                ...prev.feed.posts,
                ...fetchMoreResult.feed.posts,
                edges: _.uniqBy([...prev.feed.posts.edges, ...fetchMoreResult.feed.posts.edges], edge => {
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
  getPermissions(perm = false) {
    const { viewer, feed: { feed }} = this.props;
    return perm ? feedPermissions(viewer, feed).indexOf(perm) > -1 : feedPermissions(viewer, feed);
  }
  async handleSubmit(post) {
    const { perm, createPost, feedOwnerId, feedOwnerType } = this.props;
    if (!perm.canPostFeed) return message.error('You do not have permissions to post to this feed.', 10);

    try {
      this.setState({ loading: true })
      await createPost({
        variables: {
          feedOwnerId,
          feedOwnerType,
          post
        }
      });
      this.setState({ loading: false })
    } catch (err) {
      this.setState({ loading: false })
      Modal.error({
        title: 'Uh-oh!',
        content: err
      });
    }
  }
  render() {
    const { perm, feed, viewer, feedOwnerId, feedOwnerType, slug } = this.props;
    const posts = _.get(feed, 'feed.posts.edges', []);
    const pageInfo = _.get(feed, 'feed.posts.page_info', {});

    if (!feed || feed.loading) {
      return <Card loading style={{ width: '100%' }} />
    }

    if (!perm.canViewFeed) {
      return (
        <div className="posts-container">
          <div className="no-posts">
            <h1><i className="fa fa-ban" /></h1>
            <h2>Uh-oh!</h2>
            <p>Looks like you don't have permission to view this feed.</p>
          </div>
        </div>
      )
    }
    if (posts.length <= 0) {
      return (
        <div>
          {perm.canPostFeed && <ContentPage><NewsFeedPostForm viewer={viewer} handleSubmit={this.handleSubmit.bind(this)} activeRequest={this.state.loading} /></ContentPage>}
          <div className="posts-container">
            <div className="no-posts">
              <h1><i className="fa fa-newspaper-o" /></h1>
              <h2>No Posts, yet.</h2>
              <p>{perm.canPostFeed ? 'There aren\'t any posts — try posting something.' : 'There aren\'t any posts, yet. Stay tuned.'}</p>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        {perm.canPostFeed && <ContentPage><NewsFeedPostForm viewer={viewer} handleSubmit={this.handleSubmit.bind(this)} activeRequest={this.state.loading} /></ContentPage>}
        <div className="posts-container">
          <InfiniteScroll
            pullDownToRefresh
            pullDownToRefreshContent={<h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>}
            releaseToRefreshContent={<h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>}
            refreshFunction={() => feed.refetch()}
            hasMore={pageInfo.has_next_page}
            next={this.paginate}
            endMessage=" "
            loader={<Card className="post" loading style={{ width: '100%' }} />}
          >
            {posts.map(edge => <FeedItem owner={{ _id: feedOwnerId, type: feedOwnerType, slug }} baseQuery="feed" post={edge.post} key={edge.post._id} perm={this.props.perm} viewer={viewer} />)}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

const NewsFeedGQL = gql`
  query feed($feedOwnerId: MongoID, $feedOwnerType: String, $first: Int!, $cursor: MongoID) {
    feed(feedOwnerId: $feedOwnerId, feedOwnerType: $feedOwnerType) {
      _id
      owner{
        owner_id
        type
      }
      privacy
      permissions
      public_permissions
      posts(first: $first, cursor: $cursor) {
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
            owner{
              owner_id
              type
              slug
            }
            likes_count
            comments_count
            liked
            text
            attachment
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

const createPostGQL = gql`
  mutation createPost($feedOwnerId: MongoID, $feedOwnerType: String, $post: inputPost) {
    createPost(ownerId: $feedOwnerId, ownerType: $feedOwnerType, post: $post) {
      post {
        _id
        datetime
        text
        attachment
        images{
          thumb
          background
        }
        owner{
          owner_id
          type
          slug
        }
        likes_count
        comments_count
        liked
        user{
          name
          images{
            square
          }
          fbid
        }
        privacy
        user_id
      }
    }
  }
`

const NewsFeedQuery = compose(
graphql(NewsFeedGQL, {
  name: 'feed',
  options: props => {
    if (!props.feedOwnerId) return false;
    return {
      fetchPolicy: 'cache-and-network',
      variables: {
        feedOwnerId: props.feedOwnerId,
        feedOwnerType: props.feedOwnerType,
        first: 15
      }
    }
  },
  skip: props => {
    if (!props.feedOwnerId) return true;
  }
}),
graphql(createPostGQL, {
  name: 'createPost',
  options: {
    updateQueries: {
      feed: (prev, { mutationResult }) => {
        const { createPost } = mutationResult.data;
        if (!createPost) return prev;
        let clonedState = _.clone(prev);
        clonedState.feed.posts.edges.unshift(createPost);
        return clonedState;
      }
    }
  }
}))(NewsFeed);

export default NewsFeedQuery;
