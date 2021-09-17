import React from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../store/effects/thunks';

class Message extends React.Component {
	constructor(props) {
		super(props);
		this.isCurrentUser = this.isCurrentUser.bind(this);
		this.state = {
			isLoaded: false,
			senderUser: {},
		};
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
			<div className="message-container">
				<p className="user-sender-name">{this.props.user.name}</p>
			</div>
		) : (
			<div className="message-container">
				<p className="sender-name">{this.state.senderUser.name}</p>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	getUser: (id) => dispatch(getUser(id)),
});

export default connect(null, mapDispatchToProps)(Message);
