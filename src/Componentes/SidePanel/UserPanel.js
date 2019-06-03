import React, { Component } from 'react';
import{Grid, Header, Icon, Dropdown, Image, Modal, Input, Button} from "semantic-ui-react";
import firebase from "../../firebase";
import {connect} from "react-redux";

class UserPanel extends Component {
  state = {
    modal: false,
    previewImage: null
  }

  dropdownOptions = () => [
    {
      key: "user",
      text: <span>Signed in as <strong>{this.props.userName}</strong></span>,
      disabled: true
    },
    {
      key: "avatar",
      text: <span onClick={this.openModal}>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={this.signOutHandler}>Sign Out</span>
    }
  ];

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

  signOutHandler = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Sesión terminada")
      })
  };

  changeHandler = (event) => {
    const avatar = event.target.files[0];
    const reader = new FileReader();
    if(avatar) {
      reader.readAsDataURL(avatar);
      reader.addEventListener("load", () => {
        this.setState({
          previewImage: reader.result
        })
      })
    }
  }

  render() {
    return (
      <Grid style={{backgroundColor: this.props.backgroundColor}}>
        <Grid.Column>
          <Grid.Row style={{padding: "1.2rem", margin: 0}}>
            <Header inverted floated="left" as="h2">
              <Icon name="code"/>
              <Header.Content>DevChat</Header.Content>
            </Header>
          </Grid.Row>
          <Header style={{padding: "0.25rem"}} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={this.props.userAvatar} spaced="right" avatar/>
                  {this.props.userName}
                </span>
              }
              options={this.dropdownOptions()}
            />
          </Header>
        </Grid.Column>
        <Modal basic open={this.state.modal} onClose={this.closeModal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input
              fluid
              type="file"
              label="New Avatar"
              name="previewImage"
              onChange={this.changeHandler}
            />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  Image preview
                </Grid.Column>
                <Grid.Column>
                  Cropped image preview
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted>
              <Icon name="save"/>
              Change Avatar
            </Button>
            <Button color="green" inverted>
              <Icon name="image"/>
              Preview
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove"/>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userName: state.user.currentUser ? state.user.currentUser.displayName : "Cargando...",
    userAvatar: state.user.currentUser ? state.user.currentUser.photoURL : "Cargando..."
  }
}

export default connect(mapStateToProps)(UserPanel);