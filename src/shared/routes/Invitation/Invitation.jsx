import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'teardrop';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { compose, graphql } from 'react-apollo';
import { decline as declineInviteGQL, accept as acceptInviteGQL } from 'mutations/invitation';
import invitationQuery from 'queries/invitation';
import { MiddleArea } from 'components/layout';
import parseError from 'utils/error';
import Loading from 'components/Loading/Loading';
import Error from 'components/Error/Error'
import _ from 'lodash';

class Invitation extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  static propTypes = {
    data: PropTypes.object,
    viewer: PropTypes.object
  }
  async acceptInvitation() {
    const { acceptInvite, data: { invitation }, viewer, location } = this.props;

    if (!viewer) {
      localStorage.setItem('logonPath', location.pathname);
      message.info('Please login or create an account to accept this invitation.', 10);
      return this.context.router.transitionTo('/login');
    }

    try {
      await acceptInvite({
        variables: {
          invitationId: invitation._id
        }
      });
      message.success('Invitation Accepted');
      this.redirect()
    } catch (err) {
      Modal.error({
        title: 'Uh-oh!',
        content: parseError(err)
      });
    }
  }
  declineConfirmation() {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'You will not be able to restore this invitation once it is deleted.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: this.decline.bind(this)
    });
  }
  goToAndDelete() {
    const { declineInvite, data: { invitation } } = this.props;
    try {
      declineInvite({
        variables: {
          invitationId: invitation._id
        }
      });
      this.redirect();
    } catch (err) {
      message.error(parseError(err));
    }
  }
  async decline() {
    const { declineInvite, data: { invitation } } = this.props;

    try {
      await declineInvite({
        variables: {
          invitationId: invitation._id
        }
      });
      message.success('Invitation Deleted');
      this.context.router.transitionTo('profile/invitations');
    } catch (err) {
      Modal.error({
        title: 'Uh-oh!',
        content: parseError(err)
      });
    }
  }
  redirect() {
    const { data: { invitation } } = this.props;

    const { type: ownerType, meta } = invitation.owner_entity || {};
    if (ownerType === 'clubs') return this.context.router.transitionTo('/' + _.get(meta, 'slug', ''));
    if (ownerType === 'events') return this.context.router.transitionTo('/event/' + _.get(meta, 'slug', ''));
  }
  render() {
    const { data, viewer } = this.props;

    const { invitation } = data;
    if (data.error) {
      return <Error error={data.error} />;
    }
    if (data.loading) return <Loading />;

    if (!invitation && !data.loading) return (
      <div>
        <MiddleArea>
          <div className="text-center">
            <h1 style={{ fontSize: 80 }}>🤔</h1>
            <h3>Invitation Not Found</h3>
            <hr className="mt mb" />
            <p className="text-md mb">It seems that this invitation never existed or does not exist.</p>
            <Link to="/"><i className="fa fa-fw fa-caret-left" /> Return Home</Link>
          </div>
        </MiddleArea>
      </div>
    );

    let type = 'view';

    if (invitation.roles) {
      type = 'administer'
    } else if (invitation.subscription) {
      type = 'access'
    } else if (invitation.membership_plan) {
      type = 'join'
    }

    const objectLogo = _.get(invitation, 'owner_entity.meta.images.square.location');
    const objectName = _.get(data, 'invitation.owner_entity.meta.name');
    const senderName = _.get(invitation, 'creator.name');

    let joinUrl;

    const { type: ownerType, meta } = invitation.owner_entity || {};
    if (type === 'clubs') joinUrl = `/${meta.slug}/join/${invitation.invitationUrl}`;

    return (
      <div>
        <MiddleArea>
          <div className="text-center">
            {objectLogo ? <img src={objectLogo} alt={objectName} role="presentation" className="thumb128 rounded mb" /> : <i className="fa fa-fw fa-envelope-open-o fa-5x mb" />}
            <h3>{objectName}</h3>
            <hr className="mb mt" />
            <p className="text-md">{senderName} has invited you to {type} {objectName}.</p>
          </div>
          <hr className="mb mt" />
          <div className="text-center">
            {(type === 'view') && <button type="primary" size="large" className="btn btn-lg bg-success mb" onClick={this.goToAndDelete.bind(this)}>Visit {objectName}</button>}
            {(type === 'join') && <button type="primary" size="large" className="btn btn-lg bg-success mb" onClick={() => this.context.router.transitionTo(joinUrl)}>Join {objectName}</button>}
            {(type === 'administer' || type === 'access') && <button type="primary" size="large" className="btn btn-lg bg-success mb" onClick={this.acceptInvitation.bind(this)}>Accept Invitation</button>}
            <p><a className="text-danger" onClick={this.declineConfirmation.bind(this)}>Decline Invitation</a></p>
          </div>
        </MiddleArea>
        {viewer && <div className="text-center">
          <Link to="/profile/invitations"><i className="fa fa-fw fa-chevron-left" /> Back to Invitations</Link>
        </div>}
      </div>
    )
  }
}

const InvitationApollo = compose(
  graphql(invitationQuery, {
    options: props => ({
      variables: {
        invitationUrl: props.params.invitationUrl
      }
    })
  }),
  graphql(acceptInviteGQL, {
    name: 'acceptInvite',
    options: {
      refetchQueries: ['user']
    }
  }),
  graphql(declineInviteGQL, {
    name: 'declineInvite',
    options: {
      refetchQueries: ['user']
    }
  })
)(Invitation);

export default InvitationApollo;
