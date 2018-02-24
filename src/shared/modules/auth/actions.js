import { lock, inlineLock, hashParsed } from 'utils/Auth0'
import { cancelSubscription } from 'modules/notifications/actions';
import message from 'antd/lib/message';
import error from 'utils/error';
import authMutation from 'mutations/auth'

// Auth0 lock actions
export const AUTH_INIT = 'AUTH_INIT'
export const SHOW_INLINE_LOCK = 'SHOW_INLINE_LOCK'
export const SHOW_LOCK = 'SHOW_LOCK'
export const LOCK_SUCCESS = 'LOCK_SUCCESS'
export const LOCK_ERROR = 'LOCK_ERROR'
// single logout action due to jwt (keep as request in case we add complexity)
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'

const authInit = token => ({
  token,
  type: AUTH_INIT
})

const showInlineLock = () => ({ type: SHOW_INLINE_LOCK })
const showLock = () => ({ type: SHOW_LOCK })

const lockSuccess = token => ({
  token,
  type: LOCK_SUCCESS
})
const lockError = err => ({
  err,
  type: LOCK_ERROR
})

const requestLogout = () => ({ type: LOGOUT_REQUEST })

export function inlineLogin(id) {
  return dispatch => {
    dispatch(showInlineLock())
    inlineLock(id).show()
  }
}

export function hideInlineLogin(id) {
  return dispatch => {
    dispatch(showInlineLock())
    inlineLock(id).hide()
  }
}

// Opens the Lock widget and dispatches actions along the way
export function login() {
  return dispatch => {
    dispatch(showLock())
    localStorage.setItem('logonPath', window.location.pathname);
    lock.show()
  }
}

let activeRequest = false;

// checks current authentication status of the lock
export function checkAuthentication() {
  return async dispatch => {
    if (activeRequest) return false;
    if (process.env.IS_CLIENT) {
      const token = localStorage.getItem('openclub_token');
      dispatch(authInit(token))
      if (token) return;
    }
    try {
      activeRequest = true;
      const accessToken = await hashParsed();
      if (accessToken) {
        console.log('hash_parsed', accessToken);

        console.log(mutation);
        const { data } = mutation;
        if (!data) throw new Error('No data returned from server.')
        const { token } = data.signin;
        console.log(token);
        localStorage.setItem('openclub_token', token);
        dispatch(lockSuccess(token));
        activeRequest = false;
      }
    } catch (e) {
      console.trace(e);

      message.error(error(e), 15);
      dispatch(lockError(e));
      activeRequest = false;
    }
  }
}

export function loginSuccess(token) {
  return dispatch => {
    dispatch(lockSuccess(token))
  }
}
export function loginError(e) {
  return dispatch => {
    dispatch(lockError(e))
  }
}

// Logs the user out
export function logoutUser() {
  return dispatch => {
    dispatch(cancelSubscription())
    dispatch(requestLogout())
  }
}
