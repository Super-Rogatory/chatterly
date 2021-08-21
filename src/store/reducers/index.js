import { combineReducers } from "redux";
import { nameReducer } from './name';
import { roomReducer } from './room';
import { usersInRoom, usersReducer, userReducer } from "./users";

const combinedReducer = combineReducers({
    name: nameReducer,
    room: roomReducer,
    user: userReducer,
    users: usersReducer,
    usersInRoom: usersInRoom
});

export default combinedReducer;
