import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { browserHistory } from 'teardrop'
import CreateClubForm from 'components/forms/CreateClubForm'
import {
  PageHeader,
  MiddleArea
} from 'components/layout'
import { message, Modal } from 'antd'
import error from 'utils/error';
import { tracking } from 'modules/mixpanel';

const CreateClub = ({ mutate, submitting }, { router }) => {

  tracking(mixpanel => mixpanel.track('Visit Create Club'));

  const createTheClub = async values => {
    try {
      await mutate({
        variables: {
          slug: values.slug,
          club: values.club
        }
      });
      Modal.success({
        title: "Club Created",
        content: "Your club page has been created. Follow the steps to complete the setup and invite members to your club."
      });
      router.transitionTo(`/${values.slug}/settings`);
    } catch (err) {
      Modal.error({
        title: "Error Creating Club",
        content: error(err)
      })
    }
  }

  return (
    <MiddleArea>
      <div className="text-center">
        <i className="fa fa-fw fa-plus fa-5x mb" />
        <h3>A new OpenClub</h3>
        <hr className="mb mt" />
      </div>
      <p className="mb">
        {"OpenClub manages your members, events and payments—it's free to get started. Your new club page is just one click away."}
      </p>
      <div style={{ maxWidth: 480 }}>
        <CreateClubForm onSubmit={createTheClub} submitting={submitting} />
      </div>
    </MiddleArea>
  )
}

CreateClub.contextTypes = {
  router: PropTypes.object
}

const createMutation = gql`
  mutation createClub($slug: String!, $club: clubInput!){
    createClub(slug: $slug, club: $club){
      _id
      club_id
      feed_permissions
      following
      notifications
      directory_visible
      display_email
      display_messenger
      display_phone
      bio
      roles
      club{
        _id
        name
        slug
        images{
          square
          background
        }
      }
      subscription{
        start_date
      }
    }
  }
`

const CreateClubWithApollo = graphql(createMutation, {
  options: {
    refetchQueries: ['user']
  }
})(CreateClub)

export default CreateClubWithApollo

export {
  CreateClub
}
