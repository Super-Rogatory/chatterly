import React from 'react';
import { Link } from 'react-router-dom';
import signOutIcon from '../icons/signOutIcon.png';

class ChatHeader extends React.Component {
	constructor(props) {
		super(props);
		this.handleHeaderRoomName = this.handleHeaderRoomName.bind(this);
	}

	handleHeaderRoomName(name) {
		if (name.length > 20) {
			return ''.concat(name.slice(0, 20), '...');
		}
		return name;
	}

	render() {
		return (
			<div className="chat-header-wrapper">
				<div className="left-side-header-container">
					<h3> {`Room: ${this.handleHeaderRoomName(this.props.room)}`}</h3>
				</div>
				<div className="right-side-header-container">
					<Link to="/" onClick={() => window.localStorage.clear()}>
						<img src={signOutIcon} alt="sign out button" />
					</Link>
				</div>
			</div>
		);
	}
}

export default ChatHeader;
