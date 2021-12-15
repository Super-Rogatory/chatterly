import React from 'react';
import { Redirect } from 'react-router-dom';
import { addMessage } from '../store/effects/utils';

class Input extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			errorState: false,
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
		try {
			await addMessage(this.state.message, this.props.user);
		} catch (err) {
			this.setState({ errorState: true });
		}
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	async handleClick(e) {
		// handles pointer click on Enter
		await this.handleSubmit(e);
		this.sendMessageToRoom(e);
	}

	async handleEnter(e) {
		// handles key click of Enter
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
		if (this.state.errorState) {
			return <Redirect to="/" />;
		}
		return (
			<form className="ui fluid action input chat" onSubmit={this.handleClick}>
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

export default Input;
