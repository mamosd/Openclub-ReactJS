import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { message } from 'antd'
import ClubProfileForm from 'components/forms/ClubProfileForm'
import { stringKeyObjectFilter, shallowObjectDiff } from 'utils/object_helpers'

class ClubProfile extends Component {
  static propTypes = {
    club: PropTypes.object,
    updateClub: PropTypes.func
  }
  constructor(props) {
    super(props)

    this.updateProfile = this.updateProfile.bind(this)
  }
  updateProfile(values, dispatch, props) {
    const { updateClub, club } = this.props

    // get clean value object and image diff
    const realValues = stringKeyObjectFilter(values, props.registeredFields)
    realValues.images = shallowObjectDiff(realValues.images, club.images)

    updateClub({
      variables: {
        clubId: club._id,
        club: realValues
      }
    }).then(() => {
      message.success('Club successfully updated', 4)
    }).catch(err => {
      message.error('Error updating club: ' + err, 4)
    })
  }
  render() {
    const { club, submitting } = this.props;
    return (
      <div className="oc-form">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <h3>Club Profile</h3>
            <div className="xs-hidden sm-hidden">
              <hr className="mb-lg mt-lg" />
              <h4 className="mb">Discovery</h4>
              <p className="mb">For your club to appear in Suggested Clubs, Discovery or Search, you need to ensure that you have a cover photo, profile photo, description and location as a minimum.</p>
              <h4 className="mb">Age Restrictions</h4>
              <p className="mb">If you specify an age restriction for your club, users must provide their date of birth before joining.</p>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <h4 className="mb-sm">{club.name} — Profile</h4>
            <ClubProfileForm initialValues={club} onSubmit={this.updateProfile} submitting={submitting} />
          </Col>
        </Row>
      </div>
    )
  }
}

const mutation = gql`
  mutation updateClub($clubId: MongoID!, $club: clubUpdate!){
    updateClub(clubId: $clubId, club: $club){
      _id
      slug
      name
      images{
        thumb
        background
        square
      }
      details{
        about
        location
        minimum_age
        founded
        email
        phone
        website
        facebook
        instagram
        linkedin
        twitter
      }
    }
  }
`

const ClubProfileWithApollo = graphql(mutation, {
  name: 'updateClub',
})(ClubProfile)

export default ClubProfileWithApollo
