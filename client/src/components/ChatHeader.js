import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { deleteUser, updateChatterlyStatus } from '../store/effects/thunks';
import signOutIcon from '../icons/signOutIcon.png';
import { updateInactiveUser } from '../store/effects/utils';

class ChatHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			redirectToHome: false,
		};
		this.handleHeaderRoomName = this.handleHeaderRoomName.bind(this);
		this.handleRedirect = this.handleRedirect.bind(this);
	}

	handleHeaderRoomName(name) {
		if (name.length > 20) {
			return ''.concat(name.slice(0, 20), '...');
		}
		return name;
	}

	async handleRedirect() {
		// what if I used updateInactiveUser to change some property that forces rerender of count.
		this.props.updateComponent('toggleGuestWarningPopup', false);
		this.props.socket.emit('sendDisconnectMessage', this.props.user);
		// await updateInactiveUser(this.props.user);
		this.props.socket.disconnect();
		this.props.socket.off();
		this.setState({ redirectToHome: true });
	}

	render() {
		// this will handle the redirectToHome only AFTER we have handled the redirectLogic.
		console.log(this.state.redirectToHome);
		return (
			<div className="chat-header-wrapper">
				<div className="left-side-header-container">
					<h3> {`Room: ${this.handleHeaderRoomName(this.props.roomName)}`}</h3>
				</div>
				<div className="right-side-header-container">
					<button className="no-style" onClick={this.handleRedirect}>
						<img src={signOutIcon} alt="sign out button" />
					</button>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	deleteUser: (id) => dispatch(deleteUser(id)),
	updateComponent: (type, status) => dispatch(updateChatterlyStatus(type, status)),
});

export default connect(null, mapDispatchToProps)(ChatHeader);
