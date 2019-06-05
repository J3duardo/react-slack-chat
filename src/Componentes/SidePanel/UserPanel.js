import React, { Component } from 'react';
import{Grid, Header, Icon, Dropdown, Image, Modal, Input, Button} from "semantic-ui-react";
import firebase from "../../firebase";
import {connect} from "react-redux";
import AvatarEditor from "react-avatar-editor";

class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      previewImage: null,
      croppedImage: null,
      blob: null,
      userId: null,
      storageRef: firebase.storage().ref(),
      currentUserRef: null,
      usersRef: firebase.database().ref("users"),
      uploadedCroppedImage: null,
      metadata: {
        contentType: "image/jpg"
      }
    };
    this.avatarRef = React.createRef();
  };

  componentDidUpdate(prevProps) {
    if(this.props.user !== prevProps.user) {
      this.setState({
        userId: this.props.user.uid
      })
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({
          currentUserRef: firebase.auth().currentUser,
          userId: user.uid
        })
      }
    })
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
  };

  croppedImageHandler = () => {
    if(this.avatarRef.current) {
      this.avatarRef.current.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageUrl,
          blob: blob
        })
      })
    }
  };

  uploadCroppedImage = () => {
    this.state.storageRef
    .child(`avatars/user-${this.state.userId}`)
    .put(this.state.blob, this.state.metadata)
    .then(snapshot => {
      snapshot.ref.getDownloadURL().then(downloadUrl => {
        this.setState({
          uploadedCroppedImage: downloadUrl
        }, () => this.changeAvatar())
      })
    })
  };

  changeAvatar = () => {
    this.state.currentUserRef
    .updateProfile({
      photoURL: this.state.uploadedCroppedImage
    })
    .then(() => {
      this.closeModal()
    })
    .catch(err => {
      console.error(err)
    });

    this.state.usersRef
    .child(this.state.userId)
    .update({
      avatar: this.state.uploadedCroppedImage
    })
    .then(() => {
      console.log("Avatar updated")
    })
    .catch(err => {
      console.error(err)
    })
  }

  render() {
    console.log(this.state.userId)
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
                  {this.state.previewImage && (
                    <AvatarEditor
                      ref={this.avatarRef}
                      image={this.state.previewImage}
                      width={120}
                      height={120}
                      border={50}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {this.state.croppedImage && (
                    <Image
                      style={{margin: "3.5rem auto"}}
                      width={100}
                      height={100}
                      src={this.state.croppedImage}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {this.state.croppedImage && <Button color="green" inverted onClick={this.uploadCroppedImage}>
              <Icon name="save"/>
              Change Avatar
            </Button>}
            <Button color="green" inverted onClick={this.croppedImageHandler}>
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