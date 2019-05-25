import React, { Component } from 'react';
import {Grid, Header, Form, Segment, Button, Message, Icon, GridColumn} from "semantic-ui-react";
import {Link} from "react-router-dom";
import "./Register.css";
import firebase from "../../firebase";
import md5 from "md5";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref("users")
  }

  isFormValid = () => {
    let errors = [];
    let error;

    if(this.isFormEmpty(this.state)) {
      error = {message: "Debe completar todos los campos"};
      this.setState({errors: errors.concat(error)});
      return false;
    } else if(!this.isPasswordValid(this.state)) {
      error = {message: "Contraseña inválida"};
      this.setState({errors: errors.concat(error)});
      return false;
    } else {
      return true;
    }
  }

  isFormEmpty = (state) => {
    return !state.username.length || !state.email.length || !state.password.length || !state.passwordConfirmation.length;
  }

  isPasswordValid = (state) => {
    if(state.password.length < 6 || state.passwordConfirmation < 6) {
      return false;
    } else if(state.password !== state.passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSubmitHandler = (event) => {
    event.preventDefault();
    if(this.isFormValid()) {
      this.setState({errors: [], loading: true})
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          createdUser.user.updateProfile({
            displayName: this.state.username,
            photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          })
          .then(() => {
            this.saveUser(createdUser).then(() => {
              this.setState({loading: false})
            })
          })
          .catch(err => {
            this.setState({
              errors: this.state.errors.concat(err),
              loading: false
            })
          })
        })
        .catch(err => {
          this.setState({errors: this.state.errors.concat(err), loading: false})
        })
    }
  }

  saveUser = (createdUser) => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
      userId: createdUser.user.uid
    })
  }

  displayError = (errors) => {
    return errors.map((error, i) => {
      return <p key={i}>{error.message}</p>
    })
  }

  inputErrorClassName = (errs, inputName) => {
    return errs.some(err => err.message.toLowerCase().includes(inputName)) ? "error" : ""
  }

  render() {
    const {username, email, password, passwordConfirmation, errors, loading} = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="registerPage">
        <GridColumn style={{maxWidth: 450}}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="puzzle piece"/>
            Register for DevChat
          </Header>
          <Form size="large" onSubmit={this.onSubmitHandler}>
            <Segment stacked>
              <Form.Input
                fluid name="username"
                className={this.inputErrorClassName(errors, "username")}
                type="text"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                onChange={this.onChangeHandler}
              />

              <Form.Input
                fluid name="email"
                className={this.inputErrorClassName(errors, "email")}
                type="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                value={email}
                onChange={this.onChangeHandler}
              />

              <Form.Input
                fluid name="password"
                className={this.inputErrorClassName(errors, "password")}
                type="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                onChange={this.onChangeHandler}
              />

              <Form.Input
                fluid name="passwordConfirmation"
                className={this.inputErrorClassName(errors, "password")}
                type="password"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                value={passwordConfirmation}
                onChange={this.onChangeHandler}
              />

              <Button
                color="orange"
                fluid size="large"
                disabled={loading}
                className={loading ? "loading" : ""}
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayError(errors)}
            </Message>
          )}
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Register;