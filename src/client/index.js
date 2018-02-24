/* eslint-disable global-require */
import Raven from 'raven-js';

const ravenConfig = {
  environment: process.env.NODE_ENV
}
Raven.config('https://6f11d6b6b7ce44ba90f134c8428061d3@sentry.io/179407', ravenConfig).install()

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'teardrop';
//import { CodeSplitProvider, rehydrateState } from 'code-split-component';
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component';
import asyncBootstrapper from 'react-async-bootstrapper';
import { ApolloProvider } from 'react-apollo';
import ReactHotLoader from './components/ReactHotLoader';
import AuthLoader from '../shared/components/auth/AuthLoader'
import App from '../shared/App';
import createStore from '../shared/store/create_store';
import apolloClient, { initMiddlewares } from '../shared/modules/apollo';
import LocaleProvider from 'antd/lib/locale-provider'
import enUS from 'antd/lib/locale-provider/en_US'
import { setup as mixpanel } from 'modules/mixpanel';
import 'utils/offlineMode'


mixpanel()
// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

const applicationState = '__APP_STATE__' in window ? window.__APP_STATE__ : {};
if (applicationState.auth) delete applicationState.auth;

const store = createStore(applicationState);

function renderApp(TheApp) {
  const rehydrateState = window.ASYNC_COMPONENTS_STATE;
  const asyncContext = createAsyncContext();

  const app = (
    <ReactHotLoader>
      <AsyncComponentProvider
        rehydrateState={rehydrateState}
        asyncContext={asyncContext}
      >
        <LocaleProvider locale={enUS}>
          <ApolloProvider client={apolloClient} store={store}>
            <BrowserRouter>
              {routerProps => (
                <TheApp {...routerProps} />
              )}
            </BrowserRouter>
          </ApolloProvider>
        </LocaleProvider>
      </AsyncComponentProvider>
    </ReactHotLoader>
  )

  asyncBootstrapper(app).then(() => {
    render(app, container)
  });
}

// The following is needed so that we can support hot reloading our application.
if (process.env.NODE_ENV === 'development' && module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js');
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept(
    '../shared/App',
    () => renderApp(require('../shared/App').default),
  );
}

// Execute the first render of our app.
renderApp(App);

// This registers our service worker for asset caching and offline support.
// Keep this as the last item, just in case the code execution failed (thanks
// to react-boilerplate for that tip.)
require('./registerServiceWorker');
