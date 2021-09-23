import React from 'react';
import { connect } from 'react-redux';
import { addMessage, fetchMessages } from '../../store/effects/thunks';

class Input extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			messages: [],
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleEnter = this.handleEnter.bind(this);
		this.sendMessageToRoom = this.sendMessageToRoom.bind(this);
	}

	componentDidUpdate(prevProps) {
		// if prevState's properties change somehow, perform some action.
		if (prevProps.messages !== this.props.messages) {
			// the handleSubmit method is crucial. It allowed us to make a change to local state, which can then be conditionally checked for changes.
			// handles initializing chatBot and other messages. chatBot becomes a record in the db
			this.props.socket.on('message', ({ user, text }) => {
				// console.log('user information -> ' + user);
				// console.log('text object -> ' + text);
			});
		}
	}

	async handleSubmit(e) {
		e.preventDefault();
		// passing this user along to addMessage so that our backend can take care of the association via Sequelize magic methods
		await this.props.addMessage(this.state.message, this.props.user);
		// note that userId is null on post but is satisfied on the get route for messages.
		// our thunk will turn message into an object via shorthand notation. ( {message:message, user: user} )
		// we provided a JSON object to the backend (well, axios did) as our server expects information in a JSON object
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
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
		// recall that handleChange is going to be manipulating this.state.message
		// we can actually check if this.state.message has input. we can also 'clear' the input box be setting the message string to '' in this method
		if (this.state.message) {
			// recall that we have an event listener on the server side
			this.props.socket.emit('sendMessage', { user: this.props.user, message: this.state.message });
			// reset the message value (being tracked on input) to empty string.
			this.setState({ message: '' });
		}
	}

	render() {
		return (
			<form className="ui fluid action input" onSubmit={this.handleClick}>
				<input
					type="text"
					value={this.state.message}
					name="message"
					placeholder="Enter a message..."
					onChange={this.handleChange}
					onKeyPress={this.handleEnter}
				/>
				<button className="ui basic button">Enter</button>
			</form>
		);
	}
}

const mapStateToProps = (state) => ({
	messages: state.messages,
});

const mapDispatchToProps = (dispatch) => ({
	addMessage: (msg, user) => dispatch(addMessage(msg, user)),
	fetchMessages: () => dispatch(fetchMessages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Input);
