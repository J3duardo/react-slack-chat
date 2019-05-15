import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Componentes/App';
import Login from "./Componentes/Auth/Login";
import Register from "./Componentes/Auth/Register";
import registerServiceWorker from './registerServiceWorker';

import {BrowserRouter, Switch, Route} from "react-router-dom";

const ComponenteRoot = () => {
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

ReactDOM.render(<ComponenteRoot />, document.getElementById('root'));
registerServiceWorker();
