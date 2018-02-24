import React from 'react'
import { connect } from 'react-redux'
import { seenNotifications } from 'modules/notifications/actions'
import { login } from 'modules/auth/actions'
import { toggleSidebar } from 'modules/ui/actions'
import { Layout, Menu, Dropdown, Icon, Button, Badge } from 'antd'
import { Link } from 'teardrop'
import Logo from 'components/logo/Logo'
import './Header.scss'
import { NotificationTable } from 'components/notifications'
import userPhoto from 'utils/user_photo'

const AntHeader = Layout.Header

const userMenu = (
  <div className="notification-table">
    <h4 className="text-center mb-sm mt-sm">Notifications</h4>
    <hr />
    <NotificationTable max={5} />
    <Menu>
      <Menu.Item key="4" className="text-center">
        <Link to="/notifications" className="btn bg-primary"><i className="fa fa-fw fa-bell-slash-o" /> All Notifications</Link>
      </Menu.Item>
      <Menu.Item key="0" className="text-center">
        <Link to="/profile" className="btn bg-gray-dark"><i className="fa fa-fw fa-id-card-o" /> Update Profile</Link>
      </Menu.Item>
      <Menu.Item key="1" className="text-center">
        <div className="btn-group">
          <Link to="/clubs/create" className="btn bg-success"><i className="fa fa-fw fa-users" /> Create a Club</Link>
          <Link to="/events/create" className="btn bg-danger"><i className="fa fa-fw fa-calendar-plus-o" /> Create an Event</Link>
        </div>
      </Menu.Item>
      <Menu.Item key="2" className="text-center">
        <Link to="/help" className="btn bg-info"><i className="fa fa-fw fa-life-ring" /> Helpdesk</Link>
      </Menu.Item>
      <Menu.Item key="3" className="text-center">
        <Link to="/logout" className="btn bg-danger"><i className="fa fa-fw fa-sign-out" /> Logout</Link>
      </Menu.Item>
    </Menu>
    <div className="company-details text-center mb">
      Copyright © OpenClub Pty Ltd.
      <br />
      <a href="https://www.openclub.co/legal/terms" target="_blank" rel="noopener noreferrer">
        Terms of Service
      </a> | <a href="https://www.openclub.co/legal/privacy" target="_blank" rel="noopener noreferrer">
        Privacy Policy
      </a>
    </div>
  </div>
)

const Header = ({ login: doLogin, user, showSearch, notifications, seen, sidebarOpen, toggleSb }, { router }) => (
  <div className="oc-header">
    { !user && <div className="oc-header-context">
      <div className="oc-header-usermenu">
        <Link to="/clubs">Clubs</Link> | <Link to="/events">Events</Link>
      </div>
    </div>}
    <div className="oc-header-context hidden-md hidden-lg">
      { user && <div className="oc-header-usermenu">
        <Button shape="circle" type="primary" icon={sidebarOpen ? 'menu-fold' : 'menu-unfold'} onClick={toggleSb} />
      </div> }
    </div>
    <Link to="/" className="oc-header-logo">
      <Logo color="#008FCC" />
    </Link>
    { !user && <div className="oc-header-context right">
      <div className="oc-header-usermenu">
        <a href="#" onClick={e => { e.preventDefault(); doLogin(); }}>Login / Sign Up</a>
      </div>
    </div>}
    { user &&
    <div className="oc-header-context right">
      <div className="oc-header-usermenu">
        <Dropdown overlay={userMenu} trigger={['click']} onClick={() => seen()}>
          <Badge count={notifications.unseen || 0} className="notifications-toggle">
            <img src={userPhoto(user.images, 'thumb', user.fbid)} alt="Profile" className="oc-header-userimage" />
          </Badge>
        </Dropdown>
      </div>
    </div>
    }
  </div>
)

/*
<ul className="pull-right">
  <li>
    <a href="#" className="ripple" onClick={showSearch}>
      <i className="fa bell-o" />
    </a>
  </li>
  <li>
    <a href="#" className="ripple" onClick={showSearch}>
      <i className="fa fa-search" />
    </a>
  </li>
  { user && <HeaderDropdown user={user}/> }

</ul>
*/

export default connect(state => ({
  notifications: state.notifications,
  sidebarOpen: state.ui.sidebar
}), {
  seen: seenNotifications,
  toggleSb: toggleSidebar,
  login
})(Header)
