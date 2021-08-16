import { combineReducers } from "redux";
import { nameReducer } from './name';
import { roomReducer } from './room';
import { usersInRoom, usersReducer } from "./users";

const combinedReducer = combineReducers({
    name: nameReducer,
    room: roomReducer,
    users: usersReducer,
    usersInRoom: usersInRoom
});

export default combinedReducer;
