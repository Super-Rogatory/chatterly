import * as types from './actionTypes';
export const _setName = (name) => {
    return {
        type: types.SET_NAME,
        payload: name
    }
}
export const _setRoom = (room) => {
    return {
        type: types.SET_ROOM,
        payload: room
    }
}
export const _createUser = (user) => {
    return {
        type: types.CREATE_USER,
        payload: user
    }
}
export const _deleteUser = (id) => {
    return {
        type: types.DELETE_USER,
        id
    }
}
export const _getUser = (user) => {
    return {
        type: types.GET_USER,
        payload: user
    }
}
export const _getUsersInRoom = (users) => {
    return {
        type: types.GET_USERS_IN_ROOM,
        payload: users
    }
}