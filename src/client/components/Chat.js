import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import {
	addMessage,
	createUser,
	getUser,
	getUsers,
	getUsersInRoom,
	initializeChatbot,
} from '../../store/effects/thunks';
import ChatHeader from './ChatHeader';
import Input from './Input';
import MessageList from './MessageList';

let clientSocket;

class Chat extends React.Component {
	// constructor serves to keep track of the name, room, and the address to reference the server
	constructor() {
		super();
		this.state = {
			name: '',
			room: '',
			ENDPOINT: 'localhost:8080',
			user: {},
			users: [],
		};
	}

	async componentDidMount() {
		// before anything, check to see if user object exists in localStorage and get information from Redux store
		const loggedInUser = window.localStorage.getItem('user');
		const { nameFromStore, roomFromStore, createUser, getUsersInRoom, getUser } = this.props;

		// initializes global socket on mount
		clientSocket = io(this.state.ENDPOINT);

		// initialize chatbot to start!
		clientSocket.on('initializeChatbot', async ({ user: name, room, text: message }) => {
			if (loggedInUser) {
				// on refresh initialize chatbot again
				await this.props.initializeChatbot(message);
			} else {
				try {
					// save chatbot message from socket to server
					await this.props.initializeChatbot(message);
				} catch (err) {
					console.log('failed to initialize chatbot');
				}
			}
		});

		// if user is already logged in, on refresh, set the state with the user object from localStorage and fetch users in the room
		if (loggedInUser) {
			// note. if the user is already logged in, we cannot rely on logic from lines 30+. And our Redux store will not persist. We can set this up from the db, or localStorage
			const user = JSON.parse(loggedInUser);
			const room = user.room;
			// once we parsed the loggedInUser, we can use the id to fetch the user from the db and continue as normal
			const dbUser = await getUser(user.id);
			// should return the users in the room
			const users = await getUsersInRoom(room);
			this.setState({ user: dbUser, users, name: user.name, room: user.room });
		} else {
			// using information from the Redux store, we can create a new user. If user does not exist when we try to getItem, setItem in localStorage and db.
			// name and room is set in the Home component.
			const user = await createUser(nameFromStore, roomFromStore);
			window.localStorage.setItem('user', JSON.stringify({ id: user.id, name: nameFromStore, room: roomFromStore }));
			this.setState({ name: user.name, room: user.room, user });
		}

		// we will modify the id to carry the socket.id
		// create the chatbot user
	}

	componentDidUpdate(prevProps, prevState) {
		// if prevState's properties change somehow, perform some action.
		const { name, room, user } = this.state;
		if (prevState.name !== name || prevState.room !== room) {
			clientSocket.emit('join', user, () => {});
		}
	}

	componentWillUnmount() {
		clientSocket.emit('disconnect');
		clientSocket.off();
	}

	render() {
		return (
			<div id="vertical-container" className="ui grid middle aligned">
				<div className="row">
					<div className="column" align="middle">
						<div className="ui container">
							<div className="white-background-container">
								<ChatHeader room={this.state.room} />
								<MessageList socket={clientSocket} user={this.state.user} />
								<Input socket={clientSocket} user={this.state.user} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapDispatch = (dispatch) => ({
	createUser: (name, room) => dispatch(createUser(name, room)),
	getUsersInRoom: (room) => dispatch(getUsersInRoom(room)),
	getUsers: () => dispatch(getUsers()),
	getUser: (id) => dispatch(getUser(id)),
	addMessage: (message, user) => dispatch(addMessage(message, user)),
	initializeChatbot: (message) => dispatch(initializeChatbot(message)),
});

const mapState = (state) => ({
	nameFromStore: state.name,
	roomFromStore: state.room,
});

export default connect(mapState, mapDispatch)(Chat);
