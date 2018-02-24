import React from 'react';
import PropTypes from 'prop-types';
import { Announce, Approve, Comment, Deposit, Join, Like, Post, Remind, Renew, Warn } from './formats'

export const basePropTypes = {
  id: PropTypes.string,
  actor: PropTypes.string,
  object: PropTypes.string,
  origin: PropTypes.string,
  target: PropTypes.string,
  time: PropTypes.string,
  verb: PropTypes.string
}

const FormatNotification = ({ notification }) => {
  switch (notification.verb) {
    case 'announce': return <Announce {...notification} />;
    case 'approve': return <Approve {...notification} />;
    case 'comment': return <Comment {...notification} />;
    case 'deposit': return <Deposit {...notification} />;
    case 'join': return <Join {...notification} />;
    case 'like': return <Like {...notification} />;
    case 'post': return <Post {...notification} />;
    case 'remind': return <Remind {...notification} />;
    case 'renew': return <Renew {...notification} />;
    case 'warn': return <Warn {...notification} />;
    default: return <div />;
  }
}

FormatNotification.propTypes = {
  notification: PropTypes.object
}

export default FormatNotification;
