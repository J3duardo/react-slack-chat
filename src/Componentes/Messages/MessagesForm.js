import React, { Component } from 'react';
import {Segment, Button, Input} from "semantic-ui-react";
import {connect} from "react-redux";
import firebase from "../../firebase";

class MessagesForm extends Component {
  state = {
    message: "",
    loading: false,
    errors: []
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  sendMessage = () => {
    if (this.state.message) {
      this.setState({loading: true});
      this.props.messagesRef
        .child(this.props.channelId)
        .push()
        .set({
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          content: this.state.message,
          user: {
            id: this.props.currentUser.uid,
            name: this.props.currentUser.displayName,
            avatar: this.props.currentUser.photoURL
          }
        })
        .then(() => {
          this.setState({
            loading: false,
            message: "",
            errors: []
          })
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loading: false,
            errors: [...this.state.errors, err]
          })
        })
    } else {
      this.setState({
        errors: [...this.state.errors, {message: "Add a message"}]
      })
    }
  }

  render() {
    return (
      <Segment className="message__form">
        <Input 
          fluid
          name="message"
          style={{marginBottom: "0.7rem"}}
          label={<Button icon="add"/>}
          labelPosition="left"
          placeholder="Write your message"
          onChange={this.onChangeHandler}
        />
        <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
          />
          <Button
            color="teal"
            content="Upload media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    channelId: state.currentChannel ? state.currentChannel.id : "Loading...",
    currentUser: state.user.currentUser ? state.user.currentUser : "Loading..."
  }
}

export default connect(mapStateToProps)(MessagesForm);
