import React, { Component } from 'react';
import {Menu, Icon, Modal, Form, Input, Button} from "semantic-ui-react";

class Channels extends Component {
  state = {
    channels: [],
    modal: false,
    channelName: "",
    channelDetails: ""
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

  render() {
    return (
      <React.Fragment>
        <Menu.Menu style={{paddingBottom: "2rem"}}>
          <Menu.Item>
            <span>
              <Icon name="exchange"/> Channels
            </span>{" "}
            ({this.state.channels.length}) <Icon name="add" onClick={this.openModal}/>
          </Menu.Item>
        </Menu.Menu>

        <Modal basic open={this.state.modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form>
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
            <Button color="green" inverted>
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

export default Channels;
