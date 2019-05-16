import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import App from './Componentes/App';
import Login from "./Componentes/Auth/Login";
import Register from "./Componentes/Auth/Register";
import registerServiceWorker from './registerServiceWorker';

import 'semantic-ui-css/semantic.min.css';
import {BrowserRouter, Switch, Route} from "react-router-dom";

class ComponenteRoot extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<ComponenteRoot />, document.getElementById('root'));
registerServiceWorker();
