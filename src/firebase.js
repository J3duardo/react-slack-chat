import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDCci2u9oh9L5Ph7eJYv1cGNKbjlL1c-pY",
  authDomain: "react-slack-chat-518b1.firebaseapp.com",
  databaseURL: "https://react-slack-chat-518b1.firebaseio.com",
  projectId: "react-slack-chat-518b1",
  storageBucket: "react-slack-chat-518b1.appspot.com",
  messagingSenderId: "434982487118",
  appId: "1:434982487118:web:f77ed4257d746724"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;