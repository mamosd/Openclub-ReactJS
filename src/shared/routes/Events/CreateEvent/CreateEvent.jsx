import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { browserHistory } from 'teardrop'
import {
  ContentPage,
  PageHeader
} from 'components/layout'
import { message } from 'antd'

const CreateEvent = ({ mutate }, { router }) => {

  const createTheEvent = values => {
    mutate({
      variables: {
        event: values.event
      }
    }).then(({ data }) => {
      router.transitionTo(`/events/${data._id}`)
    }).catch(err => {
      message('Error creating event: ' + err, 4)
    })
  }

  return (
    <ContentPage>
      <PageHeader title="Create an Event" />
      <p>
        Keep your members organised, take payments for your tickets, and ensure the right people get the right tickets. Host your next event on OpenClub.
      </p>
    </ContentPage>
  )
}

CreateEvent.contextTypes = {
  router: PropTypes.object
}

const createMutation = gql`
  mutation createEvent($event: eventInput!){
    createEvent(event: $event){
      _id
      name
      images{
        thumb
        background
        square
      }
    }
  }
`

const CreateEventWithApollo = graphql(createMutation, {
  options: {
    updateQueries: {
      user: (prev, { mutationResult }) => {
        const newEvent = mutationResult.data.createEvent
        return {
          user: {
            ...prev.user,
            clubs: [...prev.user.clubs, newEvent]
          }
        }
      }
    }
  }
})(CreateEvent)

export default CreateEventWithApollo

export {
  CreateEvent
}
