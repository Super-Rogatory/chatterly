import React from 'react';
import { Link } from 'react-router-dom';
import signOutIcon from '../icons/signOutIcon.png';

class ChatHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
		};
		this.handleHeaderRoomName = this.handleHeaderRoomName.bind(this);
	}

	handleHeaderRoomName(name) {
		if (name.length > 10) {
			return ''.concat(name.slice(0, 10), '...');
		}
		return name;
	}

	render() {
		return (
			<div className="chat-header-wrapper">
				<div className="left-side-header-container">
					{/* place image of online dot */}
					<h3># Gang</h3>
				</div>
				<div className="right-side-header-container">
					<Link to="/">
						<img src={signOutIcon} alt="sign out button" />{' '}
					</Link>
				</div>
			</div>
		);
	}
}

export default ChatHeader;
