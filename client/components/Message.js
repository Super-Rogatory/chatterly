import React from 'react';
import { getUser } from '../store/effects/utils';

class Message extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			senderUser: {},
		};
		this.isCurrentUser = this.isCurrentUser.bind(this);
	}

	async componentDidMount() {
		// if our drilled user does not own the message, get the user from the message's userId
		if (!this.isCurrentUser()) {
			if (this.props.message.userId === null) {
				this.setState({ senderUser: this.props.room.chatBot });
			} else this.setState({ senderUser: await getUser(this.props.message.userId) });
		}
		// signify that getUser request and all other functionality has finished.
		this.setState({ isLoaded: true });
	}

	isChatBot(user) {
		return user.name === 'chatbot';
	}

	isCurrentUser() {
		// the message in the this component may not always be tired to the user that was passed in.
		return this.props.user.id === this.props.message.userId;
	}

	getCurrentUser(senderObject1, senderObject2) {
		if (!senderObject1 || !senderObject2) {
			alert('Server error. Please exit the room and re-enter.');
		}
		if (Object.keys(senderObject1).length) return senderObject1;
		return senderObject2;
	}

	render() {
		if (!this.state.isLoaded) {
			return '';
		} else {
			// if the message is not attached to the current user, it will take the userId of the message to find the real user.
			// hence, if this.state.senderUser exists..resolve that value instead of this.props.user. this.props.user will always exist.
			const currentUser = this.getCurrentUser(this.state.senderUser, this.props.user);
			return (
				<>
					<p className="sender-name">{`${currentUser.name}:`}</p>
					<div className="message-box">
						<p className={`message-text ${this.isChatBot(currentUser) ? '' : 'blue'}`}>{this.props.message.text}</p>
					</div>
				</>
			);
		}
	}
}

export default Message;
