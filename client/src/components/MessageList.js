import React from 'react';
import { connect } from 'react-redux';
import ScrollToBottom from 'react-scroll-to-bottom';
import { fetchMessagesInRoom } from '../store/effects/utils';
import Message from './Message';

class MessageList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			initializedWelcome: false,
		};
	}

	componentDidMount() {
		this.props.socket.on('message', async (user) => {
			this.setState({ messages: await fetchMessagesInRoom(user.room) });
		});
	}

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
	room: state.room,
});

// const mapDispatchToProps = (dispatch) => ({
// 	addMessage: (msg, user) => dispatch(addMessage(msg, user)),
// 	fetchMessages: () => dispatch(fetchMessages()),
// });

export default connect(mapStateToProps, null)(MessageList);
