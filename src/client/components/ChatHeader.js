import React from 'react';
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import signOutIcon from '../icons/signOutIcon.png';

class ChatHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			handledRoomName: '',
			isLoading: false,
		};
		this.handleHeaderRoomName = this.handleHeaderRoomName.bind(this);
	}

	// componentDidMount() {
	// 	console.log(this.handleHeaderRoomName(this.props.room));
	// }

	// componentDidUpdate(prevProps, prevState) {
	// 	if (prevProps.room !== this.props.room) {
	// 		this.setState({ handledRoomName: this.handleHeaderRoomName(this.props.room), isLoading: false });
	// 	}
	// }

	handleHeaderRoomName(name) {
		if (name.length > 20) {
			return ''.concat(name.slice(0, 20), '...');
		}
		return name;
	}

	loading() {
		return <Loader type="Circles" />;
	}

	render() {
		if (this.state.isLoading) {
			return this.loading();
		} else {
			return (
				<div className="chat-header-wrapper">
					<div className="left-side-header-container">
						{/* place image of online dot */}
						<h3> {`Room: ${this.handleHeaderRoomName(this.props.room)}`}</h3>
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
}

export default ChatHeader;
