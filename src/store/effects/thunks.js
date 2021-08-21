import { _setName, _setRoom, _createUser, _deleteUser, _getUser, _getUsersInRoom } from "../actions/actionCreators";
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
            return user;
        } catch (err) {
            console.log(err);
        }
    }
}
export const deleteUser = (id) => {
    return async (dispatch) => {
        try {
            await axios.delete(`http://localhost:8080/api/users/${id}`);
            dispatch(_deleteUser(id));
        } catch (err) {
            console.log(err);
        }
    }
}
export const getUser = (id) => {
    return async (dispatch) => {
        try {
            const { data: user } = await axios.get(`http://localhost:8080/api/users/${id}`);
            dispatch(_getUser(user));
        } catch (err) {
            console.log(err);
        }
    }
}

export const getUsersInRoom = (room) => {
    return async (dispatch) => {
        try {
            const { data: users } = await axios.get(`http://localhost:8080/api/users/room/${room}`);
            dispatch(_getUsersInRoom(users));
            return users;
        } catch (err) {
            console.log(err);
        }
    }
}