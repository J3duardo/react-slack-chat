import React, { Component } from 'react';
import {Segment, Comment} from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import firebase from "../../firebase";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages")
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
        <MessagesForm
          messagesRef={this.state.messagesRef}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
