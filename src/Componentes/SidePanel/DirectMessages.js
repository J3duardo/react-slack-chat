import React, { Component } from 'react';
import {Menu, Icon} from "semantic-ui-react";
import firebase from "../../firebase";
import {connect} from "react-redux";
import {setCurrentChannel, setPrivateChannel} from "../../actions";

class DirectMessages extends Component {
  state = {
    user: null,
    users: [],
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
    activeChannel: ""
  }

  componentDidUpdate(prevProps) {
    if(prevProps !== this.props) {
      this.setState({user: this.props.user}, () => {
        this.state.user && this.addListeners(this.state.user.uid)
      })
    }
  }

  addListeners = (userId) => {
    let loadedUsers = [];
    this.state.usersRef.on("child_added", snapshot => {
      if(userId !== snapshot.key) {
        let user = snapshot.val();
        user["uid"] = snapshot.key;
        user["status"] = "offline";
        loadedUsers.push(user)
        this.setState({users: loadedUsers})
      }
    });

    this.state.connectedRef.on("value", (snapshot) => {
      if(snapshot.val() === true) {
        const ref = this.state.presenceRef.child(userId);
        ref.set(true);
        ref.onDisconnect()
        .remove(err => {
          if(err !== null) {
            console.error(err)
          }
        })
      }
    });

    this.state.presenceRef.on("child_added", snapshot => {
      if(userId !== snapshot.key) {
        this.addStatusToUser(snapshot.key);
      }
    });

    this.state.presenceRef.on("child_removed", snapshot => {
      if(userId !== snapshot.key) {
        this.addStatusToUser(snapshot.key, false)
      }
    })
  }

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = [];
    this.state.users.forEach(user => {
      if(user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
        updatedUsers.push(user);
      }
      return updatedUsers;
    })
  }

  isUserOnline = (user) => {
    return user.status === "online"
  }

  changeChannel = (user) => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    this.props.setChannelData(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  }

  getChannelId = (userId) => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId ?
      `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
  }

  setActiveChannel = (userId) => {
    this.setState({
      activeChannel: userId
    })
  }

  render() {
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" />
            Direct Messages
          </span>
          ({this.state.users.length})
        </Menu.Item>
        {this.state.users.map(user => {
          return (
            <Menu.Item
              key={user.uid}
              active={user.uid === this.state.activeChannel}
              onClick={() => this.changeChannel(user)}
              style={{opacity: 0.7, fontStyle: "italic"}}
            >
              <Icon
                name="circle"
                color={this.isUserOnline(user) ? "green" : "red"}
              />
              {user.name}
            </Menu.Item>
          )
        })}
      </Menu.Menu>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setChannelData: (data) => {
      dispatch(setCurrentChannel(data))
    },
    setPrivateChannel: (bool) => {
      dispatch(setPrivateChannel(bool))
    }
  }
}

export default connect(null, mapDispatchToProps)(DirectMessages);