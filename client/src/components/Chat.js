import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import {
	addMessage,
	createUser,
	deleteUser,
	fetchMessages,
	getUser,
	getUsersInRoom,
	openRoom,
} from '../store/effects/thunks';
import ChatHeader from './ChatHeader';
import Input from './Input';
import MessageList from './MessageList';
import { Redirect } from 'react-router-dom';

const PORT = process.env.PORT || 5000;
const url = `http://localhost:${PORT}`;

class Chat extends React.Component {
	// constructor serves to keep track of the name, room, and the address to reference the server
	constructor() {
		super();
		this.state = {
			user: {},
			room: {},
			isLoaded: false,
			noUser: false,
			clientSocket: io(`${url}`),
		};
		this.getUserRoom = this.getUserRoom.bind(this);
	}

	async componentDidMount() {
		// before anything, check to see if user object exists in localStorage and get information from Redux store
		const loggedInUser = window.localStorage.getItem('user');
		const { getUser } = this.props;
		// assuming someone deletes from localstorage, then on refresh we can return to home.
		if (!loggedInUser) {
			this.setState({ noUser: true });
			return;
		}
		// initialize chatbot to start!
		this.state.clientSocket.on('initializeRoom', async ({ room: roomName, text: message }) => {
			// we want to open room once. If we handled a persistent user, don't open room again. This is handled in openRoom definition
			try {
				// save chatbot message from socket to server, room is an object with two properties - check api routes.
				// room will always have access to its chatbot. there is still only one chatbot.
				// if room is already open, that room is returned
				const room = await this.props.openRoom(roomName);
				this.state.clientSocket.emit('sendMessage', { user: room.chatBot, msg: message });
			} catch (err) {
				console.log('failed to initialize chatbot');
			}
		});

		// handles persistent user && user creation.
		// if user is already logged in, on refresh, set the state with the user object from localStorage and fetch users in the room
		// once we parsed the loggedInUser, we can use the id to fetch the user from the db and continue as normal
		try {
			const user = JSON.parse(loggedInUser);
			const dbUser = await getUser(user.id);

			if (!dbUser) {
				// send user back to home if local storage user cannot match with database user
				this.setState({ noUser: true });
				throw new Error('failed to fetch user information.');
			}
			// if everything went well, set state with user info.
			this.setState({ user: dbUser });
			// initialize chatbot and officially join room after user is created.
			this.state.clientSocket.emit('join', dbUser);
		} catch (err) {
			console.log(err);
		}

		// handles display of disconnect message
		this.state.clientSocket.on('disconnectMessage', async ({ text }) => {
			await this.props.addMessage(text, this.state.chatBot);
		});

		this.setState({ isLoaded: true });
	}

	async componentWillUnmount() {
		if (this.state.user.isGuest) {
			await this.props.deleteUser(this.state.user.id);
		}

		window.localStorage.clear();
		this.state.clientSocket.emit('sendDisconnectMessage', this.state.user);
		this.state.clientSocket.disconnect();
		this.state.clientSocket.off();
	}

	getUserRoom() {
		// makes sure that we can return the user.room after the page finishes re-rendering
		if (this.state.isLoaded) {
			return this.state.user.room;
		}
	}

	render() {
		if (this.state.noUser) {
			return <Redirect to="/" />;
		}

		if (!this.state.isLoaded) {
			return 'Loading...';
		} else {
			return (
				<div id="vertical-container" className="ui grid middle aligned">
					<div className="row">
						<div className="column" align="middle">
							<div className="ui container">
								<div className="white-background-container">
									<ChatHeader room={this.props.roomFromStore || this.getUserRoom()} />
									<MessageList socket={this.state.clientSocket} user={this.state.user} />
									<Input socket={this.state.clientSocket} user={this.state.user} />
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}

const mapDispatchToProps = (dispatch) => ({
	createUser: (name, room) => dispatch(createUser(name, room)),
	deleteUser: (id) => dispatch(deleteUser(id)),
	getUsersInRoom: (room) => dispatch(getUsersInRoom(room)),
	getUser: (id) => dispatch(getUser(id)),
	addMessage: (message, user) => dispatch(addMessage(message, user)),
	fetchMessages: () => dispatch(fetchMessages()),
	openRoom: (name) => dispatch(openRoom(name)),
});

const mapStateToProps = (state) => ({
	nameFromStore: state.name,
	roomFromStore: state.room,
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
