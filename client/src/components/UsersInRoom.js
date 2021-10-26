import React from 'react';
// import Loader from 'react-loader-spinner';
import { connect } from 'react-redux';
import { fetchUsersInRoom } from '../store/effects/thunks';

class UsersInRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
		};
	}
	async componentDidMount() {
		// fetch the active users in room (via a thunk perhaps)
		// this.setState({ users: await fetchUsersInRoom(this.props.user.room) });

		// [{}] an array of objects.
		// listen for new users when the room tab is open
		this.props.socket.on('refreshUserList', async (user) => {
			await this.props.fetchUsers(user.room);
		});

		this.setState({ isLoaded: true });
	}
	render() {
		return (
			<div className="participants-header-container">
				<div className="participants-header-wrapper">
					{!this.state.isLoaded ? (
						<div className="middle">
							<h3>Loading . . .</h3>
						</div>
					) : (
						<>
							<h2>{`Online - ${this.props.users.length}`}</h2>
							{this.props.users.map((user, index) => {
								return <h3 key={index}>{user.name}</h3>;
							})}
						</>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	users: state.users,
});

const mapDispatchToProps = (dispatch) => ({
	fetchUsers: (room) => dispatch(fetchUsersInRoom(room)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersInRoom);
