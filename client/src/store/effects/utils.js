import axios from 'axios';

const PORT = process.env.PORT || 5000;
const url = process.env.NODE_ENV === 'production' ? 'https://wechatterly.herokuapp.com' : `http://localhost:${PORT}`;

export const addMessage = async (msg, user) => {
	const { data: message } = await axios.post(`${url}/api/messages`, { message: msg, user });
	if (message.err) {
		throw new Error('unable to add message. likely the user was a guest and privileges have expired.');
	}
};

export const fetchMessagesInRoom = async (room) => {
	const { data: messages } = await axios.get(`${url}/api/messages/${room}`);
	return messages;
};

export const fetchUsersInRoom = async (room) => {
	const { data } = await axios.get(`${url}/api/rooms/users/${room}`);
	return data.status ? data.users : data.msg;
};

export const openRoom = async (name) => {
	// if room already exists do not dispatch the action as it will duplicate in the store.
	const { data: room } = await axios.post(`${url}/api/rooms`, { name });
	return room;
};

export const doesUserExist = async (name) => {
	if (!name) return false;
	const { data: isNameTaken } = await axios.get(`${url}/api/users/misc/${name}`);
	return isNameTaken;
};

export const getRoom = async (id) => {
	const { data: room } = await axios.get(`${url}/api/rooms/${id}`);
	return room;
};

export const associateUserAndRoom = async (user) => {
	await axios.put(`${url}/api/rooms`, { user });
};

export const getActiveUsers = async () => {
	const { data: count } = await axios.get(`${url}/api/users/misc/getUserCount`);
	return count;
};

export const updateInactiveUser = async (user) => {
	const { data: status } = await axios.post(`${url}/api/users/misc/decreaseUserCount`, { name: user.name });
	return status;
};
