import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import {
	addMessage,
	createUser,
	fetchMessages,
	getUser,
	getUsers,
	getUsersInRoom,
	initializeChatbot,
} from '../../store/effects/thunks';
import ChatHeader from './ChatHeader';

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
			message: '',
			messages: [],
			chatBot: {},
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleEnter = this.handleEnter.bind(this);
		this.sendMessageToRoom = this.sendMessageToRoom.bind(this);
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
				const messages = await this.props.fetchMessages();
				console.log(messages);
			} else {
				try {
					// save chatbot message from socket to server
					await this.props.initializeChatbot(message);
					this.setState({
						// chatBot: {
						// 	isChatBot: true,
						// 	name,
						// 	room,
						// 	message,
						// },
						messages: [...this.state.messages, message],
					});
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
		const { name, room, user, message, messages } = this.state;
		if (prevState.name !== name || prevState.room !== room) {
			clientSocket.emit('join', user, () => {});
		}
		// if (prevState.message !== message) {

		// }
		if (prevState.messages !== messages) {
			// the handleSubmit method is crucial. It allowed us to make a change to local state, which can then be conditionally checked for changes.
			// handles initializing chatBot and other messages. chatBot becomes a record in the db
			clientSocket.on('message', ({ user, text }) => {
				console.log('user information -> ' + user);
				console.log('text object -> ' + text);
			});
		}
	}

	componentWillUnmount() {
		clientSocket.emit('disconnect');
		clientSocket.off();
	}

	handleChange(e) {
		// the name of our input is message. computed property name syntax
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	async handleSubmit(e) {
		e.preventDefault();
		// passing this user along to addMessage so that our backend can take care of the association via Sequelize magic methods
		const { user, message } = this.state;
		const msgObjectFromThunk = await this.props.addMessage(message, user);
		this.setState({
			messages: [...this.state.messages, msgObjectFromThunk],
		});
		// note that userId is null on post but is satisfied on the get route for messages.
		// our thunk will turn message into an object via shorthand notation. ( {message:message, user: user} )
		// we provided a JSON object to the backend (well, axios did) as our server expects information in a JSON object
	}

	async handleClick(e) {
		await this.handleSubmit(e);
		this.sendMessageToRoom(e);
	}

	async handleEnter(e) {
		// may consider handling the case of pointer click. and then adding a new case.
		if (e.key === 'Enter') {
			console.log('enter');
			await this.handleSubmit(e);
			this.sendMessageToRoom(e);
		}
	}

	sendMessageToRoom(e) {
		e.preventDefault();
		// recall that handleChange is going to be manipulating this.state.message
		// we can actually check if this.state.message has input. we can also 'clear' the input box be setting the message string to '' in this method
		if (this.state.message) {
			// recall that we have an event listener on the server side
			clientSocket.emit('sendMessage', { user: this.state.user, message: this.state.message });
			// reset the message value (being tracked on input) to empty string.
			this.setState({ message: '' });
		}
	}

	render() {
		// console.log(this.state.messages);
		const { handleChange, handleClick, handleEnter } = this;
		const { message } = this.state;
		return (
			<div id="vertical-container" className="ui grid middle aligned">
				<div className="row">
					<div className="column" align="middle">
						<div className="ui container">
							<ChatHeader />
							{/* Need to flesh out the content */}
							{/* <form onSubmit={handleClick}>
								<input
									name="message"
									value={message}
									placeholder="Send a message!"
									onChange={handleChange}
									onKeyPress={handleEnter}
								/>
								<button type="submit">Send</button>
							</form> */}
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
	fetchMessages: () => dispatch(fetchMessages()),
	initializeChatbot: (message) => dispatch(initializeChatbot(message)),
});

const mapState = (state) => ({
	nameFromStore: state.name,
	roomFromStore: state.room,
});

export default connect(mapState, mapDispatch)(Chat);
