import axios from 'axios';

const PORT = process.env.PORT || 5000;
const url = process.env.NODE_ENV === 'production' ? 'https://wechatterly.org' : `http://localhost:${PORT}`;

export const createUser = async (name, room) => {
	name = name.trim().toLowerCase();
	room = room.trim().toLowerCase();
	try {
		const { data: user } = await axios.post(`${url}/api/users`, { name, room });
		return user;
	} catch (err) {
		console.error(err);
	}
};

export const getUser = async (id) => {
	try {
		const { data: user } = await axios.get(`${url}/api/users/${id}`);
		return user;
	} catch (err) {
		console.error(err);
	}
};

export const getUserByName = async (name) => {
	try {
		const { data: user } = await axios.get(`${url}/api/users/misc/getUserByName/${name}`);
		return user;
	} catch (err) {
		console.error(err);
	}
};

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

export const getAllRoomsForUser = async (token, userId) => {
	const { data: rooms } = await axios.get(`${url}/api/rooms/all/${userId}`, {
		headers: {
			Authorization: token,
		},
	});
	return rooms;
};

export const associateUserAndRoom = async (user) => {
	await axios.put(`${url}/api/rooms`, { user, type: 'associate' });
};

export const disassociateUserAndRoom = async (user) => {
	await axios.put(`${url}/api/rooms`, { user, type: 'disassociate' });
};

export const getActiveUsers = async () => {
	const { data: count } = await axios.get(`${url}/api/users/misc/getUserCount`);
	return count;
};

export const updateUserStatus = async (user, typeObject = null) => {
	const { data: status } = await axios.post(`${url}/api/users/misc/updateUserStatus`, {
		name: user.name,
		type: typeObject ? typeObject.type : typeObject,
	});
	return status;
};

export const updateRegisteredUserRoom = async (id, room) => {
	const { data: user } = await axios.put(`${url}/api/users/misc/updateRegisteredUserRoom`, {
		id,
		room,
	});
	return user;
};

export const registerUser = async (username, password) => {
	const { data: user } = await axios.post(`${url}/api/users/register`, { username, password });
	return user;
};

export const validateUser = async (username, password) => {
	const { data } = await axios.post(`${url}/api/users/login`, { username, password });
	return data;
};

export const isTokenValid = async (token) => {
	const { data: status } = await axios.post(`${url}/api/users/misc/testingValidToken`, token, {
		headers: {
			Authorization: token,
		},
	});
	return status;
};
//  -------------------------------------------------------------------------------------------------------
export class ErrorHandlerForSignIns {
	constructor(context) {
		this.componentContext = context;
	}

	checkUserLoginInput(flag) {
		// reusing username and password empty for login. Login is only going to validate one at a time. Server-side validation.
		switch (flag) {
			case 'nameError':
				this.handleErrorCases('usernameempty');
				break;
			case 'passwordError':
				this.handleErrorCases('passwordempty');
				break;
			default:
				break;
		}
	}

	// handles red outline of invalid inputs. tl: sends message flag.
	checkUserRegisterInput(isUsernameTaken, isPasswordValid, username, password) {
		if (!username && !password) this.handleErrorCases('usernameandpasswordempty');
		else if (isUsernameTaken) {
			if (!password || !isPasswordValid) this.handleErrorCases('usernametakenandpasswordinvalid');
			if (isPasswordValid) this.handleErrorCases('usernametakenandpasswordvalid');
		} else if (!username) this.handleErrorCases('usernameempty');
		else if (!isPasswordValid) this.handleErrorCases('passwordempty');
	}

	// handles red outline of invalid inputs
	checkGuestErrorInput(nameIsTaken, name, room) {
		if (!name && !room) this.handleErrorCases('nameandroomempty');
		// if the name is populated but is taken, then check the conditions of the room field
		else if (nameIsTaken) {
			if (!room) this.handleErrorCases('nametakenandroomempty');
			if (room) this.handleErrorCases('nametakenandroomfull');
		}
		// if the name is not taken, then we are going to default to two other possible issues. meaning, the name input field is empty or the room input field is empty
		else if (!name) this.handleErrorCases('nameempty');
		// if the name is not taken AND the name input field is populated, this means that the room input field is empty
		else if (!room) this.handleErrorCases('roomempty');
	}

	// determines error status to conditionally render red outline in respective component inputs. tl turns certain flags on/off
	// ** HELPER METHOD **
	handleErrorCases(flag) {
		// if the name input is populated, check to see if room is
		switch (flag) {
			case 'nameandroomempty':
			case 'nametakenandroomempty':
				this.componentContext.setState({ roomError: true, nameError: true });
				break;
			case 'nameempty':
			case 'nametakenandroomfull':
				this.componentContext.setState({ roomError: false, nameError: true });
				break;
			case 'roomempty':
				this.componentContext.setState({
					nameError: false,
					roomError: true,
				});
				break;
			case 'usernameandpasswordempty':
			case 'usernametakenandpasswordinvalid':
				this.componentContext.setState({ usernameError: true, passwordError: true });
				break;
			case 'usernametakenandpasswordvalid':
			case 'usernameempty':
				this.componentContext.setState({ usernameError: true, passwordError: false });
				break;
			case 'passwordempty':
				this.componentContext.setState({ usernameError: false, passwordError: true });
				break;
			default:
				break;
		}
	}

	async isNameFaulty(name) {
		// if we hit the api and determine that we already have a name in the database then return true, else return false
		// OR. if the user enters a name that is equal to the name of the moderator also return
		return (await doesUserExist(name)) || name.toLowerCase() === 'chatbot';
	}

	basic8(password) {
		return password.length >= 8;
	}
}
//  -------------------------------------------------------------------------------------------------------
