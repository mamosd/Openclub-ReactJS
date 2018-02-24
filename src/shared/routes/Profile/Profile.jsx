import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Menu from 'antd/lib/menu';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Badge from 'antd/lib/badge';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import _ from 'lodash';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ContentArea, ContentPage, IconTitle } from 'components/layout'
import UserProfile from 'modules/forms/UserProfile'
import ManageCreditCards from 'modules/forms/ManageCreditCards'
import { MatchGroup, Match, Redirect } from 'teardrop';
import userPhoto from 'utils/user_photo';
import parseError from 'utils/error';

class Profile extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    location: PropTypes.object
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)

    this.anchors = {};
  }
  async deleteInvite(invitationId) {
    const { deleteInvite } = this.props;

    try {
      await deleteInvite({
        variables: {
          invitationId
        }
      });
      message.success('Deleted', 5);
    } catch (err) {
      Modal.error({
        title: 'Uh-oh!',
        content: parseError(err)
      })
    }
  }
  render() {
    const { viewer, location } = this.props;
    const match = location.pathname ? location.pathname.match(/^.*\/([\d\w-_]+)\/?/)[1] : 'profile';

    const menuClick = (e) => {
      if (e.key === 'profile') return this.context.router.transitionTo('/profile');
      return this.context.router.transitionTo(`/profile/${e.key}`);
    }

    if (!viewer) return <div>You must be logged in to view this page.</div>
    return (
        <ContentArea>
          <IconTitle title="Profile" icon="fa-id-card-o" />
          <ContentPage>
            <div className="mb-xl">
              <Menu
                selectedKeys={[match]}
                onClick={menuClick}
                mode="horizontal"
              >
                <Menu.Item key="profile"><i className="fa fa-fw fa-list-ul" /> Profile Details</Menu.Item>
                <Menu.Item key="payment"><i className="fa fa-fw fa-credit-card" /> Payment Details</Menu.Item>
                <Menu.Item key="invitations"><i className="fa fa-fw fa-envelope-open-o" /> Invitations <Badge count={_.get(viewer, 'invitations', []).length} /></Menu.Item>
                <Menu.Item key="help"><i className="fa fa-fw fa-question-circle" /> Help</Menu.Item>
              </Menu>
            </div>
            <MatchGroup>
              <Match
                pattern="/profile"
                render={() => {
                  // Some variables
                  return (
                    <Row gutter={16}>
                      <Col xs={24} md={8} lg={8} className="xs-hidden sm-hidden">
                        <div>
                          <h3>Profile Details</h3>
                          <hr className="mt-lg mb-lg" />
                          <h4 className="mb-sm">Portable</h4>
                          <p className="mb-sm">
                            Your OpenClub profile is portable between all of the clubs you join. When you update your information here, it will be reflected in all of the clubs connected to your account.
                          </p>
                          <h4 className="mb-sm">Privacy</h4>
                          <p className="mb-sm">
                            OpenClub will never share your private information, such as your date of birth or address, with club members or the public.
                            The only information that may be displayed is in the club directory, which you have full control over.
                          </p>
                          <h4 className="mb-sm">Date of Birth</h4>
                          <p className="mb-sm">
                            Your date of birth may be required to join some clubs with age restrictions. If you have not provided a date of birth, you will be unable to join age-restricted clubs.
                          </p>
                        </div>
                      </Col>
                      <Col xs={24} md={16} lg={8}>
                        <div>
                          <h4 className="mb-sm">Profile</h4>
                          <UserProfile viewer={viewer} />
                        </div>
                      </Col>
                    </Row>
                  )
                }}
              />
              <Match
                pattern="/profile/payment"
                render={() => {
                  // Payment Details Page
                  return (
                    <Row gutter={16}>
                      <Col xs={24} mg={8} lg={8}>
                        <h3>Payment Details</h3>
                        <hr className="mt-lg mb-lg" />
                        <h4 className="mb-sm">Overview</h4>
                        <p className="mb-sm">OpenClub can support up to 5 payment sources per person. The card details are stored on secure servers, and your card data can never be seen by anybody using or within OpenClub.</p>
                        <h4 className="mb-sm">Primary Card</h4>
                        <p className="mb-sm">If you have more than one card, you may set a primary card - the primary card will be the default selected card for any manual payments, and will be the default card when processing automatic renewals. If you do not wish to automatically renew a subscription, please turn off automatic renewals via your club's membership page.</p>
                      </Col>
                      <Col xs={24} mg={16} lg={8}>
                        <h4 className="mb-sm">Credit Cards</h4>
                        <ManageCreditCards viewer={viewer} />
                      </Col>
                    </Row>
                  )
              }}
              />
              <Match
                pattern="/profile/invitations"
                render={() => {
                  const invitations = _.get(viewer, 'invitations', []);
                  return (
                    <Row gutter={16}>
                      {(!invitations || invitations.length === 0) && (
                        <div className="text-center">
                          <i className="fa fa-fw fa-5x fa-envelope mb" />
                          <h4>You have no Invitations</h4>
                          <hr className="mb mt" />
                          <p>You don't have any invitations, yet. But, we'll notify you as soon you receive one.</p>
                        </div>
                      )}
                      {invitations.map(invitation => (
                        <Col xs={24} md={12}>
                          <Card key={invitation._id} bodyStyle={{ padding: 0 }} key={invitation._id} className="mb-sm">
                            <div className="table m0">
                              <div className="cell oh" style={{ width: 90 }}>
                                <img src={userPhoto(_.get(invitation, 'owner_entity.meta.images', {}))} style={{ maxWidth: '100%' }} alt={_.get(invitation, 'owner_entity.meta.name', 'No name')} role="presentation" />
                              </div>
                              <div className="cell p" style={{ verticalAlign: 'top' }}>
                                <h4>{_.get(invitation, 'owner_entity.meta.name', 'No name')}</h4>
                                {invitation.roles && (
                                  <p><strong>{_.get(invitation, 'creator.name', 'Somebody')}</strong> has invited you to manage {_.get(invitation, 'owner_entity.meta.name', 'No name')}.</p>
                                )}
                                {invitation.subscription && (
                                  <p><strong>{_.get(invitation, 'creator.name', 'Somebody')}</strong> has added your membership to {_.get(invitation, 'owner_entity.meta.name', 'No name')}.</p>
                                )}
                                {invitation.membership_plan_id && (
                                  <p><strong>{_.get(invitation, 'creator.name', 'Somebody')}</strong> has invited you to join {_.get(invitation, 'owner_entity.meta.name', 'No name')}.</p>
                                )}
                                {!invitation.membership_plan_id && !invitation.roles && !invitation.subscription && (
                                  <p><strong>{_.get(invitation, 'creator.name', 'Somebody')}</strong> has invited you to join a private plan on {_.get(invitation, 'owner_entity.meta.name', 'No name')}.</p>
                                )}
                                <Button size="small" style={{ position: 'absolute', top: 10, right: 10 }} type="primary" onClick={() => this.context.router.transitionTo(`/invite/${invitation.invitation_url}`)}><i className="fa fa-fw fa-external-link" /> Open</Button>
                              </div>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )
                }}
                />
              <Match pattern="/profile/help" render={() => <Redirect to="/help" />} />
            </MatchGroup>
          </ContentPage>
        </ContentArea>
    );
  }
}

const deleteInvite = gql`
  mutation deleteInvite($invitationId: MongoID!) {
    deleteInvite(invitationId: $invitationId) {
      _id
    }
  }
`

const ProfileApollo = graphql(deleteInvite, {
  name: 'deleteInvite',
  options: {
    updateQueries: {
      user: (prev, { mutationResult }) => {
        if (!mutationResult.data.deleteInvite) return prev;
        const clonedState = _.clone(prev);
        _.remove(prev.user.invitations, invite => invite._id === mutationResult.data.deleteInvite._id);
        return clonedState;
      }
    }
  }
})(Profile)

export default ProfileApollo;
