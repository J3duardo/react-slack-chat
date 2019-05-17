import React, { Component } from 'react';
import{Grid, Header, Icon, Dropdown} from "semantic-ui-react";
import firebase from "../../firebase";
import {connect} from "react-redux";

class UserPanel extends Component {
  dropdownOptions = () => [
    {
      key: "user",
      text: <span>Signed in as <strong>{this.props.userName}</strong></span>,
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={this.signOutHandler}>Sign Out</span>
    }
  ];

  signOutHandler = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Sesión terminada")
      })
  }

  render() {
    return (
      <Grid style={{backgroundColor: "#4c3c4c"}}>
        <Grid.Column>
          <Grid.Row style={{padding: "1.2rem", margin: 0}}>
            <Header inverted floated="left" as="h2">
              <Icon name="code"/>
              <Header.Content>DevChat</Header.Content>
            </Header>
          </Grid.Row>
          <Header style={{padding: "0.25rem"}} as="h4" inverted>
            <Dropdown
              trigger={<span>{this.props.userName}</span>}
              options={this.dropdownOptions()}
            />
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userName: state.user.currentUser ? state.user.currentUser.displayName : "User not logged in"
  }
}

export default connect(mapStateToProps)(UserPanel);