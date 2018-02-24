import _ from 'lodash'
import { LOAD_NOTIFICATIONS, SEEN_NOTIFICATIONS, NEW_NOTIFICATIONS, STORE_SUBSCRIPTION, CANCEL_SUBSCRIPTION } from './actions'

const initialState = { notifications: [], unseen: 0, unread: 0, subscription: null }

const ACTION_HANDLERS = {
  [LOAD_NOTIFICATIONS]: (state, { results, unseen, unread }) => ({
    notifications: results,
    unseen,
    unread
  }),
  [SEEN_NOTIFICATIONS]: state => ({
    ...state,
    results: state.results && state.results.length > 0 ? state.results.map(v => { v.unseen = false; return v; }) : [],
    unseen: 0,
  }),
  [NEW_NOTIFICATIONS]: (state, { results }) => {
    let currentNotifications = _.filter(state.notifications, n => !_.includes(results.deleted, n.id));
    let newNotifications = currentNotifications;
    results.new.forEach(notification => {
      const index = _.findIndex(newNotifications, n => n.group === notification.group && 'activities' in n && n.activities instanceof Array)
      if (index > -1) {
        newNotifications[index].activities.unshift(notification);
        newNotifications[index].activity_count = newNotifications[index].activities.length
        newNotifications[index].is_read = false;
        newNotifications[index].is_seen = false;
      } else {
        newNotifications.unshift(notification);
        newNotifications[0].activities = [notification];
      }
    })
    return {
      unseen: state.unseen + results.new.length,
      notifications: newNotifications
    }
  },
  [STORE_SUBSCRIPTION]: (state, { subscription }) => ({
    ...state,
    subscription
  }),
  [CANCEL_SUBSCRIPTION]: () => {
    return {
      ...initialState,
      subscription: window && window.subscription ? window.subscription.cancel() : null
    }
  }
}

export default function streamReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}
