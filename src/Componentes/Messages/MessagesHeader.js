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