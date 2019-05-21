import React, { Component } from 'react';
import {Segment, Button, Input} from "semantic-ui-react";
import {connect} from "react-redux";
import firebase from "../../firebase";
import FileModal from "./FileModal";
import uuidv4 from "uuid/v4";

class MessagesForm extends Component {
  state = {
    message: "",
    loading: false,
    errors: [],
    modal: false,
    uploadTask: null,
    uploadState: "",
    percentUploaded: 0,
    storageRef: firebase.storage().ref(),
    messagesRef: firebase.database().ref("messages")
  }

  openModal = () => {
    this.setState({modal: true})
  }

  closeModal = () => {
    this.setState({
      modal: false
    })
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.props.currentUser.uid,
        name: this.props.currentUser.displayName,
        avatar: this.props.currentUser.photoURL
      }
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message
  }

  sendMessage = () => {
    if (this.state.message) {
      this.setState({loading: true});
      this.state.messagesRef
        .child(this.props.channelId)
        .push()
        .set(this.createMessage())
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

  uploadFile = (file, metadata) => {
    const ref = this.state.messagesRef;
    const pathToUpload = this.props.channelId;
    const fileType = metadata.contentType === "image/jpeg" ? ".jpg" : ".png";
    const filePath = `chat/public/${uuidv4()}${fileType}`;

    this.setState({
      uploadState: "uploading",
      uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
    },
      () => {
        this.state.uploadTask.on("state_changed", (snap) =>{
          const percentUploaded = Math.round((snap.bytesTransferred/snap.totalBytes)*100);
          this.setState({percentUploaded: percentUploaded});
        },
          (err) => {
            console.log(err);
            this.setState({
              errors: [...this.state.errors, err],
              uploadState: "error",
              uploadTask: null
            })
          },
          () => {
            this.state.uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
              this.sendFileMessage(downloadUrl, ref, pathToUpload);
            })
            .catch((err) => {
              console.log(err);
              this.setState({
                errors: [...this.state.errors, err],
                uploadState: "error",
                uploadTask: null
              })
            })
          }
        )
      }
    )
  };

  sendFileMessage = (downloadUrl, ref, pathToUpload) => {
    ref.child(pathToUpload)
    .push()
    .set(this.createMessage(downloadUrl))
    .then(() => {
      this.setState({uploadState: "done"})
    })
    .catch((err) => {
      console.log(err);
      this.setState({errors: [...this.state.errors, err]})
    })
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
          value={this.state.message}
          disabled={this.state.loading}
          className={this.state.errors.some(err => { return err.message.includes("message")}) ? "error" : ""}
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
            onClick={this.openModal}
          />
          <FileModal
            modal={this.state.modal}
            closeModal={this.closeModal}
            uploadFile={this.uploadFile}
          />
        </Button.Group>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    channelId: state.currentChannel.currentChannel ? state.currentChannel.currentChannel.id : "Loading...",
    currentUser: state.user.currentUser ? state.user.currentUser : "Loading..."
  }
}

export default connect(mapStateToProps)(MessagesForm);
