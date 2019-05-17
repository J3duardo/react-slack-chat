import React from 'react';
import {Grid} from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import './App.css';

const App = () => {
  return (
    <Grid columns="equal" className="app" style={{margin: 0, backgroundColor: "#eee"}}>
      <ColorPanel />
      <SidePanel />
      <Grid.Column style={{marginLeft: 320}}>
        <Messages />
      </Grid.Column>
      <Grid.Column>
        <MetaPanel width={4}/>
      </Grid.Column>
    </Grid>
  )
}

export default App;
