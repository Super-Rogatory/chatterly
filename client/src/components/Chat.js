import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { deleteUser, getUser, updateChatterlyStatus } from '../store/effects/thunks';
import ChatHeader from './ChatHeader';
import Input from './Input';
import MessageList from './MessageList';
import { Redirect } from 'react-router-dom';
import { addMessage, associateUserAndRoom, openRoom, updateInactiveUser } from '../store/effects/utils';
import Loader from 'react-loader-spinner';

const PORT = process.env.PORT || 5000;
const url = process.env.NODE_ENV === 'production' ? 'https://wechatterly.herokuapp.com' : `http://localhost:${PORT}`;

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
			// room will always have access to its chatbot. there is only one chatbot PER ROOM. if room is already open, that room is returned
			this.setState({ room: await openRoom(this.state.user.room) });
			// associate user with appropriate room
			await associateUserAndRoom(this.state.user);
			// initialize chatbot and officially join room after user is created.
			this.state.clientSocket.emit('join', this.state.user);
		} catch (err) {
			console.log(err);
		}

		// initialize chatbot to start!
		this.state.clientSocket.on('initializeChatbot', async ({ text: message }) => {
			// we want to open room once. If we handled a persistent user, don't open room again. This is handled in openRoom definition
			try {
				// after opening room, save message in db.
				await addMessage(message, this.state.room.chatBot);
				// trigger message list refresh, we should then be able to fetch after this.
				this.state.clientSocket.emit('addedMessage', this.state.room.chatBot);
				this.state.clientSocket.emit('refreshOnlineUsers', this.state.user);
			} catch (err) {
				console.log('failed to initialize chatbot');
			}
		});

		// handles display of disconnect message
		this.state.clientSocket.on('disconnectMessage', async ({ text }) => {
			await addMessage(text, this.state.room.chatBot);
			this.state.clientSocket.emit('addedMessage', this.state.room.chatBot);
		});

		this.setState({ isLoaded: true });
	}

	componentWillUnmount() {
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
		// if you try to fetch user from the database and it has been auto deleted (w/ respect to time duration) send user to home with guest expired messasge
		if (this.state.noUser) {
			window.localStorage.clear();
			this.props.updateComponent('toggleGuestExpiredPopup', true);
			return <Redirect to="/" />;
		}
		if (!this.state.isLoaded) {
			return (
				<div id="vertical-container" className="ui grid middle aligned">
					<div className="middle">
						<Loader type="ThreeDots" color="#d5a26c" />;
					</div>
				</div>
			);
		} else {
			return (
				<div id="vertical-container" className="chatroom-container">
					<div className="chatroom-wapper" align="middle">
						<div className="ui container">
							<div className="white-background-container">
								<ChatHeader
									socket={this.state.clientSocket}
									roomName={this.props.roomFromStore || this.getUserRoom()}
									user={this.state.user}
								/>
								<MessageList socket={this.state.clientSocket} user={this.state.user} room={this.state.room} />
								<Input socket={this.state.clientSocket} user={this.state.user} />
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}

const mapStateToProps = (state) => ({
	nameFromStore: state.name,
	roomFromStore: state.room,
});

const mapDispatchToProps = (dispatch) => ({
	deleteUser: (id) => dispatch(deleteUser(id)),
	getUser: (id) => dispatch(getUser(id)),
	updateComponent: (type, status) => dispatch(updateChatterlyStatus(type, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
