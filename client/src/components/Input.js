import React from 'react';
import { connect } from 'react-redux';
import { addMessage } from '../store/effects/utils';

class Input extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleEnter = this.handleEnter.bind(this);
		this.sendMessageToRoom = this.sendMessageToRoom.bind(this);
	}

	async handleSubmit(e) {
		e.preventDefault();
		// passing this user along to addMessage so that our backend can take care of the association via Sequelize magic methods
		await addMessage(this.state.message, this.props.user);
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
			await this.handleSubmit(e);
			this.sendMessageToRoom(e);
		}
	}

	sendMessageToRoom() {
		// recall that handleChange is going to be manipulating this.state.message
		// we can actually check if this.state.message has input. we can also 'clear' the input box be setting the message string to '' in this method
		if (this.state.message) {
			// recall that we have an event listener on the server side
			this.props.socket.emit('addedMessage', this.props.user);
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

export default connect(null, null)(Input);
