import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Table from 'antd/lib/table';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import _ from 'lodash';

// graphql
import membersQuery from 'queries/members';
import { changeMemberGQL, approveMemberGQL, deleteMemberGQL } from 'mutations/members';

// Components
import { ContentPage, IconTitle } from 'components/layout';
import Loading from 'components/Loading/Loading';

// utils
import { display as displayError } from 'utils/error';

class Members extends Component {
  static propTypes = {
    data: PropTypes.object,
    club: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.state = {
      expandedRows: []
    }
  }
  async deleteMember(member) {
    const { club, deleteMember } = this.props;

    try {
      await deleteMember({
        variables: {
          clubId: club._id,
          memberId: member._id
        }
      });
    } catch (err) {
      displayError(err);
    }
  }
  async approveMember(member) {
    const { club, approveMember } = this.props;
    try {
      await approveMember({
        variables: {
          clubId: club._id,
          memberId: member._id
        }
      });
    } catch (err) {
      displayError(err);
    }
  }
  async changeMember(member, subscription) {
    const { club, changeMember } = this.props;

    try {
      await changeMember({
        variables: {
          clubId: club._id,
          memberId: member._id,
          subscription
        }
      });
    } catch (err) {
      displayError(err);
    }
  }
  render() {
    const { member } = this.state;
    const { data, club } = this.props;
    console.log(this.props);

    const { loading, members } = data;
    const { membership_plans: membershipPlans } = club;

    if (!members && loading) return <Loading />;

    const deleteMember = (member, e) => {
      e.preventDefault();
      Modal.confirm({
        title: `Delete ${_.get(member, 'profile.name', 'user')}?`,
        content: 'Are you sure you want to delete this membership?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: this.deleteMember.bind(this, member)
      });
    }

    const changeMembership = (member, e) => {
      e.preventDefault();
    }

    const approveMember = (member, e) => {
      e.preventDefault();
      this.approveMember(member);
    }

    const columns = [
      { title: 'Name', dataIndex: 'profile.name', key: 'name' },
      { title: 'Email', dataIndex: 'profile.email', key: 'email' },
      { title: 'Plan', dataIndex: 'subscription.membership_plan_id', key: 'membership_plan_name', render: value => <span>{(_.find(membershipPlans, p => p._id === value) || {}).name || 'Non member'}</span> },
      { title: 'Approval', dataIndex: 'subscription.pending_approval', key: 'pending_approval', render: (value, row) => value ? <span><Button type="primary" size="small" onClick={approveMember.bind(this, row)}>Approve</Button></span> : <span>Approved</span> },
      { title: 'Expiry', dataIndex: 'subscription.expiry_date', key: 'expiry_date', render: value => <span>{moment(value).format('DD/MM/YYYY')}</span> },
      { title: 'Actions', key: 'actions', render: (i, value) => <span><a href="#" onClick={deleteMember.bind(this, value)}>Delete</a>{/* | <a href="#" onClick={changeMembership.bind(this, value)}>Change</a>*/}</span> }
    ]

    const memberList = members && members.members ? members.members.edges : [];
    console.log(memberList);

    const expandRow = record => {
      const planId = _.get(record, 'subscription.membership_plan_id');
      const priceId = _.get(record, 'subscription.membership_plan_price_id');
      const plan = planId ? _.find(membershipPlans, p => p._id === planId) : false
      const price = priceId && plan ? _.find(plan.prices, p => p._id === priceId) : false


      return (
        <Row key={record._id}>
          <Col xs={24} md={12}>
            <strong>Name:</strong><br />
            {_.get(record, 'profile.name', 'N/A')}<br />
            <strong>Email:</strong><br />
            {_.get(record, 'profile.email', 'N/A')}<br />
            <strong>Phone:</strong><br />
            {_.get(record, 'profile.phone', 'N/A')}
            <strong>Address:</strong><br />
            {_.get(record, 'profile.address.formatted_address', 'N/A')}
          </Col>
          <Col xs={24} md={12}>
            <strong>Plan:</strong><br />
            {_.get(plan, 'subscription.start_date', 'N/A')}<br />
            <strong>Plan:</strong><br />
            {_.get(plan, 'name', 'N/A')}<br />
            <strong>Price:</strong><br />
            {price ? '$' + _.get(price, 'amount.float', 'N/A') : 'N/A'}<br />
            <strong>Duration:</strong><br />
            {_.get(price, 'duration', 'N/A')}<br />
            <strong>Automatic Renewal:</strong><br />
            {_.get(record, 'auto_renew') ? 'On' : 'Off'}
          </Col>
        </Row>
      );
    } //end expandRow()

    return (
      <div>
        <IconTitle icon="fa-users" title="Members" />
        <ContentPage>
          <Table
            rowKey={record => record._id}
            loading={loading}
            columns={columns}
            dataSource={memberList}
            expandedRowRender={expandRow}
            pagination={{ pageSize: 10, pageSizeOptions: ['10', '25', '50'] }}
            />
        </ContentPage>
      </div>
    )
  }
}

const MembersApollo = compose(
  graphql(membersQuery, {
    options: props => props.club ? ({
      variables: {
        clubId: props.club._id,
        first: 1000
      }
    }) : null,
    skip: props => !props || !props.club || !props.club._id
  }),
  graphql(approveMemberGQL, {
    name: 'approveMember'
  }),
  graphql(deleteMemberGQL, {
    name: 'deleteMember',
    options: {
      refetchQueries: ['members']
    }
  }),
  graphql(changeMemberGQL, {
    name: 'changeMember'
  })
)(Members);

export default MembersApollo;
