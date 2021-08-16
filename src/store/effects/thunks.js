import { _setName, _setRoom } from "../actions/actionCreators";

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