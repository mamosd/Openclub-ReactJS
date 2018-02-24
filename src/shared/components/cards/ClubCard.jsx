// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'teardrop';
import _ from 'lodash';
import { connect } from 'react-redux';
import clubPermissions from 'utils/club_permissions'
import ClubActions from 'modules/forms/ClubActions'
import Button, { Group as ButtonGroup } from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Icon from 'antd/lib/icon';
import { login } from 'modules/auth/actions'

// Components
import Card from 'antd/lib/card';

// Visuals
import './ClubCard.scss';

class ClubCard extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  static propTypes = {
    club: PropTypes.object,
    viewer: PropTypes.object,
    login: PropTypes.func
  }
  aboutText(club) {
    if (club.details && club.details.about) {
      return _.truncate(club.details.about || '', {
      length: 250,
      separator: ' '
    });
    }
    return '';
  }
  locationText(club) {
    if (club.details && club.details.location && club.details.location.formatted_address) {
      return club.details.location.formatted_address;
    }
    return '';
  }
  render() {
    const { club, viewer } = this.props;
    const { router } = this.context;
    const perm = clubPermissions(club, viewer);
    const images = club.images || {};

    const onJoin = () => {
      if (!viewer) { this.props.login(); return; }
      router.transitionTo(`/${club.slug}/join`)
    }

    const followMenu = <ClubActions club={club} perm={perm} viewer={viewer} />;

    return (
      <Card className="club-card" bodyStyle={{ padding: 0 }} style={{ margin: 10, height: 'calc(100% - 10px)' }}>
        <div className="club-card-cover" style={{ backgroundImage: `url('${images.background || '/coverphoto.jpg'}')`}}>
          <div className="club-card-header">
            <div className="club-card-profile">
              <Link to={`/${club.slug}`}><img src={images.square || '/empty-club.png'} alt={club.name} /></Link>
            </div>
            <div className="club-card-actions">
              {perm.canViewFeed ? <ButtonGroup>
                {perm.userCanJoin && <Button type="primary" icon="user-add" size="large" className="btn-resp" onClick={onJoin}>Join This Club</Button>}
                <Dropdown key={`${club.slug}-dd`} overlay={followMenu}><Button type="default" size="large" className="btn-resp" icon="user">{perm.userIsFollower ? 'Following' : 'Follow'} <Icon type="down" /></Button></Dropdown>
              </ButtonGroup> : null}
            </div>
          </div>
        </div>
        <div className="club-card-content">
          <Link to={`/${club.slug}`}><h3>{club.name || 'No name'}</h3></Link>
          <p className="description">{this.aboutText(club)}<br />
          {club.details && club.details.location && <small><Icon type="environment" /> {this.locationText(club)}</small>}
          </p>
        </div>
      </Card>
    );
  }
}
export default connect(null, {
  login
})(ClubCard)
