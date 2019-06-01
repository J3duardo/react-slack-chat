import React, { Component } from 'react';
import {Menu, Icon} from "semantic-ui-react";
import {connect} from "react-redux";
import {setCurrentChannel, setPrivateChannel} from "../../actions";
import firebase from "../../firebase";

class Starred extends Component {
  state = {
    starredChannels: [],
    activeChannel: "",
    usersRef: firebase.database().ref("users")
  }

  componentDidUpdate(prevProps) {
    if(this.props.currentUser !== prevProps.currentUser) {
      this.addListeners(this.props.currentUser.uid)
    }
  }

  addListeners = (userId) => {
    this.state.usersRef
    .child(userId)
    .child("starred")
    .on("child_added", snapshot => {
      const starredChannel = {
        id: snapshot.key,
        ...snapshot.val()
      };
      this.setState({
        starredChannels: [...this.state.starredChannels, starredChannel]
      })
    });

    this.state.usersRef
    .child(userId)
    .child("starred")
    .on("child_removed", snapshot => {
      const channelToRemove = {
        id: snapshot.key,
        ...snapshot.val()
      };
      const filteredChannels = this.state.starredChannels.filter(channel => {
        return channel.id !== channelToRemove.id
      });
      this.setState({
        starredChannels: filteredChannels
      });
    });
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
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
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

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentChannel: (channel) => {
      dispatch(setCurrentChannel(channel))
    },
    setPrivateChannel: (bool) => {
      dispatch(setPrivateChannel(bool))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Starred);
