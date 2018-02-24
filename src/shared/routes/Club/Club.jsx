import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { login } from 'modules/auth/actions'
import Tabs, { TabPane } from 'antd/lib/tabs'
import Helmet from 'react-helmet'
import gql from 'graphql-tag'
import { Menu, Icon, Dropdown } from 'antd'
import Button, { Group as ButtonGroup } from 'antd/lib/button'
import { Match, MatchGroup, Miss, Redirect } from 'teardrop'
import ProfileHeader from 'components/profile/ProfileHeader'
import { ContentArea } from 'components/layout'
import Error404 from 'components/Error404/Error404'
import Error from 'components/Error/Error'
import { keysFromFragments } from 'utils/route'
import Loading from 'components/Loading/Loading'
import clubPermissions from 'utils/club_permissions'
import ClubActions from 'modules/forms/ClubActions'
// Async routes
import AsyncAbout from './About' // FIXME: Shitty hack to bypass System.import()
import AsyncCommunity from './Community'
import AsyncEvents from './Events'
import AsyncFeed from './Feed/Feed'
import AsyncJoin from './Join/Join'
import AsyncSettings from './Settings'
import AsyncMembership from './Membership'
import AsyncTransactions from './Transactions'
import AsyncMembers from './Members/Members'

import './Club.scss'

class Club extends Component {
  static propTypes = {
    data: PropTypes.object,
    params: PropTypes.object,
    viewer: PropTypes.object,
    pathname: PropTypes.string,
    location: PropTypes.object,
    login: PropTypes.func
  }
  static contextTypes = {
    router: PropTypes.object
  }
  render() {
    const { data, location, params, viewer, pathname } = this.props
    if (!data) return <Error404 />;

    const { router } = this.context
    const { club, loading, error } = data
    const collapseHeader = location.pathname && params && params.club_id ? !(new RegExp(`^\\/${params.club_id}(\\/?(feed|about)\\/?)?$`)).test(location.pathname) : false;
    if (process.env.IS_CLIENT && loading) return <Loading />
    if (error) return <Error error={error} />
    if (!club) return <Error404 />

    const perm = clubPermissions(club, viewer);
    const handleClick = e => {
      router.transitionTo(`/${params.club_id}/${e}`, true);
    }

    const onJoin = () => {
      if (!viewer) { this.props.login(); return; }
      router.transitionTo(`/${params.club_id}/join`)
    }

    const selectedKey = keysFromFragments(location.pathname, pathname, [
      'feed', 'events', 'about', 'community', 'transactions', 'mymembership', 'settings'
    ])[0]

    const followMenu = <ClubActions club={club} perm={perm} viewer={viewer} />;

    return (
      <section className="oc-object-page-container">
        <Helmet title={`${club.name}`} />
        <ProfileHeader
          name={club.name}
          location={club.location}
          images={club.images}
          collapsed={collapseHeader}
          onJoin={onJoin}
        />
        <Tabs
          activeKey={selectedKey}
          tabBarExtraContent={perm.canViewFeed ?
            <ButtonGroup>
              {perm.userCanJoin && <Button type="primary" icon="user-add" size="large" className="btn-resp" onClick={onJoin}>Join This Club</Button>}
              <Dropdown overlay={followMenu}><Button type="default" size="large" className="btn-resp" icon="user">{perm.userIsFollower ? 'Following' : 'Follow'} <Icon type="down" /></Button></Dropdown>
            </ButtonGroup> : null
          }
          onTabClick={handleClick}
          >
          {perm.canViewFeed && <TabPane tab="Feed" key="feed" />}
          <TabPane tab="About" key="about" />
          {perm.canViewDirectory && <TabPane tab="Community" key="community" />}
          {(perm.userIsMember || perm.isPendingMember) && <TabPane tab="My Membership" key="mymembership" />}
          {perm.userCanAccessMembers && <TabPane tab="Members" key="members" />}
          {perm.userCanAccessFinances && <TabPane tab="Transactions" key="transactions" />}
          {perm.userCanAccessSettings && <TabPane tab="Settings" key="settings" />}
        </Tabs>
        <ContentArea>
          <MatchGroup>
            <Match
              exactly
              pattern={`/${params.club_id}`}
              render={() => {
                if (perm.canViewFeed) {
                  return <Redirect to={`/${params.club_id}/feed`} />
                }
                return <Redirect to={`/${params.club_id}/about`} />
              }}
              />
            <Match pattern={`/${params.club_id}/about`}>
              {routerProps => <AsyncAbout {...routerProps} club={club} perm={perm} />}
            </Match>
            <Match
              pattern={`/${params.club_id}/feed`}
              render={routerProps => <AsyncFeed {...routerProps} club={club} perm={perm} viewer={viewer} slug={params.club_id} />}
              />
            <Match
              pattern={`/${params.club_id}/community`}
              render={routerProps => perm.canViewDirectory ? <AsyncCommunity {...routerProps} club={club} perm={perm} membership={perm.membership} /> : <Error404 />}
              />
            <Match
              pattern={`/${params.club_id}/members`}
              render={routerProps => perm.userCanAccessMembers ? <AsyncMembers {...routerProps} club={club} perm={perm} /> : <Error404 />}
              />
            <Match
              pattern={`/${params.club_id}/mymembership`}
              render={routerProps => perm.userIsMember || perm.isPendingMember ? <AsyncMembership {...routerProps} club={club} perm={perm} membership={perm.membership} /> : <Error404 />}
              />
            <Match
              pattern={`/${params.club_id}/transactions`}
              render={routerProps => perm.userCanAccessFinances ? <AsyncTransactions {...routerProps} clubId={club._id} /> : <Error404 />}
              />
            <Match
              pattern={`/${params.club_id}/settings`}
              render={routerProps => perm.userCanAccessSettings ? <AsyncSettings {...routerProps} club={club} perm={perm} /> : <Error404 />}
              />
            <Match
              pattern={`/${params.club_id}/join`}
              render={routerProps => perm.clubHasPublicPlans ? <AsyncJoin {...routerProps} club={club} perm={perm} viewer={viewer} /> : <Error404 />}
              />
          <Miss component={Error404} />
          </MatchGroup>
        </ContentArea>
      </section>
    )
  }
}

const clubQuery = gql`
  query club($slug: String!) {
    club(slug: $slug) {
      _id
      name
      images{
        thumb
        background
        square
      }
      slug
      settings{
        directory_privacy
        feed_permissions
        feed_public_permissions
      }
      membership_plans{
        _id
        name
        description
        public
        prices{
          _id
          duration
          price{
            amount
            amount_float
          },
          setup_price{
            amount
            amount_float
          }
        }
      }
      details{
        about
        location
        minimum_age
        founded
        email
        phone
        website
        facebook
        instagram
        linkedin
        twitter
      }
      stripe_account{
        data
      }
    }
  }
`

const ClubWithApollo = graphql(clubQuery, {
  options: props => {
    if (!props.params) return false;
    return {
      variables: {
        slug: props.params.club_id,
        first: 25
      }
    }
  },
  skip: props => !props.params || !props.params.club_id || !/^[\w\d]+(?:-[\w\d]+)*$/.test(props.params.club_id)
})(Club)

const ClubWithRedux = connect(state => ({}), {
  login
})(ClubWithApollo)

export default ClubWithRedux;

export {
  Club
}
