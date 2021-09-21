import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { setRoom, setName } from '../../store/effects/thunks';
import { connect } from 'react-redux';

class Home extends React.Component {
	// keeping track of name, room, and whether or not the input fields for name and room are false (handling the error in a boolean)
	constructor() {
		super();
		this.state = {
			name: '',
			room: '',
			nameError: false,
			roomError: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	handleSubmit(e) {
		// handles erroneous input, if inputs check out - we can call setName and setRoom which will set name and room in the redux store
		// clears localStorage before sending
		window.localStorage.clear();
		const { name, room } = this.state;
		if (!name || !room) {
			e.preventDefault();
			if (room) this.setState({ nameError: true, roomError: false });
			else if (name) this.setState({ roomError: true, nameError: false });
			else this.setState({ nameError: true, roomError: true });
		} else {
			this.props.setName(name);
			this.props.setRoom(room);
		}
	}

	render() {
		const { name, room, nameError, roomError } = this.state;
		if (window.localStorage.getItem('user')) {
			// to ensure that the same user is 'logged in' other rooms
			const data = window.localStorage.getItem('user');
			const user = JSON.parse(data);
			this.props.setName(user.name);
			this.props.setRoom(user.room);
			return <Redirect to="/chat" />;
		} else {
			return (
				<div id="vertical-container" className="ui grid middle aligned">
					<div className="row">
						<div className="column" align="middle">
							<div className="ui container">
								<div className="ui purple segment">
									<div className="ui centered large header">Join Chatterly</div>
									<form className="ui attached form">
										<div className={`field ${nameError ? 'error' : ''}`}>
											<label>Enter a name</label>
											<input
												placeholder="Enter Name"
												name="name"
												type="text"
												value={name}
												onChange={this.handleChange}
											/>
										</div>
										<div className={`field ${roomError ? 'error' : ''}`}>
											<label>Join a room!</label>
											<input
												placeholder="Enter Room"
												name="room"
												type="text"
												value={room}
												onChange={this.handleChange}
											/>
										</div>
										<Link to="/chat" onClick={this.handleSubmit}>
											<button type="submit" className="ui blue fluid button">
												Sign In
											</button>
										</Link>
									</form>
									{(nameError || roomError) && (
										<div className="ui bottom warning message">Don't forget to enter both name and room.</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}
const mapDispatch = (dispatch) => ({
	setRoom: (room) => dispatch(setRoom(room)),
	setName: (name) => dispatch(setName(name)),
});

const mapState = (state) => ({
	name: state.name,
	room: state.room,
});

export default connect(mapState, mapDispatch)(Home);

// TODOS:

// NOTE: there are issues with local storage. If two tabs are opened at the same time, logging in on one tab will set localStorage for every tab on the browser.
// This means that every tab on the browser will have the same user info as the first person. Meaning our setName and setRoom will actually set the
// information from Redux store. However, our getUser will end up getting the wrong information.

// NOTE: if chatbot exists in room don't create another new one?

// NOTE: might consider removing all messages in a room when the chat room is empty.
