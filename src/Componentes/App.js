import React from 'react';
import {Grid} from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import './App.css';

const App = () => {
  return (
    <Grid>
      <ColorPanel />
      <SidePanel />
      <Messages />
      <MetaPanel />
    </Grid>
  )
}

export default App;
