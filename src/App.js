/* @flow */
import React from 'react'
import { Provider } from 'react-redux'
import {Router, browserHistory} from 'react-router'
import {NamedURLResolver} from 'react-router-named-routes'

import store from './store'
import routes from './routes'

import startUpdateService       from './services/Updates'
// import BugTracker               from './services/BugTracker'
import ApiClient                from './services/ApiClient'
import createDispatchCallbacks  from './services/createDispatchCallbacks'
import * as observers from './observers'

import { ApiProvider }  from './decorators/injectApi'
import LoadAsync        from './decorators/LoadAsync'

import fetch from './util/fetch'
import {initialize as initializeLinks} from './util/links'

import './stylesheets/root.less'

const api = new ApiClient('', createDispatchCallbacks(store.dispatch), fetch)

if (module.hot) {
  // If a module update has taken place, the store will
  // - already have the token
  // - thus, not trigger the api client token update through its observer
  //
  // If no module update has taken place and this is our initial execution of this file,
  // this line is a no-op
  api.token = store.getState().session.token
}

//observers.subscribeBugTracker(BugTracker, store)
observers.subscribeSessionObserver(api, store)
observers.subscribeManagerConfigObserver(api, store)

if (process.env.NODE_ENV === 'production') {
  startUpdateService(store)
}

NamedURLResolver.mergeRouteTree(routes)
initializeLinks()

export default function App() {
  return <Provider store={store}>
    <ApiProvider api={api}>
      <Router history={browserHistory} onUpdate={onRouteChange} render={props => <LoadAsync {...props}/>}>
        {routes}
      </Router>
    </ApiProvider>
  </Provider>
}

function onRouteChange () {
  const route = this.state.routes
    .map(r => r.path)
    .filter(Boolean)
    .slice(1)
    .join('/')

  //BugTracker.setRoute('/' + route)
}
