import React, { Component } from 'react'
import {
    BrowserRouter,Switch, Route,HashRouter
} from 'react-router-dom'
import App from './app'
import Player from './page/player';
import List from './page/list';
 
class Root extends Component {
    render() {
        return (<HashRouter>
            <App>
                <Route exact path="/" component={Player} />
                <Route path="/list" component={List} />
            </App>
          </HashRouter>)
    }
}
export default Root;