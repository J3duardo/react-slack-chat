import React, { Component } from 'react';
import {Menu, Icon} from "semantic-ui-react";
import firebase from "../../firebase";

class DirectMessages extends Component {
  state = {
    user: null,
    users: [],
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence")
  }

  // componentDidMount() {
  //   console.log(this.state.user)
  //   if(this.state.user) {
  //     this.addListeners(this.state.user.uid)
  //   }
  // }

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

  render() {
    console.log(this.state.users)
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
            <Menu.Item key={user.uid} onClick={() => console.log(user)} style={{opacity: 0.7, fontStyle: "italic"}}>
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

export default DirectMessages;