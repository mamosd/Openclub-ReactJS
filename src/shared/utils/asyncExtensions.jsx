import React from 'react';
import Error from 'components/Error/Error'
import Loading from 'components/Loading/Loading'

export default {
  ErrorComponent: ({ error }) => <Error error={error} />,
  LoadingComponent: () => <Loading />
}
