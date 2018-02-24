import React from 'react';
import { asyncComponent } from 'react-async-component'
import Error from 'components/Error/Error'
import Loading from 'components/Loading/Loading'

const AsyncClubs = asyncComponent({
  name: 'AsyncClubs',
  env: process.env.IS_SERVER ? 'node' : 'browser',
  resolve: () => import('./Clubs'),
  LoadingComponent: () => <Loading />,
  ErrorComponent: (...props) => <Error {...props} />
});
export default AsyncClubs;
