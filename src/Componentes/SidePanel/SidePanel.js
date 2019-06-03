import React, { Component } from 'react';
import {Menu} from "semantic-ui-react";
import UserPanel from "./UserPanel"
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";

class SidePanel extends Component {
  render() {
    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{backgroundColor: this.props.primaryColor, fontSize: "1.2rem"}}
      >
        <UserPanel backgroundColor={this.props.primaryColor}/>
        <Starred />
        <Channels />
        <DirectMessages user={this.props.user}/>
      </Menu>
    );
  }
}

export default SidePanel;