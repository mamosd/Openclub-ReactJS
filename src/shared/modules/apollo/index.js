/**
 * Apollo integration with openclub for graphql API
 */
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import message from 'antd/lib/message';

const networkInterface = createNetworkInterface({
  uri: process.env.GRAPH_URL
})

// adds store utilising middlewares to the apollo client
export const initMiddlewares = ({ getState }) => (reduxNext) => (action) => {
  networkInterface.use([{
    applyMiddleware: ({ options }, next) => {
      // check if a token is available
      const { token } = getState().auth

      if (token) {
        // create headers if needed
        if (!options.headers) {
          options.headers = {}
        }

        options.headers.authorization = `Bearer ${token}`
      }

      next()
    }
  }])

  const errorLog = {
    async applyAfterware({ response }, next) {
      try {
        if (response.status === 401) {
          message.error('You are no logged in. Please return to the homepage to login.', 15);
          throw new Error('ApolloUnauthorisedError');
        }
        const { errors } = await response.clone().json();
        if (errors) {
          throw new Error(errors.map(e => e.message.replace('GraphQL error: ', '')));
        }
      } catch (e) {
        if (e.message === 'ApolloUnauthorisedError') localStorage.removeItem('openclub_token');
        Promise.reject(e);
      }
      next();
    }
  }

  networkInterface.useAfter([errorLog])
  reduxNext(action);
}

const apollo = new ApolloClient({
  ssrMode: process.env.IS_SERVER,
  networkInterface,
  dataIdFromObject: obj => obj._id
});

export const reducer = apollo.reducer();

export const middleware = apollo.middleware();

export default apollo;
