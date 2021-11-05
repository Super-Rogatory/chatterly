import React from 'react';
import Typewriter from 'typewriter-effect';
import chatterlylogo from '../icons/favicon.png';
import Loader from 'react-loader-spinner';
import { updateUserCount } from '../store/effects/thunks';
import { connect } from 'react-redux';
import { ErrorHandlerForSignIns, validateUser } from '../store/effects/utils';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			username: '',
			password: '',
			usernameError: false,
			passwordError: false,
			errMessages: '',
			errorHandler: new ErrorHandlerForSignIns(this),
			formFinishedLoading: true,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		window.localStorage.clear();
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
		const data = await validateUser(username, password);
		this.setState({ errMessage: '' }); // resets err message input every time
		if (!data.isUserValid) {
			// messages are handled server-side. checkUserLogin will flag input boxes based on information coming back from the server
			errorHandler.checkUserLoginInput(data.errorType);
			this.setState({ errMessage: data.msg });
		} else {
			// set local storage, etc, etc, load room selection page.
			const { token } = data.tokenObj;
			window.localStorage.setItem('token', JSON.stringify({ token }));
			this.props.history.push('/home');
		}
	}
	render() {
		const { username, password, usernameError, passwordError, errMessage } = this.state;

		if (!this.state.isLoaded) {
			return (
				<div id="vertical-container" className="center-content">
					<Loader type="ThreeDots" color="#d5a26c" />;
				</div>
			);
		}

		return (
			<div id="vertical-container" className="center-content">
				<div className="user-auth-form-background-login">
					<div className="chatterly-logo-wrapper">
						<img src={chatterlylogo} alt="logo" />
					</div>

					<div className="auth-form-login-title-wrapper">
						<span className="auth-form-typewriter-title">Welcome to Chatterly</span>
					</div>

					<div className="user-auth-login-form-wrapper">
						<form className="ui form error lowered-auth" autoComplete="off" onSubmit={this.handleSubmit}>
							<div className="user-auth-input-login">
								<div className={`field ${usernameError ? 'error' : ''}`}>
									<label>Enter your username!</label>
									<input
										placeholder="Username"
										name="username"
										value={username}
										type="text"
										onChange={this.handleChange}
									/>
								</div>
							</div>
							<div className="user-auth-input-login">
								<div className={`field ${passwordError ? 'error' : ''}`}>
									<label>Enter your password!</label>
									<input
										placeholder="Password"
										name="password"
										value={password}
										type="password"
										onChange={this.handleChange}
									/>
								</div>
							</div>
							<div className="login-buttons-wrapper">
								<button type="button" className="ui basic brown button" onClick={() => this.props.history.push('/')}>
									Back
								</button>

								<button type="submit" className="ui basic black button">
									Login
								</button>
							</div>
						</form>
					</div>
					{(usernameError || passwordError) && (
						<div className="ui bottom warning message">
							<p>{errMessage}</p>
						</div>
					)}

					<div className="typewriter-container-login">
						<Typewriter
							options={{
								strings: '< Chatterly >',
								cursor: '',
								autoStart: true,
								loop: false,
								wrapperClassName: 'auth-form-typewriter-title',
								skipAddStyles: true,
								pauseFor: 5000,
							}}
						/>
					</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
