import React, { Component } from 'react';
import {Segment, Accordion, Header, Icon, Image, List} from "semantic-ui-react";
import {connect} from "react-redux";

class MetaPanel extends Component {
  state = {
    activeIndex: 0,
    isPrivateChannel: this.props.isPrivateChannel,
    currentChannel: null,
    userPosts: null
  };

  componentDidUpdate(prevProps) {
    if(this.props !== prevProps) {
      this.setState({
        currentChannel: this.props.currentChannel,
        userPosts: this.props.userPosts
      })
    }
  };

  setActiveIndex = (event, titleProps) =>{
    const newIndex = this.state.activeIndex === titleProps.index ? -1 : titleProps.index;
    this.setState({
      activeIndex: newIndex
    });
  };

  displayTopPosters = (posts) => {
    let sorted = Object.entries(posts).sort((a, b) => {
      return b[1] - a[1]
    });
    return sorted.map(([key, val], i) => {
      return (
        <List.Item key={i}>
          <Image avatar src={val.avatar}/>
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{val.count} posts</List.Description>
          </List.Content>
        </List.Item>
      )
    })
  }

  renderCreatedBy = () => {
    if (this.state.currentChannel) {
      const info = Object.values(this.state.currentChannel);
      return (
        <React.Fragment>
          <Image circular src={info[0].avatar} style={{marginRight: "10px"}}/>
          <span>{info[0].name}</span>
        </React.Fragment>
      )
    }
  }

  render() {
    if(this.props.isPrivateChannel) {
      return null;
    }

    return (
      <Segment>
        <Header as="h3" attached="top">
          {this.state.currentChannel ? `Acerca de #${this.state.currentChannel.name}` : "No hay canal para mostrar"}
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title
            active={this.state.activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown"/>
            <Icon name="info"/>
            Detalles del canal
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 0}>
            {this.state.currentChannel ? this.state.currentChannel.details : "No hay canal para mostrar"}      
          </Accordion.Content>

          <Accordion.Title
            active={this.state.activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown"/>
            <Icon name="user circle"/>
            Usuarios más activos
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 1}>
            <List>
              {this.state.userPosts ? this.displayTopPosters(this.state.userPosts) : "No hay posts para mostrar"}
            </List>
          </Accordion.Content>

          <Accordion.Title
            active={this.state.activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown"/>
            <Icon name="pencil alternate"/>
            Creado por
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 2}>
            <Header>
              {this.state.currentChannel ? this.renderCreatedBy() : <p>No hay canal para mostrar</p>}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    currentChannel: state.currentChannel.currentChannel,
    userPosts: state.user.userPosts
  }
}

export default connect(mapStateToProps)(MetaPanel);
