import React, { Component } from 'react';
import {Segment, Comment} from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import firebase from "../../firebase";
import Message from "./Message";
import {connect} from "react-redux";
import {setUserPosts} from "../../actions";
import Typing from "./Typing";
import Skeleton from "./Skeleton";

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
      usersRef: firebase.database().ref("users"),
      typingRef: firebase.database().ref("typing"),
      typingUsers: [],
      connectedRef: firebase.database().ref(".info/connected"),
      listeners: [],
      showSkeleton: true
    };
    this.messagesScrollRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if(prevProps !== this.props) {
      this.setState({
        channel: this.props.channel,
        user: this.props.user,
        isPrivateChannel: this.props.isPrivateChannel
      }, () => {
        if(this.state.channel && this.state.user) {
          this.addListeners(this.state.channel.id, this.state.user.uid);
        }
      });

    }
    
    if(this.messagesScrollRef.current) {
      this.scrollToBotomHandler()
    }
  }

  componentDidMount() {
    if (this.starChannel.channel && this.state.user) {
      this.removeListeners(this.state.listeners)
    }
    if(!this.state.channel) {
      this.addMessageListener(null)
    }
  }

  componentWillUnmount() {
    this.removeListeners(this.state.listeners);
    this.state.connectedRef.off();
  }

  removeListeners = (listeners) => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event)
    })
  }

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex(listener => {
      return listener.id === id && listener.ref === ref && listener.event === event
    });

    if (index === -1) {
      const newListener = {
        id: id,
        ref: ref,
        event: event
      };
      this.setState({
        listeners: [...this.state.listeners, newListener]
      })
    }
  }

  scrollToBotomHandler = () => {
    this.messagesScrollRef.current.scrollIntoView({behavior: "smooth"});    
  }

  addListeners = (channelId, userId) => {
    this.addMessageListener(channelId);
    this.addUserStarListener(channelId, userId);
    this.addTypingListeners(channelId);
  }
  
  addMessageListener = (id) => {
    const loadedMessages = [];
    const ref = this.getMessagesRef();

    if(id === null) {
      this.setState({loadingMessages: false})
    }

    if(id) {
      ref.child(id).on("child_added", (snap) => {
        loadedMessages.push(snap.val());
        this.setState({
          messages: loadedMessages,
          loadingMessages: false
        });
        this.usersCounter(loadedMessages);
        this.countUserPost(loadedMessages);
      });
  
      ref.child(id).once("value").then((snap) => {
        if (snap.val() === null) {
          this.setState({loadingMessages: false})
        }
      })
  
      this.addToListeners(id, ref, "child_added")
    }
  };

  addTypingListeners = (id) => {
    let typingUsers = [];
    this.state.typingRef
    .child(id).on("child_added", snapshot => {
      if(snapshot.key !== this.state.user.uid) {
        typingUsers = [...typingUsers, {id: snapshot.key, name: snapshot.val()}]
      }
    });
    this.setState({
      typingUsers
    });
    this.addToListeners(id, this.state.typingRef, "child_added")

    this.state.typingRef
    .child(id).on("child_removed", snapshot => {
      const index = typingUsers.findIndex(user => {
        return user.uid === snapshot.key
      });
      if(index !== -1) {
        typingUsers = typingUsers.filter(user => {
          return user.uid !== snapshot.key
        });
        this.setState({
          typingUsers
        })
      }
    });
    this.addToListeners(id, this.state.typingRef, "child_removed")

    this.state.connectedRef.on("value", snapshot => {
      if(snapshot.val() === true) {
        this.state.typingRef
        .child(id)
        .child(this.state.user.uid)
        .onDisconnect()
        .remove(err => {
          if(err !== null) {
            console.log(err)
          }
        })
      }
    })
  };

  countUserPost = (messages) => {
    let counter = {};
    messages.forEach((message, i) => {
      if(counter[message.user.name]) {
        counter[message.user.name].count += 1
      } else {
        counter[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }
    });
    this.props.setUserPosts(counter);
  }

  renderMessages = (messages) => {
    if(messages.length > 0) {
     return messages.map((message, i) => {
        return <Message message={message} key={i} user={this.state.user}/>
      })
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
        return message.content.toLowerCase().includes(this.state.searchTerm.toLowerCase()) || message.user.name.includes(this.state.searchTerm.toLowerCase());
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
    if(this.state.isChannelStarred && this.state.channel.createdBy){
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

  displayTypingUsers = (users) => {
    if(users.length > 0) {
      users.map((user) => {
        return (
          <div key={user.uid} style={{display: "flex", alignItems: "center"}}>
            <span className="user__typing">{user.displayName} is typing</span>
            <Typing />
          </div>
        )
      })
    }
  }

  messagesCheck = (messages, channel) => {
    if (messages.length === 0 && !this.state.loadingMessages && channel) {
      return <p>Este canal no posee mensajes</p>
    } else if ( messages.length === 0 && !this.state.loadingMessages && !channel) {
      return (
        <React.Fragment>
          <p>No hay mensajes para mostrar</p>
          <p>Para comenzar a chatear debe crear al menos un canal</p>
        </React.Fragment>
      )
    }
  }

  renderSkeleton = () => {
    this.hideSkeleton()
    return (
      <React.Fragment>
        {[...Array(9)].map((el, i) => {
          return <Skeleton key={i}/>
        })}
      </React.Fragment>
    )
  }

  hideSkeleton = () => {
    if(this.state.messages.length > 0) {
      this.setState({showSkeleton: false})
    }
    setTimeout(() => {
      this.setState({showSkeleton: false})
    }, 2000)
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
            {this.state.showSkeleton ? this.renderSkeleton() : this.messagesCheck(this.state.messages, this.state.channel)}
            {this.state.searchTerm ?
            this.renderMessages(this.state.searchResults) :
            this.renderMessages(this.state.messages)}
            {this.displayTypingUsers(this.state.typingUsers)}
            <div ref={this.messagesScrollRef}></div>
          </Comment.Group>
        </Segment>
        <MessagesForm
          isPrivateChannel={this.state.privateChannel}
          getMessagesRef={this.getMessagesRef}
          scrollToBotomHandler={this.scrollToBotomHandler}
        />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserPosts: (posts) => {
      dispatch(setUserPosts(posts))
    }
  }
}

export default connect(null, mapDispatchToProps)(Messages);
