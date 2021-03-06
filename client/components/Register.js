import React from 'react';
import people from '../icons/people.png';
import Loader from 'react-loader-spinner';
import { connect } from 'react-redux';
import { updateUserCount } from '../store/effects/thunks';
import { ErrorHandlerForSignIns, registerUser } from '../store/effects/utils';
import { Redirect } from 'react-router-dom';

class Register extends React.Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
			usernameError: false,
			passwordError: false,
			isLoaded: false,
			errMessages: [''],
			errorHandler: new ErrorHandlerForSignIns(this),
			redirectToLogin: false,
			isLogoReady: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		window.localStorage.clear();
		// this functionality ensures that the register panel loads with the image.
		// when the picture is finished loading, update component state.
		const img = new Image();
		img.onload = () => {
			this.setState({ isLogoReady: true });
		};
		img.src = people;

		this.props.updateUserCount('clearInterval', this.props.intervalId);
		this.setState({ isLoaded: true });
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	async handleSubmit(e) {
		e.preventDefault();
		const { username, password, errorHandler } = this.state;
		const isUsernameTaken = await errorHandler.isNameFaulty(username);
		const isPasswordValid = errorHandler.basic8(password);
		this.setState({ errMessages: [] }); // resets err message input every time
		// handles error messages
		if (isUsernameTaken || !isPasswordValid || !username || !password) {
			if (!username) {
				this.setState({
					errMessages: [...this.state.errMessages, "Don't forget to enter both username and password."],
				});
			}
			if (isUsernameTaken) {
				this.setState({
					errMessages: [...this.state.errMessages, 'Sorry, this username is already taken. Choose another one!'],
				});
			}
			if (!isPasswordValid || !password) {
				this.setState({
					errMessages: [...this.state.errMessages, 'Password must have at least eight characters in it.'],
				});
			}
			// turns on flags for erroneous input
			errorHandler.checkUserRegisterInput(isUsernameTaken, isPasswordValid, username, password);
		} else {
			await registerUser(username, password);
			this.setState({ redirectToLogin: true });
		}
	}

	render() {
		const { username, password, usernameError, passwordError } = this.state;
		if (this.state.redirectToLogin) {
			// actually redirect to login
			return <Redirect to="/signin" />;
		}
		if (!this.state.isLoaded || !this.state.isLogoReady) {
			return (
				<div id="vertical-container" className="center-content">
					<Loader type="ThreeDots" color="#d5a26c" />;
				</div>
			);
		}
		return (
			<div id="vertical-container" className="center-content">
				<div className="user-auth-form-background">
					<div className="ui centered large header">Create your Chatterly Account</div>
					<div className="user-auth-guest-wrapper">
						<form className="ui attached form error lowered" autoComplete="off" onSubmit={this.handleSubmit}>
							<div className="user-auth-input">
								<div className={`field ${usernameError ? 'error' : ''}`}>
									<label>Enter your username!</label>
									<input
										placeholder="Username"
										name="username"
										type="text"
										value={username}
										onChange={this.handleChange}
									/>
								</div>
							</div>
							<div className="user-auth-input">
								<div className={`field ${passwordError ? 'error' : ''}`}>
									<label>Enter your password!</label>
									<input
										placeholder="Password"
										name="password"
										type="password"
										value={password}
										onChange={this.handleChange}
									/>
								</div>
							</div>
							<div className="register-buttons-wrapper">
								<button
									type="button"
									className="ui basic left floated brown button"
									onClick={() => this.props.history.push('/')}
								>
									Back
								</button>

								<button type="submit" className="ui basic right floated black button">
									Register
								</button>
							</div>
						</form>
						<div className="img-with-form">
							<img src={people} alt="Participants button" />
						</div>
					</div>
					{(usernameError || passwordError) && (
						<div className="ui bottom warning message">
							{this.state.errMessages.map((errMessage, index) => (
								<p key={index}>{errMessage}</p>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	intervalId: state.intervalId,
});

const mapDispatchToProps = (dispatch) => ({
	updateUserCount: (type, intervalId) => dispatch(updateUserCount(type, intervalId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
