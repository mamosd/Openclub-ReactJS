import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo'
import UserProfileForm from 'components/forms/UserProfileForm'
import { stringKeyObjectFilter, shallowObjectDiff } from 'utils/object_helpers'
import message from 'antd/lib/message'
import Loading from 'components/Loading/Loading'
import Modal from 'antd/lib/modal'
import gql from 'graphql-tag'
import _ from 'lodash'
import moment from 'moment'
import error from 'utils/error'
import userQuery from 'queries/user';

class UserProfile extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    token: PropTypes.string,
    initialValues: PropTypes.object,
    updateProfile: PropTypes.func
  }
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async handleSubmit(values, dispatch, props) {
    const { registeredFields } = props;
    const { updateProfile } = this.props;

    if (values.address) {
      values.address = _.omit(values.address, '__typename');
    }

    if (values.birthday instanceof Date) {
      values.birthday = moment(values.birthday).format('YYYY-MM-DD');
    }

    let userProfile = stringKeyObjectFilter(values, registeredFields)
    userProfile.images = shallowObjectDiff(userProfile.images, values.images)

    try {
      await updateProfile({
        variables: {
          user: userProfile
        }
      });
      message.success('Profile successfully updated', 10)
    } catch (err) {
      Modal.error({
        title: "Error Updating Profile",
        content: `Uh-oh! ${error(err)}`
      })
    }
  }
  render() {
    const { submitting, token, initialValues, ...rest } = this.props;
    if (!initialValues) return <Loading />
    return <UserProfileForm onSubmit={this.handleSubmit} submitting={submitting} token={token} initialValues={initialValues} {...rest} />
  }
}

const updateProfileGQL = gql`
  mutation updateProfile($user:userUpdate!){
    updateUser(user: $user) {
      _id
      name
      email
      phone
      address {
        formatted_address
      }
      images {
        thumb
        square
      }
      stripe_account {
        cards
        default_source
      }
      birthday
      email_verified
    }
  }
`

const GraphQLWrapper = compose(
  graphql(userQuery, {
    props: ({ data }) => ({
      refetch: data.refetch,
      initialValues: data.user
    })
  }),
  graphql(updateProfileGQL, {
    name: 'updateProfile'
  })
)(UserProfile);

export default GraphQLWrapper;
