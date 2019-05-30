import React, { Component } from 'react';
import {Menu, Icon} from "semantic-ui-react";

class Starred extends Component {
  state = {
    starredChannels: []
  }
  
  render() {
    return (
      <Menu.Menu style={{paddingBottom: "2rem"}}>
          <Menu.Item>
            <span>
              <Icon name="star"/> Starred
            </span>{" "}
            ({this.state.starredChannels.length}) <Icon name="add" onClick={this.openModal}/>
          </Menu.Item>
          {this.renderChannels(this.state.channels)}
        </Menu.Menu>
    );
  }
}

export default Starred;
