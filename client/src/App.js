import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import myStore from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Landing from './components/layout/Landing';
import AppNavbar from './components/layout/Navbar';
import BusinessList from './components/business/BusinessList';
import BusinessCreate from './components/business/BusinessCreate';
import BusinessEdit from './components/business/BusinessEdit';
import BusinessPublish from './components/business/BusinessPublish';
import EventCreate from './components/events/EventCreate';
//import SignOut from './components/auth/SignOut';
//import { loadUser } from './actions/authActions';

class App extends Component {
  /*componentDidMount() {
    myStore.dispatch(loadUser());
  }*/

  render() {
    return (
      <Provider store={myStore}>
        <Router>
          <Fragment>
            <AppNavbar />
            <Switch>
              <Route exact path='/' component={Landing} />
              <Route path='/business/list' component={BusinessList} />
              <Route path='/business/create' component={BusinessCreate} />
              <Route path='/business/edit/:id' component={BusinessEdit} />
              <Route path='/business/publish' component={BusinessPublish} />
              <Route path='/events/create/:email' component={EventCreate} />
            </Switch>
          </Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
