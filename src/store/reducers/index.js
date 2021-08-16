import { combineReducers } from "redux";
import { nameReducer } from './name';
import { roomReducer } from './room';

const combinedReducer = combineReducers({
    name: nameReducer,
    room: roomReducer
});

export default combinedReducer;
