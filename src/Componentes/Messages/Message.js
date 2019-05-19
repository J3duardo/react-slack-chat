import React from 'react';
import {Comment} from "semantic-ui-react";
import moment from "moment";

const isOwnMessage = (message, user) => {
  return message.user === user.id ? "message__self" : ""
}

const timeNow = (timeStamp) => {
  return moment(timeStamp).fromNow();
} 

const Message = (props) => {
  return (
    <Comment>
      <Comment.Avatar src={props.message.user.avatar}/>
      <Comment.Content className={isOwnMessage(props.message, props.user)}>
        <Comment.Author as="a">{props.message.user.name}</Comment.Author>
        <Comment.Metadata>{timeNow(props.message.timestamp)}</Comment.Metadata>
        <Comment.Text>{props.message.content}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
}

export default Message;
