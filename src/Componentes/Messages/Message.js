import React from 'react';
import {Comment, Image} from "semantic-ui-react";
import moment from "moment";

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? "message__self" : ""
}

const timeNow = (timeStamp) => {
  return moment(timeStamp).fromNow();
}

const isImage = (message) => {
  return message.hasOwnProperty("image")
}

const Message = (props) => {
  console.log(props.message)
  return (
    <Comment>
      <Comment.Avatar src={props.message.user.avatar}/>
      <Comment.Content className={isOwnMessage(props.message, props.user)}>
        <Comment.Author as="a">{props.message.user.name}</Comment.Author>
        <Comment.Metadata>{timeNow(props.message.timestamp)}</Comment.Metadata>
        <Comment.Text>{props.message.content}</Comment.Text>
        {isImage(props.message) ? 
          <Image src={props.message.image} className="message__image"/> : null
        }
      </Comment.Content>
    </Comment>
  );
}

export default Message;
