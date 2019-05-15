import React, { Component } from 'react';
import {Grid, Header, Form, Segment, Button, Message, Icon, GridColumn} from "semantic-ui-react";
import {Link} from "react-router-dom";
import "./Register.css";
import firebase from "../../firebase";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSubmitHandler = (event) => {
    event.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(createdUser => {
        console.log(createdUser)
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const {username, email, password, passwordConfirmation} = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="registerPage">
        <GridColumn style={{maxWidth: 450}}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece"/>
            Register for DevChat
          </Header>
          <Form size="large" onSubmit={this.onSubmitHandler}>
            <Segment stacked>
              <Form.Input
                fluid name="username"
                type="text"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                onChange={this.onChangeHandler}
              />

              <Form.Input
                fluid name="email"
                type="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                value={email}
                onChange={this.onChangeHandler}
              />

              <Form.Input
                fluid name="password"
                type="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                onChange={this.onChangeHandler}
              />

              <Form.Input
                fluid name="passwordConfirmation"
                type="password"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                value={passwordConfirmation}
                onChange={this.onChangeHandler}
              />

              <Button color="orange" fluid size="large">Submit</Button>
            </Segment>
          </Form>
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Register;