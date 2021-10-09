import React from 'react';
import { Redirect } from 'react-router-dom';
import { setRoom, setName, createUser } from '../store/effects/thunks';
import { connect } from 'react-redux';
import { doesUserExist } from '../store/effects/utils';

class Home extends React.Component {
	// keeping track of name, room, and whether or not the input fields for name and room are false (handling the error in a boolean)
	constructor() {
		super();
		this.state = {
			name: '',
			room: '',
			nameError: false,
			roomError: false,
			errMessage: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleErrorCases = this.handleErrorCases.bind(this);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	async handleSubmit(e) {
		// handles erroneous input, if inputs check out - we can call setName and setRoom which will set name and room in the redux store
		// clears localStorage before sending
		// cancels normal behavior of the submit - does not submit

		e.preventDefault();
		window.localStorage.clear();
		const { name, room } = this.state;
		const nameIsTaken = await this.isNameFaulty(name);
		this.setState({ errMessage: '' }); // resets err message input every time
		if (nameIsTaken || !name || !room) {
			if (!name && !room) this.handleErrorCases('nameandroomempty');
			// if the name is populated but is taken, then check the conditions of the room field
			else if (nameIsTaken) {
				if (!room) this.handleErrorCases('nametakenandroomempty');
				if (room) this.handleErrorCases('nametakenandroomfull');
				this.setState({ errMessage: 'Sorry, this username is already taken. Choose another one!' });
			}
			// if the name is not taken, then we are going to default to two other possible issues. meaning, the name input field is empty or the room input field is empty
			else if (!name) this.handleErrorCases('nameempty');
			// if the name is not taken AND the name input field is populated, this means that the room input field is empty
			else if (!room) this.handleErrorCases('roomempty');
		} else {
			// at this point, our name and room fields are populated AND the name is not taken. Great. createUser now.
			try {
				const user = await this.props.createUser(name, room);
				window.localStorage.setItem('user', JSON.stringify({ id: user.id, name, room }));
				this.props.setName(name);
				this.props.setRoom(room);
				// recall that the component will rerender when props changes
			} catch (err) {
				console.error('AN ERROR HAS OCCURED. => ', err.stack);
				// this.setState({ errMessage: 'Sorry, an error has occured while creating user' });
			}
		}
	}

	async isNameFaulty(name) {
		// if we hit the api and determine that we already have a name in the database then return true, else return false
		// OR. if the user enters a name that is equal to the name of the moderator also return
		return (await doesUserExist(name)) || name.toLowerCase() === 'chatbot';
	}

	handleErrorCases(flag) {
		// if the name input is populated, check to see if room is
		switch (flag) {
			case 'nameandroomempty':
			case 'nametakenandroomempty':
				this.setState({ roomError: true, nameError: true });
				break;
			case 'nameempty':
			case 'nametakenandroomfull':
				this.setState({ roomError: false, nameError: true });
				break;
			case 'roomempty':
				this.setState({
					nameError: false,
					roomError: true,
				});
				break;
			default:
				this.setState({ roomError: false, nameError: false });
				break;
		}
	}

	render() {
		const { name, room, nameError, roomError } = this.state;
		if (window.localStorage.getItem('user')) {
			// to ensure that the same user is 'logged in' other rooms
			return <Redirect to="/chat" />;
		} else {
			return (
				<div id="vertical-container" className="ui grid middle aligned">
					<div className="row">
						<div className="column" align="middle">
							<div className="ui container">
								<div className="ui purple segment">
									<div className="ui centered large header">Join Chatterly</div>
									<form className="ui attached form" onSubmit={this.handleSubmit}>
										<div className={`field ${nameError ? 'error' : ''}`}>
											<label>Enter a username</label>
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
										<button type="submit" className="ui blue fluid button">
											Sign In
										</button>
									</form>
									{(nameError || roomError) && (
										<div className="ui bottom warning message">
											{this.state.errMessage || "Don't forget to enter both name and room."}
										</div>
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
	createUser: (name, room) => dispatch(createUser(name, room)),
});

const mapState = (state) => ({
	name: state.name,
	room: state.room,
});

export default connect(mapState, mapDispatch)(Home);

// TODOS:

// Final fishing touches!

// NOTE: if chatbot exists in room don't create another new one?
// Consider creating a chatbot ASSOCIATED to a user.

// NOTE: might consider removing all messages in a room when the chat room is empty.

// NOTE: fix formatting issues, not completely centered.
// NOTE: Optimize the program (way too much overhead from AJAX)

// MVP
// NOTE: ensure that new messages pop up correctly - DONE
// NOTE: might consider limiting character to 150 max (255) is the max on the server.
