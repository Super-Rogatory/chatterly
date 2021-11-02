import axios from 'axios';

const PORT = process.env.PORT || 5000;
const url = process.env.NODE_ENV === 'production' ? 'https://wechatterly.herokuapp.com' : `http://localhost:${PORT}`;

export const createUser = async (name, room) => {
	name = name.trim().toLowerCase();
	room = room.trim().toLowerCase();
	try {
		const { data: user } = await axios.post(`${url}/api/users`, { name, room });
		return user;
	} catch (err) {
		console.log(err);
	}
};

export const getUser = async (id) => {
	try {
		const { data: user } = await axios.get(`${url}/api/users/${id}`);
		return user;
	} catch (err) {
		console.log(err);
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

export const updateInactiveUser = async (user) => {
	const { data: status } = await axios.post(`${url}/api/users/misc/decreaseUserCount`, { name: user.name });
	return status;
};

//  -------------------------------------------------------------------------------------------------------
export class ErrorHandlerForSignIns {
	constructor(context) {
		this.componentContext = context;
	}

	// handles red outline of invalid inputs
	checkUserErrorInput(isUsernameTaken, isPasswordValid, username, password) {
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
			this.componentContext.setState({ errMessage: 'Sorry, this username is already taken. Choose another one!' });
		}
		// if the name is not taken, then we are going to default to two other possible issues. meaning, the name input field is empty or the room input field is empty
		else if (!name) this.handleErrorCases('nameempty');
		// if the name is not taken AND the name input field is populated, this means that the room input field is empty
		else if (!room) this.handleErrorCases('roomempty');
	}

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
