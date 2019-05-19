import React, { Component } from 'react';
import {Segment, Comment} from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import firebase from "../../firebase";

class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channel: null,
      user: null,
      messagesRef: firebase.database().ref("messages"),
      messages: [],
      loadingMessages: true
    };

    this.currentChannel = null;
    this.currentUser = null;
  }

  componentDidUpdate(prevProps) {
    if(prevProps !== this.props) {
      this.currentChannel = this.props.channel;
      this.currentUser = this.props.user;
      this.updateState(this.currentChannel, this.currentUser)
    }    
  }

  updateState = (channel, user) => {
    this.setState ({
      channel: channel,
      user: user
    })

    if(channel && user) {
      this.addListeners(channel.id)
    }
  }

  addListeners = (id) => {
    this.addMessageListener(id);
  }

  addMessageListener = (id) => {
    const loadedMessages = [];
    this.state.messagesRef.child(id).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        loadingMessages: false
      })
    })
  }

  render() {
    return (
      <React.Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">
            Messages
          </Comment.Group>
        </Segment>
        <MessagesForm/>
      </React.Fragment>
    );
  }
}

export default Messages;
