import React from 'react';
import { connect } from 'react-redux';
import ScrollToBottom from 'react-scroll-to-bottom';
import { addMessage, fetchMessages } from '../store/effects/thunks';
import { fetchMessagesInRoom } from '../store/effects/utils';
import Message from './Message';

class MessageList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
		};
	}

	componentDidMount() {
		this.props.socket.on('message', async ({ user, msg }) => {
			await this.props.addMessage(msg, user);
			const messages = await fetchMessagesInRoom(user.room);
			console.log(messages);
			// this.setState({ messages });
		});
	}

	// async componentDidUpdate(prevProps) {
	// 	if (prevProps.messages !== this.props.messages) {
	// 		// fetching messages from room allows us to see the userId that is attached to each message.
	// 		const messages = await fetchMessagesInRoom(this.props.user.room);
	// 		this.setState({ messages });
	// 	}
	// }

	render() {
		return (
			<ScrollToBottom className="messages">
				{this.state.messages.map((message, index) => (
					<div key={index}>
						<Message message={message} user={this.props.user} />
					</div>
				))}
			</ScrollToBottom>
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
