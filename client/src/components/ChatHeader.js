import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { deleteUser } from '../store/effects/thunks';
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
		// if (this.props.user.isGuest) {
		// 	// perhaps instead of deleting user immediately, you could delete all guests one hour after this point of unmounting - and their messages
		// 	// give a warning of this effect in select mode screen.
		// 	await this.props.deleteUser(this.props.user.id);
		// }
		this.setState({ redirectToHome: true });
	}

	render() {
		if (this.state.redirectToHome) {
			window.localStorage.clear();
			return <Redirect to="/" />;
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
});

export default connect(null, mapDispatchToProps)(ChatHeader);
