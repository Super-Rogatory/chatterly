import React from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../store/effects/thunks';

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
		if (!this.isCurrentUser()) {
			this.setState({ senderUser: await this.props.getUser(this.props.message.userId) });
		}
	}
	isCurrentUser() {
		// the message in the this component may not always be tired to the user that was passed in.
		return this.props.user.id === this.props.message.userId;
	}

	render() {
		return this.isCurrentUser() ? (
			<div className="message-container user">
				<p className="user-sender-name">{this.props.user.name}</p>
				<div className="user-message-box">
					<p className="user-message-text">{this.props.message.text}</p>
				</div>
			</div>
		) : (
			<div className="message-container recipient">
				<div className="message-box">
					<p className="message-text">{this.props.message.text}</p>
				</div>
				<p className="sender-name">{this.state.senderUser.name}</p>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	getUser: (id) => dispatch(getUser(id)),
});

export default connect(null, mapDispatchToProps)(Message);
