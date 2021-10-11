import axios from 'axios';

const PORT = process.env.PORT || 5000;
const url = `http://localhost:${PORT}`;

export const addMessage = async (msg, user) => {
	await axios.post(`${url}/api/messages`, { message: msg, user });
};

export const fetchMessagesInRoom = async (room) => {
	const { data: messages } = await axios.get(`${url}/api/messages`);
	return messages;
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
