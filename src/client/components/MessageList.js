import React from 'react';
import { connect } from 'react-redux';
import ScrollToBottom from 'react-scroll-to-bottom';
import { fetchMessages } from '../../store/effects/thunks';
import { fetchMessagesInRoom } from '../../store/effects/utils';
import Message from './Message';

class MessageList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
		};
	}

	async componentDidUpdate(prevProps, prevState) {
		if (prevProps.messages !== this.props.messages) {
			// the handleSubmit method is crucial. It allowed us to make a change to local state, which can then be conditionally checked for changes.
			// handles initializing chatBot and other messages. chatBot becomes a record in the db
			// this.setState({ isLoaded: true });
			// this.setState({ messages: await this.props.fetchMessages() });
			const messages = await fetchMessagesInRoom(this.props.user.room);
			this.setState({ messages });
		}
	}

	render() {
		return (
			<ScrollToBottom>
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
	fetchMessages: () => dispatch(fetchMessages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
