import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

class RoomList extends React.Component {
	render() {
		return (
			<div className="room-list-container">
				<div className="room-header-menu">
					<div className="room-list-title">Room List</div>
					<div className="room-list-icon">
						<button className="refresh-img">
							<img src={this.props.refreshIcon} alt="refresh icon" />
						</button>
					</div>
				</div>
				<div className="room-main-content">
					<ScrollToBottom>
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
