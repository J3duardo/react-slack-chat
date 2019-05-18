import React, { Component } from 'react';
import {Menu, Icon, Modal, Form, Input, Button} from "semantic-ui-react";
import firebase from "../../firebase";
import {connect} from "react-redux";
import {setCurrentChannel} from "../../actions";

class Channels extends Component {
  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.state.channelsRef.off();
  }

  state = {
    channels: [],
    modal: false,
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    activeChannel: ""
  }

  closeModal = () => {
    this.setState({modal: false})
  }

  openModal = () => {
    this.setState({modal: true})
  }

  onChangeHandler = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  onSubmitHandler = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel()
    }
  }

  isFormValid = (state) => {
    return state.channelName && state.channelDetails;
  }

  addChannel = () => {
    const key = this.state.channelsRef.push().key;

    const newChannel = {
      id: key,
      name: this.state.channelName,
      details: this.state.channelDetails,
      createdBy: {
        name: this.props.userName,
        avatar: this.props.userAvatar
      }
    }
    
    this.state.channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({
          channelDetails: "",
          channelName: ""
        });
        this.closeModal();
        console.log("Canal agregado con éxito!")
      })
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", (snap) => {
      loadedChannels.push(snap.val());
      this.setState({
        channels: loadedChannels
      });
      this.setFirstChannel();
    });

  }

  renderChannels = (channels) => {
    if (channels.length > 0) {
      return channels.map((channel) => {
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
      return <p style={{fontSize: "1rem", color: "#fff"}}>Getting channels...</p>
    }
  }

  changeChannel = (channel) => {
    this.props.currentChannel(channel);
    this.setActiveChannel(channel);
  }

  setFirstChannel = () => {
    if (this.state.channels.length > 0) {
      this.props.currentChannel(this.state.channels[0]);
      this.setActiveChannel(this.state.channels[0]);
    }
  }

  setActiveChannel = (channel) => {
    this.setState({
      activeChannel: channel.id
    })
  }


  render() {
    console.log(this.state.channels)
    return (
      <React.Fragment>
        <Menu.Menu style={{paddingBottom: "2rem"}}>
          <Menu.Item>
            <span>
              <Icon name="exchange"/> Channels
            </span>{" "}
            ({this.state.channels.length}) <Icon name="add" onClick={this.openModal}/>
          </Menu.Item>
          {this.renderChannels(this.state.channels)}
        </Menu.Menu>

        <Modal basic open={this.state.modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.onSubmitHandler}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.onChangeHandler}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.onChangeHandler}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.onSubmitHandler}>
              <Icon name="checkmark"/> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove"/> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userName: state.user.currentUser ? state.user.currentUser.displayName : "",
    userAvatar: state.user.currentUser ? state.user.currentUser.photoURL : ""
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    currentChannel: (channel) => {
      dispatch(setCurrentChannel(channel))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
