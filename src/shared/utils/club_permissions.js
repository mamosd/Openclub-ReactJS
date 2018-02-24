import _ from 'lodash'

const clubPermissions = (club, viewer) => {
  const membership = _.find(_.get(viewer, 'memberships', []), { club_id: _.get(club, '_id', 'noclub') }) || {};
  const subscription = _.get(membership, 'subscription', false);

  const settings = _.get(club, 'settings') || {
    directory_privacy: true,
    feed_permissions: ['view', 'post'],
    feed_public_permissions: ['view']
  };
  const isMember = _.get(subscription, 'active', false);
  const feedPermissions = _.get(membership, 'feed_permissions') || isMember ? settings.feed_permissions : settings.feed_public_permissions;

  let p = {
    membership,
    subscription,
    settings,
    isMember,
    feedPermissions
  };

  p.isPendingMember = p.subscription && !!p.subscription.pending_approval

  // Club has plans
  p.clubHasPlans = !_.isEmpty(_.filter(club.membership_plans, { public: true }))

  // Club has publicly available plans
  p.clubHasPublicPlans = !_.isEmpty(_.filter(club.membership_plans, { public: true }))

  // User has admin permission
  p.userIsAdmin = _.includes(membership.roles, 'admin');

  // User is member of club
  p.userIsMember = isMember;

  // User is follower of club
  p.userIsFollower = _.get(membership, 'following', false);

  // User is follower of club
  p.userIsSubscribed = _.get(membership, 'notifications', false);

  // User can access finances
  p.userCanAccessFinances = p.userIsAdmin || _.includes(membership.roles, 'accountant');

  // User can access members
  p.userCanAccessMembers = p.userIsAdmin || _.includes(membership.roles, 'curator')

  // User can moderate feed
  p.userCanModerateFeed = p.userIsAdmin || _.includes(membership.roles, 'moderator')

  // User can access settings
  p.userCanAccessSettings = p.userIsAdmin || p.userCanAccessFinances || p.userCanModerateFeed || p.userCanAccessMembers;

  // Feed Permissions
  p.canViewFeed = _.includes(feedPermissions, 'view') || p.userIsAdmin || p.userCanModerateFeed;
  p.canPostFeed = _.includes(feedPermissions, 'post') || p.userIsAdmin || p.userCanModerateFeed;

  // Directory permissions
  p.canViewDirectory = isMember || settings.directory_privacy === 'public' || p.userCanAccessMembers

  // User can join club
  p.userCanJoin = p.clubHasPublicPlans && !p.userIsMember

  // User can follow club
  p.userCanFollow = !p.userIsFollower && p.canViewFeed

  // User can post to club
  p.userCanPost = p.canPostFeed;

  // Function to return true/false if user belongs to a post
  p.userOwnsPost = _id => _id === _.get(viewer, '_id', 0);

  // Function to return true/false if user can delete post
  p.userCanDeletePost = _id => p.userOwnsPost(_id) || p.userIsAdmin || p.userCanModerateFeed;

  // User can update club details
  p.userCanUpdateDetails = p.userIsAdmin;

  // User can edit plans
  p.userCanEditPlans = p.userIsAdmin || p.userCanAccessMembers;

  // User can setup club
  p.userCanSetupClub = p.userIsAdmin;

  // User can view members
  p.userCanViewMembers = p.canViewDirectory;

  // User can view detailed members
  p.userCanViewDetailedMembers = p.userIsAdmin || p.userCanAccessMembers
  return p;
}

export default clubPermissions;
