import React from 'react';
import { asyncComponent } from 'react-async-component'
import Error from 'components/Error/Error'
import Loading from 'components/Loading/Loading'

const AsyncClub = asyncComponent({
  name: 'AsyncClub',
  env: process.env.IS_SERVER ? 'node' : 'browser',
  resolve: () => import('./Club'),
  LoadingComponent: () => <Loading />,
  ErrorComponent: (...props) => <Error {...props} />
});
export default AsyncClub;
