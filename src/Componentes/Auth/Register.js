import React, { Component } from 'react';
import {Grid, Header, Form, Segment, Button, Message, Icon, GridColumn} from "semantic-ui-react";

class Register extends Component {
  render() {
    return (
      <Grid textAlign="center" verticalAlign="middle">
        <GridColumn style={{maxWidth: 450}}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece"/>
            Register for DevChat
          </Header>
        </GridColumn>
      </Grid>
    );
  }
}

export default Register;