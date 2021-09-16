import axios from 'axios';

export const fetchMessagesInRoom = async (room) => {
	const { data: messages } = await axios.get(`http://localhost:8080/api/messages/${room}`);
	return messages;
};
