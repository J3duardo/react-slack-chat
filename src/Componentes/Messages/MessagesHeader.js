import React, { Component } from 'react';
import {Header, Segment, Input, Icon} from "semantic-ui-react";

class MessagesHeader extends Component {
  displayUsers = (users) => {
    if(users.length > 1) {
      return `${users.length} users`
    } else if(users.length === 1) {
      return "1 user"
    } else {
      return "Loading users..."
    }
  }

  render() {
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{marginBottom: 0}}>
          <span>
            {this.props.channelName}
            <Icon name="star outline" color="black"/>
          </span>
          <Header.Subheader>
            {this.displayUsers(this.props.uniqueUsers)}          
          </Header.Subheader>
        </Header>

        {/* Channel search input */}
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;