import React, { Component } from 'react';
import {Segment, Comment} from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import firebase from "../../firebase";
import Message from "./Message";

class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channel: null,
      user: null,
      messagesRef: firebase.database().ref("messages"),
      messages: [],
      loadingMessages: true,
      uniqueUsers: [],
      searchTerm: "",
      searchLoading: false,
      searchResults: [],
      privateChannel: false,
      privateMessagesRef: firebase.database().ref("privateMessages"),
      isChannelStarred: false,
      usersRef: firebase.database().ref("users")
    };

    this.currentChannel = null;
    this.currentUser = null;
    this.isPrivate = false;
  }

  // componentDidMount() {
  //   console.log(this.state.channel, this.state.user)
  //   if (this.state.channel && this.state.user) {
  //     this.addUserStarListener(this.state.channel, this.state.user)
  //   }
  // }

  componentDidUpdate(prevProps) {
    if(prevProps !== this.props) {
      this.currentChannel = this.props.channel;
      this.currentUser = this.props.user;
      this.isPrivate = this.props.isPrivateChannel;
      this.updateState(this.currentChannel, this.currentUser, this.isPrivate);
    }    
  }

  updateState = (channel, user, isPrivate) => {
    this.setState ({
      channel: channel,
      user: user,
      privateChannel: isPrivate
    })

    if(channel && user) {
      this.addListeners(channel.id);
      this.addUserStarListener(channel.id, user.uid)
    }
  }

  addListeners = (id) => {
    this.addMessageListener(id);
  }

  addMessageListener = (id) => {
    const loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(id).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        loadingMessages: false
      });
      this.usersCounter(loadedMessages)
    })
  }

  renderMessages = (messages) => {
    if(messages.length > 0) {
     return messages.map((message, i) => {
        return <Message message={message} key={i} user={this.state.user}/>
      })
    }else {
      return <p>No messages to display.</p>
    }
  }

  displayChannelName = (channel) => {
    return channel ? channel.name : "You have no channels created"
  }

  usersCounter = (messages) => {
    const users = [];
    messages.forEach((message) => {
      if(!users.includes(message.user.name)) {
        users.push(message.user.name)
      }
    });
    this.setState({
      uniqueUsers: users
    })
  }

  searchHandler = (event) => {
    this.setState({
      searchTerm: event.target.value,
      searchLoading: true
    }, () => this.searchMessagesHandler())
  }

  searchMessagesHandler = () => {
    const channelMessages = [...this.state.messages];
    const results = channelMessages.filter(message => {
      if(message.content) {
        return message.content.includes(this.state.searchTerm) || message.user.name.includes(this.state.searchTerm);
      }
    });
    this.setState({
      searchResults: results
    })
  }

  displayChannelName = (channel) => {
    return channel ? `${this.state.privateChannel ? "@" : "#"}${channel.name}` : "";
  }

  getMessagesRef = () => {
    return this.state.privateChannel ? this.state.privateMessagesRef : this.state.messagesRef;
  }

  starredHandler = () => {
    const starred = !this.state.isChannelStarred;
    this.setState({
      isChannelStarred: starred
    }, () => this.starChannel())
  }

  starChannel = () => {
    if(this.state.isChannelStarred){
      this.state.usersRef
      .child(`${this.state.user.uid}/starred`)
      .update({
        [this.state.channel.id]: {
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar
          }
        }
      })
    } else {
      this.state.usersRef
      .child(`${this.state.user.uid}/starred`)
      .child(this.state.channel.id)
      .remove(err => {
        if(err !== null) {
          console.error(err)
        }
      })
    }
  }

  addUserStarListener = (channelId, userId) => {
    this.state.usersRef
    .child(userId)
    .child("starred")
    .once("value")
    .then(data => {
      if(data.val() !== null) {
        const channelIds = Object.keys(data.val());
        const prevStarred = channelIds.includes(channelId);
        this.setState({
          isChannelStarred: prevStarred
        })
      }
    })
  }

  render() {
    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(this.state.channel)}
          uniqueUsers={this.state.uniqueUsers}
          searchHandler={this.searchHandler}
          isPrivateChannel={this.state.privateChannel}
          starredHandler={this.starredHandler}
          isChannelStarred={this.state.isChannelStarred}
        />
        <Segment>
          <Comment.Group className="messages">
            {this.state.searchTerm ?
            this.renderMessages(this.state.searchResults) :
            this.renderMessages(this.state.messages)}
          </Comment.Group>
        </Segment>
        <MessagesForm
          isPrivateChannel={this.state.privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
