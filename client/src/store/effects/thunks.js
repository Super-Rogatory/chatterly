import {
	_setName,
	_setRoom,
	_createUser,
	_deleteUser,
	_getUser,
	_getMessages,
	_getUsersInRoom,
	_addMessage,
	_togglePopup,
	_expiredGuest,
} from '../actions/actionCreators';
import axios from 'axios';

const PORT = process.env.PORT || 5000;
const url = `http://localhost:${PORT}`;

export const setName = (name) => {
	return function (dispatch) {
		dispatch(_setName(name));
	};
};

export const setRoom = (room) => {
	return function (dispatch) {
		dispatch(_setRoom(room));
	};
};
export const createUser = (name, room) => {
	name = name.trim().toLowerCase();
	room = room.trim().toLowerCase();
	return async (dispatch) => {
		try {
			const { data: user } = await axios.post(`${url}/api/users`, { name, room });
			dispatch(_createUser(user));
			return user;
		} catch (err) {
			console.log(err);
		}
	};
};
export const deleteUser = (id) => {
	return async (dispatch) => {
		try {
			await axios.delete(`${url}/api/users/${id}`);
			dispatch(_deleteUser(id));
		} catch (err) {
			console.log(err);
		}
	};
};

export const getUser = (id) => {
	return async (dispatch) => {
		try {
			const { data: user } = await axios.get(`${url}/api/users/${id}`);
			dispatch(_getUser(user));
			return user;
		} catch (err) {
			console.log(err);
		}
	};
};

export const getUsersInRoom = (room) => {
	return async (dispatch) => {
		try {
			const { data: users } = await axios.get(`${url}/api/users/room/${room}`);
			dispatch(_getUsersInRoom(users));
			return users;
		} catch (err) {
			console.log(err);
		}
	};
};

// -----------------------------------------------------------------------------------------------------------------------------------------------//

export const addMessage = (message, user) => {
	return async (dispatch) => {
		const { data } = await axios.post(`${url}/api/messages`, { message, user });
		dispatch(_addMessage(data));
		return data;
	};
};

export const fetchMessages = () => {
	return async (dispatch) => {
		const { data: messages } = await axios.get(`${url}/api/messages`);
		dispatch(_getMessages(messages));
		return messages;
	};
};
// -----------------------------------------------------------------------------------------------------------------------------------------------//
export const togglePopup = (status) => {
	return (dispatch) => {
		dispatch(_togglePopup(status));
		return status;
	};
};

export const isGuestExpired = (status) => {
	return (dispatch) => {
		dispatch(_expiredGuest(status));
		return status;
	};
};
