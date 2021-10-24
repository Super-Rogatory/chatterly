import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { fetchMessagesInRoom } from '../store/effects/utils';
import Message from './Message';
import UsersInRoom from './UsersInRoom';
import { connect } from 'react-redux';
import { updateChatterlyStatus } from '../store/effects/thunks';

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
			<div className="message-participants-wrapper-container">
				<ScrollToBottom className={`messages ${this.props.openParticipantsTab ? 'shorten' : 'full'}`}>
					{this.state.messages.map((message, index) => (
						<div className="message-container" key={index}>
							<Message message={message} user={this.props.user} room={this.props.room} />
						</div>
					))}
				</ScrollToBottom>

				{this.props.openParticipantsTab && (
					<ScrollToBottom className="participants">
						<UsersInRoom />
					</ScrollToBottom>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	openParticipantsTab: state.openParticipantsTab,
});

const mapDispatchToProps = (dispatch) => ({
	updateComponent: (type, status) => dispatch(updateChatterlyStatus(type, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
