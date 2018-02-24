import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import error from 'utils/error';
import Card from 'antd/lib/card';
import FeedItem from './FeedItem';
import './NewsFeed.scss';

class PostPage extends Component {
  static propTypes = {
    post: PropTypes.object,
    comment: PropTypes.func,
    like: PropTypes.func,
    perm: PropTypes.object,
    viewer: PropTypes.object
  }
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props);
    const { post: data, perm, viewer } = this.props;
    if (!data || data.loading) {
      return <Card loading style={{ width: '100%' }} />
    }
    return (
      <div className="posts-container">
        <FeedItem baseQuery="post" post={data.post} comments={data.post.comments} perm={perm} viewer={viewer} />
      </div>
    )
  }
}

const postQuery = gql`
  query post($postId: MongoID!, $firstLikes: Int!, $cursorLikes: ID, $firstComments: Int!, $cursorComments: ID) {
    post(postId:$postId) {
      _id
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
      likes(first:$firstLikes, cursor: $cursorLikes) {
        edges{
          user{
            name
            images{
              square
            }
            fbid
          }
        }
      }
      comments_count
      liked
      text
      attachment
      images{
        thumb
        background
      }
      privacy
      comments(first:$firstComments, cursor:$cursorComments) {
        edges{
          comment{
            _id
            post_id
            text
            attachment
            images{
              square
              background
            }
            user{
              name
              fbid
              images{
                square
              }
            }
          }
        }
      }
    }
  }
`

const FeedItemApollo = compose(
  graphql(postQuery, {
    name: 'post',
    options: props => ({
      variables: {
        postId: props.params.post_id,
        firstComments: 25,
        firstLikes: 0
      }
    })
  })
)(PostPage);

export default withApollo(FeedItemApollo);
