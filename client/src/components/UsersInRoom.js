import React from 'react';
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
		// [{}] an array of objects.
		// listen for new users when the room tab is open
	}
	render() {
		return (
			<div className="participants-header-container">
				<div className="participants-header-wrapper">
					<h2>{`Online - ${this.props.users.length}`}</h2>
					{this.props.users.map((user, index) => {
						return <h3 key={index}>{user.name}</h3>;
					})}
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
