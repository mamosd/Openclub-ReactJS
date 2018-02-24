import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Steps, { Step } from 'antd/lib/steps'
import { ContentPage } from 'components/layout'

class ClubHeroHelper extends Component {
  static propTypes = {
    club: PropTypes.object
  }
  render() {
    const { club } = this.props;
    let step
    if (!club.details) {
      step = 0
    } else if (!club.membership_plans || club.membership_plans.length <= 0) {
      step = 1
    } else if (!club.stripe_account || !club.stripe_account.data || !club.stripe_account.data.external_accounts.data || !club.stripe_account.data.external_accounts.data.length === 0) {
      step = 2
    } else {
      return null;
    }
    // TODO: bank details setup

    return (
      <ContentPage className="club-hero">
        <Steps current={step}>
          <Step title="Club Profile" description="Complete your club profile" />
          <Step title="Membership Plans" description="Create membership plans so that members can join" />
          <Step title="Bank Details" description="Add bank information so that you can receive payments" />
        </Steps>
      </ContentPage>
    )
  }
}

export default ClubHeroHelper
