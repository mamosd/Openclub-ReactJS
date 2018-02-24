import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import _ from 'lodash';
import Select, { Option } from 'antd/lib/select';
import { email } from 'utils/form_validation/errors';
import Spin from 'antd/lib/spin';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';

import error from 'utils/error';
import { ContentPage } from 'components/layout';


class ClubInviteWidget extends Component {
  static propTypes = {
    club: PropTypes.object,
    viewer: PropTypes.object,
    data: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.state = {
      friends: [],
      selected: [],
      results: [],
      value: '',
      querying: false,
      submitting: false
    }
    this.invite = this.invite.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  async invite() {
    if (this.state.selected.length === 0) return message.info('Please enter values to invite.');

    const { invite, club } = this.props;

    const invitations = this.state.selected.map(recipient => ({
      recipient
    }));

    try {
      this.setState({ submitting: true });
      await invite({
        variables: {
          clubId: club._id,
          invitations
        }
      });
      this.setState({ submitting: false, selected: [] });
      message.success('Invites Sent', 10);
    } catch (err) {
      message.error(error(err), 20);
      this.setState({ submitting: false });
    }
  }
  async findFriends() {
    const { data } = this.props;
    const { facebookToken } = data || {};
    if (!facebookToken) return false;
    this.setState({ querying: true })
    const query = await fetch(`https://graph.facebook.com/me/friends?access_token=${facebookToken}`);
    const friends = await query.json();
    this.setState({ friends, querying: false })
  }
  async handleSearch(value) {
    this.setState({ value })
    if (this.state.friends.length === 0 && !this.state.queried) await this.findFriends();

    const results = _.filter(this.state.friends, f => f && f.name && f.name.contains(value));
    this.setState({ results })
  }
  handleChange(selected) {
    let latest = selected[selected.length - 1];
    if (typeof latest === 'string') {
      latest = _.split(latest, /[\s;,]/);
      if (latest.length > 1) {
        selected = selected.slice(1);
        latest.forEach(s => {
          let eReg = s.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
          if (eReg) selected.push(eReg[0]);
        })
      }
    }

    this.setState({
      selected: _.uniqWith(selected, _.isEqual),
      value: ''
    });
  }
  render() {
    const { club } = this.props;
    const { results, value, selected } = this.state;

    let children = [];

    if (results) {
      results.forEach(val => {
        children.push(<Option key={val.id} value={val.id}>{val.name}</Option>);
      })
    }
    if (value !== '' && typeof value === 'string' && email(value) === undefined) {
      children.push(<Option key={`email-input`} value={value}>{value}</Option>);
    }
    return (
      <ContentPage>
        <h4>Invite your friends</h4>
        <Select
          mode="multiple"
          value={this.state.selected}
          placeholder="Type an email address"
          onChange={this.handleChange}
          onSearch={this.handleSearch}
          notFoundContent={this.state.querying && <Spin size="small" />}
          style={{ width: '100%' }}
          className="bottom-gap"
          >
          {children}
        </Select>
        <Button onClick={this.invite} loading={this.state.submitting} type="primary" disabled={this.state.selected.length === 0} style={{ width: '100%' }}><i className="fa fa-plus" /> Invite to {club.name}</Button>
      </ContentPage>
    );
  }
}

const facebookTokenQuery = gql`
  query facebookToken{
    facebookToken
  }
`

const inviteMutation = gql`
  mutation clubInvite($clubId: MongoID!, $invitations: [invitationInput]!){
    clubInvite(clubId: $clubId, invitations: $invitations) {
      _id
    }
  }
`

const ClubInviteWidgetApollo = compose(
  graphql(facebookTokenQuery, {
    options: {
      skip: process.env.IS_SERVER === true,
      fetchPolicy: 'cache-and-network'
    }
  }),
  graphql(inviteMutation, {
    name: 'invite'
  })
)(ClubInviteWidget);

export default ClubInviteWidgetApollo
