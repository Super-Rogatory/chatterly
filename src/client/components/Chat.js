import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { addMessage, createUser, getUser, getUsers, getUsersInRoom } from '../../store/effects/thunks';
import ChatHeader from './ChatHeader';
import Input from './Input';
import MessageList from './MessageList';
import { Redirect } from 'react-router-dom';

let clientSocket;
clientSocket = io('localhost:8080');

class Chat extends React.Component {
	// constructor serves to keep track of the name, room, and the address to reference the server
	constructor() {
		super();
		this.state = {
			user: {},
			isLoaded: false,
			noUser: false,
		};
		this.getUserRoom = this.getUserRoom.bind(this);
	}

	async componentDidMount() {
		// before anything, check to see if user object exists in localStorage and get information from Redux store
		const loggedInUser = window.localStorage.getItem('user');
		const { nameFromStore, roomFromStore, createUser, getUser } = this.props;

		// initialize chatbot to start!
		clientSocket.on('initializeChatbot', async ({ user: name, room, text: message }) => {
			try {
				// save chatbot message from socket to server
				const chatbot = await this.props.createUser(name, room);
				await this.props.addMessage(message, chatbot);
			} catch (err) {
				console.log('failed to initialize chatbot');
			}
		});

		// if user is already logged in, on refresh, set the state with the user object from localStorage and fetch users in the room
		if (loggedInUser) {
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
				clientSocket.emit('join', dbUser);
			} catch (err) {
				console.log(err);
			}
		} else {
			// using information from the Redux store, we can create a new user. If user does not exist when we try to getItem, setItem in localStorage and db.
			// name and room is set in the Home component.
			try {
				if (nameFromStore === '') {
					this.setState({ noUser: true });
					throw new Error('Name input cannot be empty');
				}

				const user = await createUser(nameFromStore, roomFromStore);
				if (!user) {
					// send user to home if object is deleted from localstorage.
					this.setState({ noUser: true });
				}
				// if user was created properly setItem in local storage and change state.
				window.localStorage.setItem('user', JSON.stringify({ id: user.id, name: nameFromStore, room: roomFromStore }));
				this.setState({ user });

				// initialize chatbot and officially join room after user is created.
				clientSocket.emit('join', user);
			} catch (err) {
				console.log(err);
			}
		}

		this.setState({ isLoaded: true });
	}

	componentWillUnmount() {
		clientSocket.emit('disconnect');
		clientSocket.removeAllListeners();
		clientSocket.off();
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
}

const mapDispatchToProps = (dispatch) => ({
	createUser: (name, room) => dispatch(createUser(name, room)),
	getUsersInRoom: (room) => dispatch(getUsersInRoom(room)),
	getUsers: () => dispatch(getUsers()),
	getUser: (id) => dispatch(getUser(id)),
	addMessage: (message, user) => dispatch(addMessage(message, user)),
});

const mapStateToProps = (state) => ({
	nameFromStore: state.name,
	roomFromStore: state.room,
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
