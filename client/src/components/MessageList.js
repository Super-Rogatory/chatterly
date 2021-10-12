import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { fetchMessagesInRoom } from '../store/effects/utils';
import Message from './Message';

class MessageList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
		};
	}

	async componentDidMount() {
		this.props.socket.on('message', async (user) => {
			this.setState({ messages: await fetchMessagesInRoom(user.room) });
		});
	}

	render() {
		return (
			<ScrollToBottom className="messages">
				{this.state.messages.map((message, index) => (
					<div key={index}>
						<Message message={message} user={this.props.user} room={this.props.room} />
					</div>
				))}
			</ScrollToBottom>
		);
	}
}

export default MessageList;
