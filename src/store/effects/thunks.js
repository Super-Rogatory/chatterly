import { _setName, _setRoom, _createUser } from "../actions/actionCreators";
import axios from "axios";

export const setName = (name) => {
    return function (dispatch) {
        dispatch(_setName(name));
    }
}

export const setRoom = (room) => {
    return function (dispatch) {
        dispatch(_setRoom(room));
    }
}

export const createUser = ( name, room ) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    return async (dispatch) => {
        try {
            const { data: user } = await axios.post('http://localhost:8080/api/users', { name , room });
            dispatch(_createUser(user));
        } catch (err) {
            console.log(err);
        }
    }
}