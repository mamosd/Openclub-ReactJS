import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import Card from 'antd/lib/card';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Checkbox, { Group as CheckGroup } from 'antd/lib/checkbox';
import gql from 'graphql-tag';
import _ from 'lodash';

// Components
import Loading from 'components/Loading/Loading';
import userPhoto from 'utils/user_photo';
import parseError from 'utils/error';

class Roles extends Component {
  static propTypes = {
    club: PropTypes.object,
    data: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.state = {
      newRoles: [],
    }

    this.roleOptions = [
      { label: 'Full Access', value: 'admin' },
      { label: 'Finances', value: 'accountant' },
      { label: 'Membership', value: 'curator' },
      { label: 'Feed', value: 'moderator' }
    ]
  }
  async inviteUser() {
    const { invite, club } = this.props;

    try {
      await invite({
        variables: {
          clubId: club._id,
          invitations: [
            {
              recipient: this.state.newRecipient,
              roles: this.state.newRoles
            }
          ]
        }
      })
      this.setState({ newRoles: [], newRecipient: '' });
      Modal.success({
        title: 'Invite Sent!',
        content: 'The user has been invited.'
      });
    } catch (err) {
      Modal.error({
        title: 'Uh-oh!',
        content: parseError(err)
      });
    }
  }
  async updateRoles(user, roles) {
    const { updateRoles } = this.props;

    try {
      await updateRoles({
        variables: {
          memberId: user._id,
          roles
        }
      })
      message.success('Role Updated', 5);
    } catch (err) {
      Modal.error({
        title: 'Uh-oh!',
        content: parseError(err)
      });
    }
  }
  render() {
    const { club, data } = this.props;
    if (data.loading) return <Loading tip="Retrieving roles..." />;

    const users = _.get(data, 'club.members.edges', []);

    const checkedRoles = roles => {
      if ((roles || []).indexOf('admin') > -1) {
        return ['admin', 'curator', 'moderator', 'accountant'];
      }
      return roles;
    }

    return (
      <div>
        <h3>Roles</h3>
        <hr className="mt mb" />
        <p className="mb-lg">Invite other people to help you manage {club.name}.</p>
        <Card bodyStyle={{ padding: 0 }} className="mb-lg">
          <div className="p">
            <Row gutter={8} className="mb-sm">
              <Col span={18}>
                <Input
                  type="email"
                  value={this.state.newRecipient}
                  placeholder="Enter an email to send the invite to..."
                  onChange={e => this.setState({ newRecipient: e.target.value })}
                  />
              </Col>
              <Col span={4}>
                <Button type="primary" onClick={this.inviteUser.bind(this)}>Invite</Button>
              </Col>
            </Row>
            <CheckGroup options={this.roleOptions} value={checkedRoles(this.state.newRoles)} onChange={newRoles => this.setState({ newRoles })} />
          </div>
        </Card>
        <h4>Existing Roles</h4>
        <p className="mb-lg">Update the roles of existing users within your club.</p>
        <hr className="mt mb" />
        {users.map(user => (
          <Card bodyStyle={{ padding: 0 }} key={user._id} className="mb-sm">
            <div className="table m0">
              <div className="cell oh" style={{ width: 90, height: 90, overflow: 'hidden' }}>
                <img src={userPhoto(_.get(user, 'profile.images'), 'square')} style={{ maxWidth: '100%' }} alt={_.get(user, 'profile.name', 'No name')} role="presentation" />
              </div>
              <div className="cell p" style={{ verticalAlign: 'top' }}>
                <h4>{_.get(user, 'profile.name', 'No name')}</h4>
                <h5>Roles assigned to this user:</h5>
                <div>
                  <CheckGroup options={this.roleOptions} value={checkedRoles(user.roles)} onChange={this.updateRoles.bind(this, user)} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
}

const updateMutation = gql`
  mutation updateRoles($memberId: MongoID!, $roles: [String]) {
    updateRoles(memberId: $memberId, roles: $roles) {
      _id
      roles
    }
  }
`

const inviteMutation = gql`
  mutation clubInvite($clubId: MongoID!, $invitations: [invitationInput]!){
    clubInvite(clubId: $clubId, invitations: $invitations) {
      _id
    }
  }
`

const adminsQuery = gql`
  query club($slug: String!, $first: Int!, $cursor: ID, $type: String) {
    club(slug: $slug) {
      _id
      members(first: $first, cursor: $cursor, type: $type){
        edges{
          _id
          roles
          profile{
            name
            images{
              square
            }
            fbid
            email
            fbid
            phone
          }
        }
      }
    }
  }
`


const RolesApollo = compose(
  graphql(adminsQuery, {
    options: props => ({
      variables: {
        first: 100,
        slug: props.club.slug,
        type: 'escalated'
      }
    })
  }),
  graphql(inviteMutation, {
    name: 'invite'
  }),
  graphql(updateMutation, {
    name: 'updateRoles'
  })
)(Roles);

export default RolesApollo;
