import axios from 'axios';

const PORT = process.env.PORT || 5000;
const url = `http://localhost:${PORT}`;

export const fetchMessagesInRoom = async (room) => {
	const { data: messages } = await axios.get(`${url}/api/messages/${room}`);
	return messages;
};

export const canAddUser = async (name) => {
	if (!name) return false;
	const { data: isNameTaken } = await axios.get(`${url}/api/users/misc/${name}`);
	return isNameTaken;
};

export const getRoom = async (id) => {
	const { data: room } = await axios.get(`${url}/api/rooms/${id}`);
	return room;
};
