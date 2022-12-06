import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { fetchUsersInRoom, updateChatterlyStatus, updateUserCount } from '../store/effects/thunks';
import ChatHeader from './ChatHeader';
import Input from './Input';
import MessageList from './MessageList';
import { Redirect } from 'react-router-dom';
import { addMessage, associateUserAndRoom, openRoom, updateUserStatus } from '../store/effects/utils';
import { getUser } from '../store/effects/utils';
import Loader from 'react-loader-spinner';

const PORT = process.env.PORT || 5000;
const url = process.env.NODE_ENV === 'production' ? 'https://wechatterly.com' : `http://localhost:${PORT}`;

class Chat extends React.Component {
	// constructor serves to keep track of the name, room, and the address to reference the server
	constructor() {
		super();
		this.state = {
			user: {},
			room: {},
			isLoaded: false,
			noUser: false,
			activeUsers: [],
			clientSocket: io(`${url}`),
		};
		this.getUserRoom = this.getUserRoom.bind(this);
	}

	async componentDidMount() {
		// if for some reason the interval is STILL running, stop it here.
		if (!this.props.intervalId.isClear) {
			this.props.updateUserCount('clearInterval', this.props.intervalId);
		}

		// before anything, check to see if user object exists in localStorage and get information from Redux store
		const loggedInUser = window.localStorage.getItem('user');
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

		// initialize chatbot to start! disables duplicate messages. only listens once
		this.state.clientSocket.once('initializeChatbot', async ({ text: message }) => {
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

		// update online users array slice of redux store
		this.state.clientSocket.on('refreshUserList', async (user) => {
			const users = await this.props.fetchUsers(user.room);
			// allows users in room, access to the array of active users
			this.setState({ activeUsers: users.activeUsers });
		});

		// handles display of disconnect message - on disconnect -
		this.state.clientSocket.on('disconnectMessage', () => {
			this.state.clientSocket.emit('addedMessage', this.state.room.chatBot);
			this.state.clientSocket.emit('refreshOnlineUsers', this.state.user);
		});

		// fetch the active users in room (via a thunk perhaps). this will change the users property on the state to make sure that usersInRoom is ready to display it without making
		// the AJAX request there
		this.props.fetchUsers(this.state.user.room);
		this.setState({ isLoaded: true });
	}

	async componentWillUnmount() {
		if (this.state.user.isGuest) {
			await updateUserStatus(this.state.user);
		}
		this.state.clientSocket.emit('refreshOnlineUsers', this.state.user);
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
							<div className="brown-background-container">
								<ChatHeader
									socket={this.state.clientSocket}
									roomName={this.state.user.room || this.getUserRoom()}
									user={this.state.user}
									chatBot={this.state.room.chatBot}
								/>
								<MessageList
									socket={this.state.clientSocket}
									user={this.state.user}
									room={this.state.room}
									activeUsers={this.state.activeUsers}
								/>
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
	intervalId: state.intervalId,
	users: state.users,
});

const mapDispatchToProps = (dispatch) => ({
	updateComponent: (type, status) => dispatch(updateChatterlyStatus(type, status)),
	updateUserCount: (type, intervalId) => dispatch(updateUserCount(type, intervalId)),
	fetchUsers: (room) => dispatch(fetchUsersInRoom(room)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
