// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Row from 'antd/lib/row';
import Spin from 'antd/lib/spin';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

// Components
import InfiniteScroll from 'react-infinite-scroll-component'
import ClubCard from 'components/cards/ClubCard'

import './Landing.scss'

class ClubsLanding extends Component {
  static propTypes = {
    data: PropTypes.object,
    viewer: PropTypes.object
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)

    this.paginate = this.paginate.bind(this);
  }
  async paginate() {
    const { fetchMore, clubs: { page_info: pageInfo = {} } = {} } = this.props.data;
    if (pageInfo.next_page_cursor) {
      await fetchMore({
        variables: {
          first: 24,
          cursor: _.get(this.props.data, 'clubs.page_info.next_page_cursor')
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            ...fetchMoreResult,
            clubs: {
              ...prev.clubs,
              ...fetchMoreResult,
              page_info: fetchMoreResult.clubs.page_info,
              edges: _.uniqBy([...prev.clubs.edges, ...fetchMoreResult.clubs.edges], '_id')
            }
          }
        }
      });
    }
    // No cursor
    return null;
  }
  goTo(link) {
    this.context.router.transitionTo(link);
  }
  render() {
    const { viewer, data = {} } = this.props;
    const { clubs: { page_info: pageInfo, edges = [] } = {} } = data;

    return (
      <div>
        <Row type="flex" justify="flex-start">
          <InfiniteScroll
            hasMore={pageInfo && pageInfo.has_next_page}
            next={this.paginate}
            loader={<Spin style={{ width: '100%' }} tip="Loading..." />}
            endMessage=" "
            >
              {edges.map(club => <ClubCard key={club._id} club={club} viewer={viewer} />)}
          </InfiniteScroll>
        </Row>
      </div>
    )
  }
}

const clubsQueryGQL = gql`
  query clubs($first: Int!, $cursor: ID) {
    clubs(first:$first, cursor:$cursor) {
      page_info{
        next_page_cursor
        has_next_page
      }
      edges{
        _id
        name
        slug
        details{
          about
          location
        }
        images {
          square
          background
        }
        settings{
          directory_privacy
          feed_permissions
          feed_public_permissions
        }
        membership_plans{
          _id
          name
          description
          public
          prices{
            _id
            duration
            price{
              amount
              amount_float
            },
            setup_price{
              amount
              amount_float
            }
          }
        }
      }
    }
  }
`
const ClubsApollo = graphql(clubsQueryGQL, {
  options: () => ({
    variables: {
      first: 24
    }
  })
})(ClubsLanding)

export default ClubsApollo;
