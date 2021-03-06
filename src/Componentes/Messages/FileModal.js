import React, { Component } from 'react';
import {Modal, Input, Button, Icon} from "semantic-ui-react";

class FileModal extends Component {
  state = {
    file: null,
    authorized: ["image/jpeg", "image/png"]
  }

  addFile = (event) => {
    const file = event.target.files[0];
    if(file) {
      this.setState({
        file: file
      })
    }
  }

  sendFile = () => {
    if(this.state.file !== null) {
      if(this.isAuthorized(this.state.file.type)) {
        const metadata = {contentType: this.state.file.type}
        this.props.uploadFile(this.state.file, metadata);
        this.props.closeModal();
        this.clearFile();
      }
    }
  }

  isAuthorized = (fileType) => {
    return this.state.authorized.includes(fileType)
  }

  clearFile = () => {
    this.setState({
      file: null
    })
  }

  render() {
    return (
      <Modal basic open={this.props.modal} onClose={this.props.closeModal}>
        <Modal.Header>Enviar imagen</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label="Formatos permitidos: .jpg, .png"
            type="file"
            onChange={this.addFile}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.sendFile}>
            <Icon name="checkmark"/> Enviar
          </Button>
          <Button color="red" inverted onClick={this.props.closeModal}>
            <Icon name="remove"/> Cancelar
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;