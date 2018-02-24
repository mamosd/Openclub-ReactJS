import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import _ from 'lodash';
import { openSidebar, closeSidebar, toggleSidebar } from 'modules/ui/actions'
import Icon from 'antd/lib/icon'
import Badge from 'antd/lib/badge'
import Menu, { Item, ItemGroup } from 'antd/lib/menu'
import { keysFromFragments } from 'utils/route'
import userPhoto from 'utils/user_photo'
import './Sidebar.scss'

class Sidebar extends Component {
  static propTypes = {
    user: PropTypes.object,
    location: PropTypes.object,
    open: PropTypes.bool,
    openSidebar: PropTypes.func,
    closeSidebar: PropTypes.func,
    toggleSidebar: PropTypes.func,
    notifications: PropTypes.object
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(e) {
    const { router } = this.context;

    this.props.closeSidebar();

    router.transitionTo('/' + e.key);
  }
  render() {
    const { user, location, notifications } = this.props;

    if (user) {
      const myClubs = user.memberships || [];

      const subscriptions = _.filter(myClubs, c => !!c.subscription || (c.roles && c.roles.length > 0))
      const followings = _.filter(myClubs, c => !c.subscription && c.following && !(c.roles && c.roles.length > 0))

      const regexLocation = location.pathname ? location.pathname.match(/^\/([\d\w-_]+)\/?.*?/) : null;
      const match = regexLocation ? regexLocation[1] : '';
      const keys = [
        'home', 'discover', 'feed', 'profile', 'notifications', 'events', 'clubs',
        ...myClubs.map(c => c.club.slug)
      ];
      const selectedKeys = [keys.indexOf(match) > -1 ? match : ''];

      if (!user.images) { user.images = {} }
      return (
        <aside className="oc-sidebar">
          <div className="oc-sidebar-profile">
            <a href=""><img src={userPhoto(user.images, 'square')} alt="Profile" className="oc-sidebar-profile--img thumb64" /></a>
            <div className="mt">{user.name}</div>
          </div>
          <Menu
            theme="dark"
            className="oc-sidebar-menu"
            selectedKeys={selectedKeys}
            open={this.props.open}
            mode="inline"
            onClick={this.handleClick}
            defaultOpenKeys={['sub1', 'sub2', 'sub3']}
          >
            <ItemGroup key="sub1" title={<span>OpenClub</span>}>
              <Item key="feed"><Icon type="layout" /> Feed</Item>
              {process.env.NODE_ENV === 'development' && <Item key="discover"><Icon type="global" /> Discover</Item>}
            </ItemGroup>
            <ItemGroup key="sub2" title={<span>Menu</span>}>
              <Item key="profile"><Icon type="idcard" className="opt-profile" /> Profile <Badge count={_.get(user, 'invitations', []).length} /></Item>
              <Item key="notifications"><Icon type="bell" className="opt-notifications" /> Notifications <Badge count={notifications.unseen || 0} /></Item>
              <Item key="events"><Icon type="calendar" className="opt-events" /> Events</Item>
              <Item key="clubs"><Icon type="team" className="opt-clubs" /> Clubs</Item>
            </ItemGroup>
            {subscriptions.length > 0 && <ItemGroup key="sub3" title={<span>My Clubs</span>}>
              {subscriptions.map(c =>
                <Item
                  key={`${c.club.slug}`}
                >
                  <img alt={c.club.name} className="oc-sidebar-clubimage" src={c.club.images ? c.club.images.square : '/empty-club.png'} /> {c.club.name}
                </Item>
              )}
            </ItemGroup>}
            {followings.length > 0 && <ItemGroup key="sub4" title={<span>Following</span>}>
              {followings.map(c =>
                <Item
                  key={`${c.club.slug}`}
                >
                  <img alt={c.club.name} className="oc-sidebar-clubimage" src={c.club.images ? c.club.images.square : '/empty-club.png'} /> {c.club.name}
                </Item>
              )}
            </ItemGroup>}
          </Menu>
        </aside>
      )
    }
    return <div />
  }
}

export default connect(state => ({
  open: state.ui.sidebar,
  notifications: state.notifications
}), {
  openSidebar,
  closeSidebar,
  toggleSidebar
})(Sidebar)
