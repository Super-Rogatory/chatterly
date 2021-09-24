import { combineReducers } from "redux";
import { nameReducer } from './name';
import { roomReducer } from './room';
import { usersInRoom, usersReducer, userReducer } from "./users";
import { messagesReducer } from "./message";
const combinedReducer = combineReducers({
    name: nameReducer,
    room: roomReducer,
    user: userReducer,
    users: usersReducer,
    usersInRoom: usersInRoom,
    messages: messagesReducer
});

export default combinedReducer;
