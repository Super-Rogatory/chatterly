import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { deleteUser, togglePopup } from '../store/effects/thunks';
import signOutIcon from '../icons/signOutIcon.png';

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
		this.props.toggleGuestWarning(false);
		this.props.socket.emit('sendDisconnectMessage', this.props.user);
		this.props.socket.emit('updateActiveUserCount', { type: 'inactive', user: this.props.user });
		this.setState({ redirectToHome: true });
	}

	render() {
		if (this.state.redirectToHome) {
			window.localStorage.clear();
			this.props.socket.disconnect();
			this.props.socket.off();
			return (
				<Redirect
					to={{
						pathname: '/',
						state: { refreshUsers: true },
					}}
				/>
			);
		}
		return (
			<div className="chat-header-wrapper">
				<div className="left-side-header-container">
					<h3> {`Room: ${this.handleHeaderRoomName(this.props.roomName)}`}</h3>
				</div>
				<div className="right-side-header-container">
					<button className="no-style">
						<img src={signOutIcon} alt="sign out button" onClick={this.handleRedirect} />
					</button>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	deleteUser: (id) => dispatch(deleteUser(id)),
	toggleGuestWarning: (status) => dispatch(togglePopup(status)),
});

export default connect(null, mapDispatchToProps)(ChatHeader);
