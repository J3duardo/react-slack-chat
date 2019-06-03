import * as actionTypes from "../actions/types";
import {combineReducers} from "redux";

const initialUserState = {
  currentUser: null,
  isLoading: true,
  userPosts: {},
  userColors: {}
}

const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      }
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false
      }
    case actionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload.userPosts
      }
    case actionTypes.SET_COLORS:
      return {
        ...state,
        userColors: action.payload.userColors
      }
    default:
      return state;
  }
}

const initialChannelState = {
  currentChannel: null,
  isPrivate: false
}

const channelReducer = (state = initialChannelState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      }
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivate: action.payload.private
      }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  currentChannel: channelReducer
});

export default rootReducer;