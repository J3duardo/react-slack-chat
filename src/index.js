import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Componentes/App';
import registerServiceWorker from './registerServiceWorker';

import {BrowserRouter, Switch, Route} from "react-router-dom";

const ComponenteRoot = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </BrowserRouter>
  )
}

ReactDOM.render(<ComponenteRoot />, document.getElementById('root'));
registerServiceWorker();
