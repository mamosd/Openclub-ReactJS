import _ from 'lodash';

export default function (viewer, feed) {
  if (!feed) return [];
  let basePermissions = feed ? feed.public_permissions || [] : [];

  if (viewer && viewer.memberships) {
    let index = _.findIndex(viewer.memberships, { club_id: feed.owner.owner_id });
    let membership = viewer.memberships[index];

    if (membership) {
      basePermissions = [...basePermissions, ...(feed ? feed.permissions || [] : [])];
      if (membership.feed_permissions instanceof Array) {
        basePermissions = [...basePermissions, ...membership.feed_permissions];
      }
    }
  }

  // Look for ANTI-PERMISSIONS
  let antiPermissionR = /^!(.*)/;
  let antiPermissions = basePermissions.map(p => antiPermissionR.test(p) ? p.match(antiPermissionR)[1] : null);
  basePermissions = _.difference(basePermissions, antiPermissions);
  return basePermissions;
}
