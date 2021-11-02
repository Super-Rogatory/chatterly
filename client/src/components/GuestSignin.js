import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { updateChatterlyStatus } from '../store/effects/thunks';
import { connect } from 'react-redux';
import { createUser, ErrorHandlerForSignIns } from '../store/effects/utils';
import '../../src/index.scss';

class GuestSignIn extends React.Component {
	// keeping track of name, room, and whether or not the input fields for name and room are false (handling the error in a boolean)
	constructor() {
		super();
		this.state = {
			name: '',
			room: '',
			nameError: false,
			roomError: false,
			redirectToChat: false,
			errMessage: '',
			errorHandler: new ErrorHandlerForSignIns(this),
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		window.localStorage.clear();
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
		const { name, room, errorHandler } = this.state;
		const isNameTaken = await errorHandler.isNameFaulty(name);
		this.setState({ errMessage: '' }); // resets err message input every time
		// handles error message
		if (isNameTaken || !name || !room) {
			if (isNameTaken) {
				this.setState({ errMessage: 'Sorry, this username is already taken. Choose another one!' });
			}
			this.state.errorHandler.checkGuestErrorInput(isNameTaken, name, room);
		} else {
			// at this point, our name and room fields are populated AND the name is not taken. Great. createUser now.
			try {
				const user = await createUser(name, room);
				window.localStorage.setItem('user', JSON.stringify({ id: user.id, name, room }));
				this.setState({ redirectToChat: true });
			} catch (err) {
				console.error('AN ERROR HAS OCCURED. => ', err.stack);
				// this.setState({ errMessage: 'Sorry, an error has occured while creating user' });
			}
		}
	}

	componentWillUnmount() {
		this.props.updateComponent('toggleGuestWarningPopup', false);
	}

	render() {
		const { name, room, nameError, roomError, redirectToChat } = this.state;
		if (window.localStorage.getItem('user') || redirectToChat) {
			// to ensure that the same user is 'logged in' other rooms
			return <Redirect to="/chat" />;
		} else {
			return (
				<div id="vertical-container" className="middle">
					<div className="guest-login-background-container middle">
						<div className="ui centered large header">Join Chatterly</div>
						<form className="ui attached form" onSubmit={this.handleSubmit}>
							<div className={`field ${nameError ? 'error' : ''}`}>
								<label>Enter a username</label>
								<input placeholder="Enter Name" name="name" type="text" value={name} onChange={this.handleChange} />
							</div>
							<div className={`field ${roomError ? 'error' : ''}`}>
								<label>Enter a room name!</label>
								<input placeholder="Enter Room" name="room" type="text" value={room} onChange={this.handleChange} />
							</div>
							<Link to="/">
								<button type="button" className="ui basic left floated black button">
									Back
								</button>
							</Link>

							<button type="submit" className="ui basic right floated black button">
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
			);
		}
	}
}
const mapDispatchToProps = (dispatch) => ({
	updateComponent: (type, status) => dispatch(updateChatterlyStatus(type, status)),
});

export default connect(null, mapDispatchToProps)(GuestSignIn);

// TODOS:

// Final fishing touches!

// NOTE: might consider removing all messages in a room when the chat room is empty.
