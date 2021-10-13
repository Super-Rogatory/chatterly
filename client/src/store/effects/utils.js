import axios from 'axios';

const PORT = process.env.PORT || 5000;
const url = `http://localhost:${PORT}`;

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
