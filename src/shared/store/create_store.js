import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { initMiddlewares, middleware as apollo } from 'modules/apollo'
import makeRootReducer from './reducers'

export default (initialState = {}) => {
  // setup middlewares and enhancers
  const middleware = [thunk, apollo, initMiddlewares]
  const enhancers = []
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // create the store
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  )
  store.asyncReducers = {}

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }


  return store
}
