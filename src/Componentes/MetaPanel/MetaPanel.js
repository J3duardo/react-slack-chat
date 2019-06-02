import React, { Component } from 'react';
import {Segment, Accordion, Header, Icon, Image} from "semantic-ui-react";

class MetaPanel extends Component {
  state = {
    activeIndex: 0,
    isPrivateChannel: this.props.isPrivateChannel,
    currentChannel: null,
    userPosts: {}
  }

  componentDidUpdate(prevProps) {
    if(this.props.currentChannel !== prevProps.currentChannel) {
      this.setState({
        currentChannel: this.props.currentChannel,
      })
    }

    if(prevProps.userPosts !== this.props.userPosts) {
      this.setState({
        userPosts: this.props.userPosts
      })
    }
  }

  setActiveIndex = (event, titleProps) =>{
    const newIndex = this.state.activeIndex === titleProps.index ? -1 : titleProps.index;
    this.setState({
      activeIndex: newIndex
    });
  };

  render() {
    console.log(this.state.userPosts)

    if(this.props.isPrivateChannel) {
      return null;
    }

    return (
      <Segment>
        <Header as="h3" attached="top">
          {this.state.currentChannel ? `About #${this.state.currentChannel.name}` : "No channel to display..."}
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title
            active={this.state.activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown"/>
            <Icon name="info"/>
            Channel details
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 0}>
            {this.state.currentChannel ? this.state.currentChannel.details : "No channel to display..."}      
          </Accordion.Content>

          <Accordion.Title
            active={this.state.activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown"/>
            <Icon name="user circle"/>
            Top posters
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 1}>
            Posters
          </Accordion.Content>

          <Accordion.Title
            active={this.state.activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown"/>
            <Icon name="pencil alternate"/>
            Created by
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 2}>
            <Header>
              {this.state.currentChannel ? <Image circular src={this.state.currentChannel.createdBy.avatar}/> : <p>No channel to display...</p>}
              {this.state.currentChannel ? this.state.currentChannel.createdBy.name : <p>No channel to display...</p>}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}

export default MetaPanel;
