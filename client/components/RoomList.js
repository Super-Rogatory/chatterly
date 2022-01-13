import React from 'react';

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
			</div>
		);
	}
}

export default RoomList;
