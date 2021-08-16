import { combineReducers } from "redux";
import { nameReducer } from './name';
import { roomReducer } from './room';
import { usersReducer } from "./users";

const combinedReducer = combineReducers({
    name: nameReducer,
    room: roomReducer,
    users: usersReducer
});

export default combinedReducer;
