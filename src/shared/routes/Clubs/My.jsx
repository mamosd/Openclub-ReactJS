import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClubCard from 'components/cards/ClubCard'
import { Row, Col } from 'antd'
import _ from 'lodash';

import './Landing.scss'

class ClubInvitations extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  static propTypes = {
    viewer: PropTypes.object
  }
  constructor(props) {
    super(props)
  }
  goTo(link) {
    this.context.router.transitionTo(link);
  }
  render() {
    const { viewer } = this.props;
    const { memberships = [] } = viewer;

    const subscriptions = _.filter(memberships, c => !!c.subscription || (c.roles && c.roles.length > 0))

    return (
      <div>
        <Row>
          {subscriptions.map(membership => (
            <ClubCard club={membership.club} viewer={viewer} key={membership._id} />
          ))}
        </Row>
      </div>
    )
  }
}
export default ClubInvitations
