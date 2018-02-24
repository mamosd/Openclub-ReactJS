import { OPEN_SIDEBAR, CLOSE_SIDEBAR, TOGGLE_SIDEBAR } from './actions';

const initialState = { sidebar: false }

const ACTION_HANDLERS = {
  [OPEN_SIDEBAR]: () => ({
    sidebar: true
  }),
  [CLOSE_SIDEBAR]: () => ({
    sidebar: false
  }),
  [TOGGLE_SIDEBAR]: ({ sidebar }) => ({
    sidebar: !sidebar
  })
}

export default function uiReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
