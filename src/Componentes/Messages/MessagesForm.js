import React, { Component } from 'react';
import {Segment, Button, Input} from "semantic-ui-react";
import {connect} from "react-redux";
import firebase from "../../firebase";
import FileModal from "./FileModal";
import uuidv4 from "uuid/v4";
import ProgressBar from "./ProgressBar";
import {Picker, emojiIndex} from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";


class MessagesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      loading: false,
      errors: [],
      modal: false,
      uploadTask: null,
      uploadState: "",
      percentUploaded: 0,
      storageRef: firebase.storage().ref(),
      messagesRef: firebase.database().ref("messages"),
      typingRef: firebase.database().ref("typing"),
      emojiPicker: false
    }
    this.inputRef = React.createRef()
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
      this.props.getMessagesRef()
        .child(this.props.channelId)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({
            loading: false,
            message: "",
            errors: []
          });
          this.state.typingRef
          .child(this.props.channelId)
          .child(this.props.currentUser.uid)
          .remove()
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

  getPath = () => {
    if(this.props.isPrivateChannel) {
      return `chat/private-${this.props.channelId}`;
    } else {
      return "chat/public"
    }
  }

  uploadFile = (file, metadata) => {
    const ref = this.props.getMessagesRef();
    const pathToUpload = this.props.channelId;
    const fileType = metadata.contentType === "image/jpeg" ? ".jpg" : ".png";
    const filePath = `${this.getPath()}/${uuidv4()}${fileType}`;

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
  };

  keyDownHandler = (e) => {
    if(this.state.message) {
      this.state.typingRef
      .child(this.props.channelId)
      .child(this.props.currentUser.uid)
      .set(this.props.currentUser.displayName)
    } else {
      this.state.typingRef
      .child(this.props.channelId)
      .child(this.props.currentUser.uid)
      .remove()
    }
  };

  togglePickerHandler = () => {
    this.inputRef.current.focus();
    this.setState({
      emojiPicker: !this.state.emojiPicker
    })
  };

  addEmojiHandler = (emoji) => {
    const prevMessage = this.state.message;
    const updatedMessage = this.colonToUnicode(`${prevMessage} ${emoji.colons}`);
    this.setState({
      message: updatedMessage,
      emojiPicker: false
    });
  };

  colonToUnicode = (newMessage) => {
    return newMessage.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if ( typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    })
  };

  render() {
    return (
      <Segment className="message__form">
        {this.state.emojiPicker && (
          <Picker 
            set="apple"
            className="emojipicker"
            title="Pick your emoji"
            emoji="point_up"
            onSelect={this.addEmojiHandler}
          />
        )}
        <Input 
          fluid
          name="message"
          style={{marginBottom: "0.7rem"}}
          label={
            <Button
              icon={this.state.emojiPicker ? "close" : "add"}
              content={this.state.emojiPicker ? "close" : "Add emoji"}
              onClick={this.togglePickerHandler}
            />
          }
          labelPosition="left"
          placeholder="Write your message"
          onChange={this.onChangeHandler}
          value={this.state.message}
          disabled={this.state.loading}
          className={this.state.errors.some(err => { return err.message.includes("message")}) ? "error" : ""}
          onKeyDown={this.keyDownHandler}
          ref={this.inputRef}
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
            disabled={this.state.uploadState === "uploading"}
            content="Upload media"
            labelPosition="right"
            icon="cloud upload"
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal
          modal={this.state.modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar
          uploadState={this.state.uploadState}
          percentUploaded={this.state.percentUploaded}
        />
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
