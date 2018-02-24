// Auth0 lock actions
export const OPEN_SIDEBAR = 'OPEN_SIDEBAR';
export const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';

const reduceOpenSidebar = () => ({
  type: OPEN_SIDEBAR
});

const reduceCloseSidebar = () => ({
  type: CLOSE_SIDEBAR
});

const reduceToggleSidebar = () => ({
  type: TOGGLE_SIDEBAR
});

export function openSidebar() {
  return dispatch => {
    dispatch(reduceOpenSidebar())
  }
}

export function closeSidebar() {
  return dispatch => {
    dispatch(reduceCloseSidebar())
  }
}

export function toggleSidebar() {
  return dispatch => {
    dispatch(reduceToggleSidebar())
  }
}
