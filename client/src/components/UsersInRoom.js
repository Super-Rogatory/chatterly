import React from 'react';
import { fetchUsersInRoom } from '../store/effects/utils';

export default class UsersInRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
		};
	}
	async componentDidMount() {
		// fetch the active users in room (via a thunk perhaps)
		this.setState({ users: await fetchUsersInRoom(this.props.user.room) });

		// listen for new users when the room tab is open
		this.props.socket.on('refreshUserList', async (user) => {
			this.setState({ users: await fetchUsersInRoom(user.room) });
		});
		// [{}] an array of objects.
	}
	render() {
		return (
			<div className="participants-header-container">
				<div className="participants-header-wrapper">
					<h2>{`Online`}</h2>
					{this.state.users.map((user) => {
						return <h3>{user.name}</h3>;
					})}
				</div>
			</div>
		);
	}
}
