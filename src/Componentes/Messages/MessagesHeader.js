import React, { Component } from 'react';
import {Header, Segment, Input, Icon} from "semantic-ui-react";

class MessagesHeader extends Component {
  displayUsers = (users) => {
    if(users.length > 1) {
      return `${users.length} usuarios`
    } else if(users.length === 1) {
      return "1 usuario"
    } else {
      return "Este canal no posee usuarios."
    }
  }

  onChangeHandler = (event) => {
    this.props.searchHandler(event)
  }

  render() {
    if(this.props.channelName === "") {
      return (
        <Segment style={{textAlign: "center", border: "1px solid orange"}}>
          <h2>No hay canal para mostrar</h2>
          <p>
            Para comenzar a chatear cree un canal presionando el botón
            <Icon name="add" color="teal" size="large" style={{marginRight: "0px", margin: "0 3px"}}/> 
            ubicado en el panel lateral.</p>
        </Segment>
      )
    }
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{marginBottom: 0}}>
          <span>
          {this.props.channelName}
          {!this.props.isPrivateChannel && (
            <Icon
              onClick={this.props.starredHandler}
              name={this.props.isChannelStarred ? "star" : "star outline"}
              color={this.props.isChannelStarred ? "yellow" : "black"}
            />
          )}
          </span>
          <Header.Subheader>
            {this.displayUsers(this.props.uniqueUsers)}          
          </Header.Subheader>
        </Header>
        <Header floated="right">
          <Input
            onChange={this.onChangeHandler}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Buscar mensajes"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;