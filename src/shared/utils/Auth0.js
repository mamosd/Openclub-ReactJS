import Auth0Lock from 'auth0-lock';

const origin = process.env.IS_CLIENT ? location.origin : 'http://app.openclub.co';

const auth = {
  redirectUrl: `${origin}/auth`,
  responseType: 'token',
  sso: true
}

const additionalSignUpFields = [
  {
    name: 'name',
    placeholder: 'Full Name'
  }
]

// singleton Auth0 lock
const lock = process.env.IS_CLIENT ? new Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN, {
  theme: {
    logo: 'https://a.whack.wtf/openclub/logo/logo.png',
    primaryColor: '#008FCC'
  },
  languageDictionary: {
    title: 'Log In to OpenClub'
  },
  auth, // set above
  additionalSignUpFields,
  autofocus: true
}) : () => true

const inlineLock = process.env.IS_CLIENT ? container => new Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN, {
  container,
  theme: {
    primaryColor: '#008fcc'
  },
  auth, // set above
  additionalSignUpFields
}) : () => true

/**
 * Due to Auth0s stupid choice to use events, and the fact that they
 * emit the event with setTimeout(emit, 0), you need to subscribe
 * immediately after lock creation.
 *
 * We use the 'hash_parsed' event instead because it triggers whether
 * there is a hash or not, which allows us to link auth properly into redux.
 * We convert the event into a promise that is consumable by actions
 */
const hashParsed = () => new Promise((resolve, reject) => {
  if (process.env.IS_SERVER) {
    return resolve(false);
  }

  setTimeout(() => {
    reject(new Error('Login has timed out.'));
  }, 10000);

  lock.on('hash_parsed', (result) => {
    if (result && result.accessToken) resolve(result.accessToken);
    if (result) reject(result);
    resolve(result);
  });
})

export {
  lock,
  inlineLock,
  hashParsed,
}
