import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateChatterlyStatus } from '../store/effects/thunks';
import signOutIcon from '../icons/signOutIcon.png';
import people from '../icons/people.png';
import { addMessage, disassociateUserAndRoom } from '../store/effects/utils';

class ChatHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			redirectToHome: false,
			redirectToHomeForRegisteredUser: false,
		};
		this.handleHeaderRoomName = this.handleHeaderRoomName.bind(this);
		this.handleRedirect = this.handleRedirect.bind(this);
		this.openParticipantsPanel = this.openParticipantsPanel.bind(this);
	}

	handleHeaderRoomName(name) {
		if (name.length > 20) {
			return ''.concat(name.slice(0, 20), '...');
		}
		return name;
	}

	openParticipantsPanel() {
		this.props.updateComponent('openParticipantsTab', !this.props.openParticipantsTab);
		this.props.socket.emit('refreshOnlineUsers', this.props.user);
	}

	async handleRedirect() {
		if (this.props.user.isGuest) {
			await addMessage(`${this.props.user.name} has left.`, this.props.chatBot);
			this.props.socket.emit('refreshOnlineUsers', this.props.user);
			this.props.socket.emit('sendDisconnectMessage', this.props.user);
			await disassociateUserAndRoom(this.props.user);
			this.props.socket.disconnect();
			this.props.socket.off();
			this.props.updateComponent('toggleGuestWarningPopup', false);
			this.setState({ redirectToHome: true });
		} else {
			this.setState({ redirectToHomeForRegisteredUser: true });
		}
	}

	render() {
		// this will handle the redirectToHome only AFTER we have handled the redirectLogic.
		if (this.state.redirectToHome) {
			window.localStorage.clear();
			return <Redirect to="/" />;
		}
		if (this.state.redirectToHomeForRegisteredUser) {
			return <Redirect to="/home" />;
		}
		return (
			<div className="chat-header-wrapper">
				<div className="left-side-header-container">
					<h3> {`Room: ${this.handleHeaderRoomName(this.props.roomName)}`}</h3>
				</div>
				<div className="right-side-header-container">
					<button className="no-style" onClick={this.openParticipantsPanel}>
						<img src={people} alt="participants button" />
					</button>
					<button className="no-style" onClick={this.handleRedirect}>
						<img src={signOutIcon} alt="sign out button" />
					</button>
				</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);
