import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import App from './Componentes/App';
import Login from "./Componentes/Auth/Login";
import Register from "./Componentes/Auth/Register";
import registerServiceWorker from './registerServiceWorker';
import firebase from "./firebase";

import 'semantic-ui-css/semantic.min.css';
import {BrowserRouter, Switch, Route, withRouter} from "react-router-dom";

import {createStore} from "redux";
import {Provider, connect} from "react-redux";
import {composeWithDevTools} from "redux-devtools-extension";
import rootReducer from './reducers';
import {setUser, clearUser} from "./actions";


const store = createStore(rootReducer, composeWithDevTools());

class ComponenteRoot extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.props.getUser(user);
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        this.props.clearUser()
      }
    })
  }

  render() {
    return (
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (user) => {
      dispatch(setUser(user))
    },
    clearUser: () => {
      dispatch(clearUser())
    }
  }
}

const RootWithAuth = withRouter(connect(null, mapDispatchToProps)(ComponenteRoot))

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <RootWithAuth />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
