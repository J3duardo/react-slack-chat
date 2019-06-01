import React, { Component } from 'react';
import {Segment, Accordion, Header, Icon} from "semantic-ui-react";

class MetaPanel extends Component {
  state = {
    activeIndex: 0
  }

  setActiveIndex = (event, titleProps) =>{
    console.log(titleProps)
    const newIndex = this.state.activeIndex === titleProps.index ? -1 : titleProps.index;
    this.setState({
      activeIndex: newIndex
    });
  };

  render() {
    return (
      <Segment>
        <Header as="h3" attached="top">
          About Channel
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
            Details
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
            Creator
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}

export default MetaPanel;
