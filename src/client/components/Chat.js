import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { addMessage, createUser, getUser, getUsers, getUsersInRoom } from '../../store/effects/thunks';
import ChatHeader from './ChatHeader';
import Input from './Input';
import MessageList from './MessageList';

let clientSocket;
clientSocket = io('localhost:8080');

class Chat extends React.Component {
	// constructor serves to keep track of the name, room, and the address to reference the server
	constructor() {
		super();
		this.state = {
			user: {},
			users: [],
		};
	}

	async componentDidMount() {
		// before anything, check to see if user object exists in localStorage and get information from Redux store
		const loggedInUser = window.localStorage.getItem('user');
		const { nameFromStore, roomFromStore, createUser, getUsersInRoom, getUser } = this.props;

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
			const user = JSON.parse(loggedInUser);
			const room = user.room;
			// once we parsed the loggedInUser, we can use the id to fetch the user from the db and continue as normal
			const dbUser = await getUser(user.id);
			// should return the users in the room
			const users = await getUsersInRoom(room);
			this.setState({ user: dbUser, users });
		} else {
			// using information from the Redux store, we can create a new user. If user does not exist when we try to getItem, setItem in localStorage and db.
			// name and room is set in the Home component.
			const user = await createUser(nameFromStore, roomFromStore);
			window.localStorage.setItem('user', JSON.stringify({ id: user.id, name: nameFromStore, room: roomFromStore }));
			this.setState({ user });
		}

		// we will modify the id to carry the socket.id
		// create the chatbot user
	}

	componentDidUpdate(prevProps) {
		// if prevState's properties change somehow, perform some action.
		const { user } = this.state;
		if (prevProps.nameFromStore !== this.props.nameFromStore || prevProps.roomFromStore !== this.props.roomFromStore) {
			clientSocket.emit('join', user, () => {});
		}
	}

	componentWillUnmount() {
		clientSocket.emit('disconnect');
		clientSocket.removeAllListeners();
		clientSocket.off();
	}

	render() {
		return (
			<div id="vertical-container" className="ui grid middle aligned">
				<div className="row">
					<div className="column" align="middle">
						<div className="ui container">
							<div className="white-background-container">
								<ChatHeader room={this.props.roomFromStore} />
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
