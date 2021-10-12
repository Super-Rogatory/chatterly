import React from 'react';
import { Redirect } from 'react-router-dom';
import signOutIcon from '../icons/signOutIcon.png';

class ChatHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			redirectToHome: false,
		};
		this.handleHeaderRoomName = this.handleHeaderRoomName.bind(this);
	}

	handleHeaderRoomName(name) {
		if (name.length > 20) {
			return ''.concat(name.slice(0, 20), '...');
		}
		return name;
	}

	render() {
		if (this.state.redirectToHome) {
			window.localStorage.clear();
			return <Redirect to="/" />;
		}
		return (
			<div className="chat-header-wrapper">
				<div className="left-side-header-container">
					<h3> {`Room: ${this.handleHeaderRoomName(this.props.room)}`}</h3>
				</div>
				<div className="right-side-header-container">
					<button className="no-style">
						<img src={signOutIcon} alt="sign out button" onClick={() => this.setState({ redirectToHome: true })} />
					</button>
				</div>
			</div>
		);
	}
}

export default ChatHeader;
