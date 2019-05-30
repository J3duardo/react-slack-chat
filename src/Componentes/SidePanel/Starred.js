import React, { Component } from 'react';
import {Menu, Icon} from "semantic-ui-react";
import {connect} from "react-redux";
import {setCurrentChannel, setPrivateChannel} from "../../actions";

class Starred extends Component {
  state = {
    starredChannels: [],
    activeChannel: ""
  }

  renderChannels = (starredChannels) => {
    if (starredChannels.length > 0) {
      return starredChannels.map((channel) => {
        return (
          <Menu.Item
            key={channel.id}
            onClick={() => this.changeChannel(channel)}
            name={channel.name}
            style={{opacity: 0.7}}
            active={channel.id === this.state.activeChannel}
          >
            <span><Icon name="angle right"/> {channel.name}</span>
          </Menu.Item>
        )
      })
    } else {
      return <p style={{fontSize: "1rem", color: "#fff"}}>No channels to display.</p>
    }
  }

  setActiveChannel = (channel) => {
    this.setState({
      activeChannel: channel.id
    })
  }

  changeChannel = (channel) => {
    this.props.currentChannel(channel);
    this.setActiveChannel(channel);
    this.props.setPrivateChannel(false);
  }

  render() {
    return (
      <Menu.Menu style={{paddingBottom: "2rem"}}>
          <Menu.Item>
            <span>
              <Icon name="star"/> Starred
            </span>{" "}
            ({this.state.starredChannels.length})
          </Menu.Item>
          {this.renderChannels(this.state.starredChannels)}
        </Menu.Menu>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentChannel: (channel) => {
      dispatch(setCurrentChannel(channel))
    },
    setActiveChannel: (bool) => {
      dispatch(setPrivateChannel(bool))
    }
  }
}

export default connect(null, mapDispatchToProps)(Starred);
