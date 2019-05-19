import React, { Component } from 'react';
import {Segment, Button, Input} from "semantic-ui-react";

class MessagesForm extends Component {
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
        />
        <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add reply"
            labelPosition="left"
            icon="edit"
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

export default MessagesForm;
