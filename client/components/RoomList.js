import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

class RoomList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			disabledButton: false,
		};
	}

	async refreshRoomListAndDisable() {
		const { refreshFunction, jwt, user } = this.props;
		await refreshFunction(jwt, user);
		// setTimeout for disable - manage state
		this.setState({ disabledButton: true });
		setTimeout(() => {
			this.setState({ disabledButton: false });
		}, 6500);
	}

	render() {
		const { disabledButton } = this.state;
		return (
			<div className="room-list-container">
				<div className="room-header-menu">
					<div className="room-list-title">Room List</div>
					<div className="room-list-icon">
						<div className={`circular ui icon basic ${disabledButton ? 'disabled' : ' '} button removed-border`}>
							<button className={'refresh-img'}>
								<img src={this.props.refreshIcon} alt="refresh icon" onClick={() => this.refreshRoomListAndDisable()} />
							</button>
						</div>
					</div>
				</div>
				<div className="room-main-content">
					<ScrollToBottom className="rooms">
						{this.props.rooms.map((name, index) => (
							<li key={index} className="">
								{name}
							</li>
						))}
					</ScrollToBottom>
				</div>
			</div>
		);
	}
}

export default RoomList;
