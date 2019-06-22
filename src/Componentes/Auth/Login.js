import React, { Component } from 'react';
import {Grid, Header, Form, Segment, Button, Message, Icon, GridColumn} from "semantic-ui-react";
import {Link} from "react-router-dom";
import "./Register.css";
import firebase from "../../firebase";

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSubmitHandler = (event) => {
    event.preventDefault();
    if(this.isFormValid(this.state)) {
      this.setState({errors: [], loading: true})
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(loggedUser => {
          this.setState({
            loading: false
          })
        })
        .catch(err => {
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          })
        })
    }
  }

  isFormValid = (state) => {
    return state.email && state.password;
  }

  displayError = (errors) => {
    return errors.map((error, i) => {
      if(error.message.includes("invalid")) {
        return <p key={i}>Contraseña incorrecta</p>
      }
    })
  }

  inputErrorClassName = (errs, inputName) => {
    return errs.some(err => err.message.toLowerCase().includes(inputName)) ? "error" : ""
  }

  render() {
    const {email, password, errors, loading} = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="registerPage">
        <GridColumn style={{maxWidth: 450}}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="code branch"/>
            DevChat
          </Header>
          <Form size="large" onSubmit={this.onSubmitHandler}>
            <Segment stacked>
              <Form.Input
                fluid name="email"
                className={this.inputErrorClassName(errors, "email")}
                type="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                value={email}
                onChange={this.onChangeHandler}
              />

              <Form.Input
                fluid name="password"
                className={this.inputErrorClassName(errors, "password")}
                type="password"
                icon="lock"
                iconPosition="left"
                placeholder="Contraseña"
                value={password}
                onChange={this.onChangeHandler}
              />

              <Button
                color="violet"
                fluid size="large"
                disabled={loading}
                className={loading ? "loading" : ""}
              >
                Iniciar sesión
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
            ¿No posee cuenta en DevChat? <Link to="/register">Registrarse</Link>
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Login;