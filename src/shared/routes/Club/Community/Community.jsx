import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Card from 'antd/lib/card';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Button from 'antd/lib/button';
import gql from 'graphql-tag';
import _ from 'lodash';

import Loading from 'components/Loading/Loading';
import { ContentArea, ContentPage } from 'components/layout';
import userPhoto from 'utils/user_photo';

class Community extends Component {
  static propTypes = {
    data: PropTypes.object
  }
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props);
    const { data: { club = {}, loading } } = this.props;

    if (loading || !club.members) return <Loading />;

    return (
      <ContentArea>
        <ContentPage>
          <Row gutter={16}>
            {club.members.edges.map(user => (
              <Col xs={24} md={12} key={user._id}>
                <Card bodyStyle={{ padding: 0 }} className="mb-sm">
                  <div className="table m0">
                    <div className="cell oh" style={{ width: 90, height: 90, overflow: 'hidden' }}>
                      <img src={userPhoto(_.get(user, 'profile.images', {}))} style={{ maxWidth: '100%' }} alt={_.get(user, 'profile.name', 'No name')} role="presentation" />
                    </div>
                    <div className="cell p" style={{ verticalAlign: 'top' }}>
                      <h4>{_.get(user, 'profile.name', 'No name')}</h4>
                      {_.get(user, 'profile.fbid') && <Button size="small" style={{ position: 'absolute', right: 10, top: 10 }} type="primary" onClick={e => { e.preventDefault(); window.open(`https://m.me/${user.profile.fbid}`) }}><i className="fa fa-fw fa-comment" /></Button>}
                      <p>
                        {_.get(user, 'profile.email') && <span>Email: {_.get(user, 'profile.email')}<br /></span>}
                        {_.get(user, 'profile.phone') && <span>Phone: {_.get(user, 'profile.phone')}<br /></span>}
                        {_.get(user, 'bio') && <i>{_.get(user, 'bio')}</i>}
                      </p>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </ContentPage>
      </ContentArea>
    );
  }
}

const ClubCommunityQuery = gql`
  query club($slug: String!, $first: Int!, $cursor: ID) {
    club(slug: $slug) {
      _id
      members(first: $first, cursor: $cursor){
        edges{
          _id
          bio
          profile{
            name
            images{
              square
            }
            fbid
            email
            fbid
            phone
          }
        }
      }
    }
  }
`

const CommunityApollo = graphql(ClubCommunityQuery, {
  options: props => ({
    variables: {
      slug: props.club.slug,
      first: 25
    }
  })
})(Community);

export default CommunityApollo;
