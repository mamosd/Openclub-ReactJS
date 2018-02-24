import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Menu, { Item as MenuItem } from 'antd/lib/menu';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import error from 'utils/error';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

class ClubActions extends Component {
  static propTypes = {
    club: PropTypes.object,
    perm: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.updateMembership = this.updateMembership.bind(this);
    this.processAction = this.processAction.bind(this);
  }
  async updateMembership(membership) {
    const { updateMembership, club } = this.props;

    try {
      await updateMembership({
        variables: {
          clubId: club._id,
          membership
        }
      })
      if (membership.notifications) message.success(`You will now receive notifications for posts in ${club.name}.`, 5);
      if (membership.notifications === false) message.success(`You will no longer receive notifications for posts in ${club.name}.`, 5);
      if (membership.following) message.success(`You are now following ${club.name}.`, 5);
      if (membership.following === false) message.success(`You are no longer following ${club.name}.`, 5);
    } catch (err) {
      Modal.error({
        title: 'Uh-oh!',
        content: error(err)
      })
    }
  }
  processAction({ key }) {
    let membership = {};
    if (key === 'unmute' || key === 'mute') {
      membership.notifications = key === 'unmute';
    }
    if (key === 'follow' || key === 'unfollow') {
      membership.following = key === 'follow';
    }
    this.updateMembership(membership);
  }
  render() {
    const { perm } = this.props;
    if (!perm.canViewFeed) return <div />
    return (
      <Menu onClick={this.processAction}>
        { perm.userIsFollower && <MenuItem key="unfollow">Unfollow</MenuItem> }
        { !perm.userIsFollower && <MenuItem key="follow">Follow</MenuItem> }
        { perm.userIsSubscribed && <MenuItem key="mute">Turn notifications off</MenuItem> }
        { !perm.userIsSubscribed && <MenuItem key="unmute">Turn notifications on</MenuItem> }
      </Menu>
    );
  }
}

const updateMembershipMutation = gql`
  mutation updateMembership($clubId: MongoID!, $membership: membershipEdgeUpdate) {
    updateMembership(clubId: $clubId, membership: $membership){
      _id
      following
      notifications
    }
  }
`

const ClubActionsApollo = compose(
  graphql(updateMembershipMutation, {
    name: 'updateMembership',
    options: () => {
      let refetch = [];
      return {
        updateQueries: {
          user: (prev, { mutationResult }) => {
            const { updateMembership } = mutationResult.data;
            if (!prev.user.memberships || prev.user.memberships instanceof Array === false) {
              prev.user.memberships = [];
              prev.user.memberships.push(updateMembership);
              return prev;
            }

            const membershipIndex = _.findIndex(prev.user.memberships, { _id: updateMembership._id });
            if (membershipIndex > -1) {
              prev.user.memberships[membershipIndex] = updateMembership;
            } else {
              refetch.push('user');
            }
            return prev;
          }
        },
        refetchQueries: refetch
      }
    }
  })
)(ClubActions);

export default ClubActionsApollo;
