import React from 'react';
import {Grid} from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import './App.css';

import {connect} from "react-redux";

const App = (props) => {
  return (
    <Grid columns="equal" className="app" style={{margin: 0, backgroundColor: props.secondaryColor}}>
      <ColorPanel/>
      <SidePanel
        user={props.user}
        primaryColor={props.primaryColor}
      />
      <Grid.Column style={{marginLeft: 320}}>
        <Messages
          user={props.user}
          channel={props.channel}
          isPrivateChannel={props.isPrivateChannel}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel
          isPrivateChannel={props.isPrivateChannel}
          currentChannel={props.channel}
          userPosts={props.userPosts}
        />
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    channel: state.currentChannel.currentChannel,
    isPrivateChannel: state.currentChannel.isPrivate,
    userPosts: state.user.userPosts,
    primaryColor: state.user.userColors.primary,
    secondaryColor: state.user.userColors.secondary
  }
}

export default connect(mapStateToProps)(App);
