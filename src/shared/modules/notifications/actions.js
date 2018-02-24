import apolloClient from 'modules/apollo'
import gql from 'graphql-tag'
import stream, { feedGroups } from 'utils/GetStream'

// Auth0 lock actions
export const LOAD_NOTIFICATIONS = 'LOAD_NOTIFICATIONS';
export const SEEN_NOTIFICATIONS = 'SEEN_NOTIFICATIONS';
export const NEW_NOTIFICATIONS = 'NEW_NOTIFICATIONS';
export const STORE_SUBSCRIPTION = 'STORE_SUBSCRIPTION';
export const CANCEL_SUBSCRIPTION = 'CANCEL_SUBSCRIPTION';

const reduceLoadNotifications = ({ results, unread, unseen}) => ({
  results,
  unread,
  unseen,
  type: LOAD_NOTIFICATIONS
})

const reduceSeenNotifications = () => ({
  unseen: 0,
  type: SEEN_NOTIFICATIONS
})

const reduceNewNotifications = results => ({
  results,
  type: NEW_NOTIFICATIONS
})

const reduceStoreSubscription = subscription => ({
  subscription,
  type: STORE_SUBSCRIPTION
})

const reduceCancelSubscription = () => ({
  type: CANCEL_SUBSCRIPTION
})

export function storeSubscription(subscription) {
  return dispatch => {
    dispatch(reduceStoreSubscription(subscription));
  }
}

export function cancelSubscription() {
  return dispatch => {
    dispatch(reduceCancelSubscription())
  }
}

export function loadNotifications(thread) {
  return dispatch => {
      dispatch(reduceLoadNotifications(thread));
  }
}

export function newNotification(n) {
  return dispatch => {
    dispatch(reduceNewNotifications(n))
  }
}

export function initNotifications(userId, userToken) {
  return async dispatch => {
    if (!userId || !userToken) return;
    const feed = stream.feed(feedGroups.NOTIFICATIONS, userId, userToken);
    const notifications = await feed.get({ limit: 25 });
    dispatch(reduceLoadNotifications(notifications));
    window.subscription = feed.subscribe(n => dispatch(reduceNewNotifications(n)));
    dispatch(reduceStoreSubscription(window.subscription));
  }
}

const seenNotificationsMutation = gql`
mutation markNotifications{
  markNotifications
}
`

export function seenNotifications() {
  return async dispatch => {
    // Mark Notifications as cleared, we don't care if the server responds of not.
    try {
      await apolloClient.mutate({
        mutation: seenNotificationsMutation
      });
      dispatch(reduceSeenNotifications())
    } catch (err) {
      console.error('Silent Notifications Error', err); //eslint-disable-line
    }
  }
}
