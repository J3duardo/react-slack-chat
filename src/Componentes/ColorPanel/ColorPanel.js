import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment} from "semantic-ui-react";
import {SliderPicker} from "react-color";

class ColorPanel extends Component {
  state = {
    modal: false,
    primary: "",
    secondary: ""
  };

  openModal = () => {
    this.setState({
      modal: true
    })
  };

  closeModal = () => {
    this.setState({
      modal: false
    })
  };

  primaryColorHandler = (event) => {
    this.setState({
      primary: event.hex
    })
  };
  
  secondaryColorHandler = (event) => {
    this.setState({
      secondary: event.hex
    })
  };

  render() {
    return (
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        vertical
        visible
        width="very thin"
      >
        <Divider />
        <Button
          icon="add"
          size="small"
          color="blue"
          onClick={this.openModal}
        />

        <Modal basic open={this.state.modal} onClose={this.closeModal}>
          <Modal.Header>Choose App Colors</Modal.Header>
          <Modal.Content>
            <Segment>
              <Label content="Primary Color" />
              <SliderPicker color={this.state.primary} onChange={this.primaryColorHandler}/>
            </Segment>
            <Segment>
              <Label content="Secondary Color"/>
              <SliderPicker color={this.state.secondary} onChange={this.secondaryColorHandler}/>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted>
              <Icon name="checkmark"/>
              Save Colors
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove"/>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

export default ColorPanel;
