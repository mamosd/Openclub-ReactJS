import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Icon from 'antd/lib/icon';
import Tag from 'antd/lib/tag';
import Tooltip from 'antd/lib/tooltip';
import message from 'antd/lib/message';
import Button, { Group as ButtonGroup } from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { Link } from 'teardrop';
import m from 'moment';
import Timeline, { Item as TimelineItem } from 'antd/lib/timeline'
import { ContentPage } from 'components/layout'
import _ from 'lodash'
import la from 'logandarrow'
import { stringKeyObjectFilter } from 'utils/object_helpers'
import error from 'utils/error';

import ClubMemberProfile from 'components/forms/ClubMemberProfile'

class Membership extends Component {
  static propTypes = {
    membership: PropTypes.object,
    updateMembership: PropTypes.func,
    perm: PropTypes.object,
    club: PropTypes.object
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);

    this.updateProfile = this.updateProfile.bind(this);
  }
  async updateProfile(values, dispatch, { registeredFields }) {
    const { updateMembership } = this.props;

    let membership = stringKeyObjectFilter(values, registeredFields);

    try {
      message.loading('Updating...', 20);
      await updateMembership({
        variables: {
          clubId: this.props.club._id,
          membership
        }
      })
      message.destroy();
      message.success('Done', 5);
    } catch (err) {
      message.destroy();
      message.error(error(err.message), 20);
    }
  }
  render() {
    const { club, membership = {}, perm } = this.props;
    const { subscription, roles = [] } = membership;
    let timelineChildren = [];

    if (subscription) {
      if (subscription.membership_plan && subscription.pending_approval === false && !subscription.expiry_date) {
        timelineChildren.push(<TimelineItem key="free-active" dot={<Icon type="check-circle" />} color="green">{_.get(subscription, 'membership_plan.name') } subscription active.</TimelineItem>)
      }
      if (subscription.membership_plan && subscription.pending_approval === false && subscription.expiry_date) {
        timelineChildren.push(<TimelineItem key="active" dot={<Icon type="check-circle" />} color="green">{_.get(subscription, 'membership_plan.name') } subscription active until {m(_.get(subscription, 'expiry_date')).format('LL')}</TimelineItem>)
      }
      if (subscription.pending_approval === true) {
        timelineChildren.push(<TimelineItem key="pending" dot={<Icon type="clock-circle-o" />} color="orange">Pending membership approval</TimelineItem>);
      }
      if (subscription.next_renewal && m(_.get(subscription, 'next_renewal')).isBefore(m())) {
        timelineChildren.push(<TimelineItem key="overdue" dot={<Icon type="clock-circle-o" />} color="red">Membership renewal overdue.</TimelineItem>)
      } else if (subscription.next_renewal && m(_.get(subscription, 'next_renewal')).isBefore(m().add(15, 'days'))) {
        timelineChildren.push(<TimelineItem key="due" >Membership renewal due {m(_.get(subscription, 'next_renewal')).fromNow()}.</TimelineItem>)
      }
    } else {
      timelineChildren.push(<TimelineItem key="nonmember" color="orange">You are not a member of this club. {perm.clubHasPublicPlans && <span><Link to={`/${club.slug}/join`}>Join this club</Link>.</span>}</TimelineItem>);
    }

    return (
      <Row gutter={16}>
        <Col xs={24} md={16} className="bottom-gap-large">
          <ContentPage>
            <h4 style={{ marginBottom: 25 }}>Club Membership</h4>
            <Timeline>
              {timelineChildren}
            </Timeline>
            {perm.isMember && <div>
              <hr className="mb mt" />
              <h4 className="mb">Club Profile</h4>
              <ClubMemberProfile initialValues={membership} onSubmit={this.updateProfile} />
              <hr className="mb mt" />
              {subscription.membership_plan && subscription.pending_approval === false &&
                <div className="text-center">
                    <Button type="primary" onClick={() => this.context.router.transitionTo(`/${club.slug}/join`)}><i className="fa fa-fw fa-refresh" /> Change Plan</Button>
                    <span> </span>
                    <Button
                      type="danger"
                      onClick={() => Modal.warning({
                        title: 'Leave Club',
                        content: 'Are you sure you wish to leave this club? This will cancel any active membership agreement you have with this club at the end of your billing period.',
                        onOk: () => true,
                        okText: 'Yes, leave club',
                        cancelText: 'No'
                      })}
                      >
                      <i className="fa fa-fw fa-sign-out" /> Leave Club
                    </Button>
                </div>
              }
            </div>}
          </ContentPage>
        </Col>
        <Col xs={24} md={8}>
            <ContentPage>
              <h4 className="mb">Club Permissions</h4>
              <div className="mb">
                {_.includes(roles, 'admin') && <Tooltip title="Full access to all club controls"><Tag color="#f50">Admin</Tag></Tooltip>}
                {(_.includes(roles, 'admin') || _.includes(roles, 'moderator')) && <Tooltip title="Moderate feed posts and comments"><Tag color="#ffbe08">Feed</Tag></Tooltip>}
                {(_.includes(roles, 'admin') || _.includes(roles, 'accountant')) && <Tooltip title="View and log club finances"><Tag color="#87d068">Finances</Tag></Tooltip>}
                {(_.includes(roles, 'admin') || _.includes(roles, 'curator')) && <Tooltip title="View, manage and approve club members"><Tag color="#108ee9">Members</Tag></Tooltip>}
                {(!roles || roles.length === 0) && <p>{"You haven't been assigned any roles."}</p>}
              </div>
              <h4 className="mb">Feed Permissions</h4>
              <div className="mb">
                {perm.canPostFeed && <Tooltip title="You can post in the feed"><Tag color="#108ee9">Post</Tag></Tooltip>}
                {perm.canViewFeed && <Tooltip title="You can view the feed"><Tag color="#87d068">View</Tag></Tooltip>}
              </div>
            </ContentPage>
        </Col>
      </Row>
    )
  }
}

const updateMembershipMutation = gql`
  mutation updateMembership($clubId: MongoID!, $membership: membershipEdgeUpdate) {
    updateMembership(clubId: $clubId, membership: $membership) {
      _id
      feed_permissions
      following
      notifications
      bio
      display_email
      display_phone
      display_messenger
      directory_visible
    }
  }
`

const cancelMembershipMutation = gql`
  mutation cancelMembership($membershipId: MongoID!) {
    cancelMembership(membershipId: $membershipId) {
      _id
      subscription{
        start_date
        pending_approval
        auto_renew
        membership_plan{
          _id
          name
          prices{
            price{
              amount_float
            }
            setup_price{
              amount_float
            }
          }
        }
        last_renewal_date
      }
    }
  }
`

const MembershipApollo = compose(
  graphql(updateMembershipMutation, {
    name: 'updateMembership'
  }),
  graphql(cancelMembershipMutation, {
    name: 'cancelMembership'
  })
)(Membership)

export default MembershipApollo;
