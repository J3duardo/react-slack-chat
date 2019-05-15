import React, { Component } from 'react';
import {Grid, Header, Form, Segment, Button, Message, Icon, GridColumn} from "semantic-ui-react";

class Register extends Component {
  onChangeHandler = () => {

  }

  render() {
    return (
      <Grid textAlign="center" verticalAlign="middle">
        <GridColumn style={{maxWidth: 450}}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece"/>
            Register for DevChat
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input fluid name="username" type="text" icon="user" iconPosition="left" placeholder="Username" onChange={this.onChangeHandler}/>

              <Form.Input fluid name="email" type="email" icon="mail" iconPosition="left" placeholder="Email Address" onChange={this.onChangeHandler}/>

              <Form.Input fluid name="password" type="password" icon="lock" iconPosition="left" placeholder="Password" onChange={this.onChangeHandler}/>

              <Form.Input fluid name="passwordConfirmation" type="password" icon="repeat" iconPosition="left" placeholder="Password Confirmation" onChange={this.onChangeHandler}/>

              <Button color="orange" fluid size="large">Submit</Button>
            </Segment>
          </Form>
        </GridColumn>
      </Grid>
    );
  }
}

export default Register;