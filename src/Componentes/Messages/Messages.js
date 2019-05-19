import React, { Component } from 'react';
import {Segment, Comment} from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import firebase from "../../firebase";

class Messages extends Component {
  state = {
    channel: null,
    user: null,
    messagesRef: firebase.database().ref("messages")
  }

  componentDidUpdate(prevProps) {
    if(prevProps !== this.props) {
      this.setState({
        channel: this.props.channel,
        user: this.props.user
      })
    }

    if(this.state.channel && this.state.user) {
      this.addListeners(this.state.channel.id)
    }
  }

  addListeners = (id) => {
    this.addMessageListener(id);
  }

  addMessageListener = (id) => {
    const loadedMessages = [];
    this.state.messagesRef.child(id).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      console.log(loadedMessages)
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
