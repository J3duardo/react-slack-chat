import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment} from "semantic-ui-react";
import {SketchPicker} from "react-color";
import firebase from "../../firebase";
import {connect} from "react-redux";
import {setUserColors} from "../../actions";

class ColorPanel extends Component {
  state = {
    modal: false,
    primary: "",
    secondary: "",
    currentUser: null,
    userColors: [],
    usersRef: firebase.database().ref("users")
  };

  componentDidMount() {
    this.setState({
      currentUser: this.props.user
    }, () => {
      if (this.state.currentUser) {
        this.addListener(this.state.currentUser.uid)
      }
    })
  };

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.setState({
        currentUser: this.props.user
      }, () => {
        if(this.state.currentUser) {
          this.addListener(this.state.currentUser.uid)
        }
      })
    }
  };

  componentWillUnmount() {
    this.state.usersRef.child(`${this.state.currentUser.uid}/colors`).off()
  }

  addListener = (userId) => {
    const userColors = [];
    this.state.usersRef
      .child(`${userId}/colors`)
      .on("child_added", (snapshot) => {
        userColors.push(snapshot.val());
        this.setState({
          userColors
        })
      });
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

  saveColorsHandler = () => {
    if (this.state.primary && this.state.secondary) {
      this.saveColors(this.state.primary, this.state.secondary)
    }
  };

  saveColors = (primary, secondary) => {
    this.state.usersRef
    .child(`${this.state.currentUser.uid}/colors`)
    .push()
    .update({
      primary,
      secondary
    })
    .then(() => {
      this.closeModal()
    })
    .catch((err) => {
      console.error(err)
    })
  };

  displayUserColors = (colors) => {
    return colors.length > 0 && colors.map((color, i) => {
      return (
        <React.Fragment key={i}>
          <Divider />
          <div className="color__container" onClick={() => {
            this.props.setColors(color.primary, color.secondary)
          }}>
            <div className="color__square" style={{backgroundColor: color.primary}}>
              <div className="color__overlay" style={{backgroundColor: color.secondary}}></div>
            </div>
          </div>
        </React.Fragment>
      )
    })
  }

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
        {this.displayUserColors(this.state.userColors)}

        <Modal basic open={this.state.modal} onClose={this.closeModal}>
          <Modal.Header>Choose App Colors</Modal.Header>
          <Modal.Content>
            <Segment style={{display: "flex", justifyContent: "space-around"}}>
              <div>
                <Label content="Choose the Primary Color" />
                <SketchPicker color={this.state.primary} onChange={this.primaryColorHandler}/>
              </div>
              <div>
                <Label content="Choose the Secondary Color"/>
                <SketchPicker color={this.state.secondary} onChange={this.secondaryColorHandler}/>
              </div>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.saveColorsHandler}>
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
};

const mapDispatchToProps = (dispatch) => {
  return {
    setColors: (primary, secondary) => {
      dispatch(setUserColors(primary, secondary))
    }
  }
}

export default connect(null, mapDispatchToProps)(ColorPanel);
