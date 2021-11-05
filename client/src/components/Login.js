import React from 'react';
import Typewriter from 'typewriter-effect';
import chatterlylogo from '../icons/favicon.png';
import Loader from 'react-loader-spinner';

class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoaded: false,
		};
	}
	componentDidMount() {
		this.setState({ isLoaded: true });
	}
	render() {
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
								<div>
									<label>Enter your username!</label>
									<input placeholder="Username" name="username" type="text" onChange={this.handleChange} />
								</div>
							</div>
							<div className="user-auth-input-login">
								<div>
									<label>Enter your password!</label>
									<input placeholder="Password" name="password" type="password" onChange={this.handleChange} />
								</div>
							</div>
						</form>
					</div>

					<div className="login-buttons-wrapper">
						<button type="button" className="ui basic brown button" onClick={() => this.props.history.push('/')}>
							Back
						</button>

						<button type="submit" className="ui basic black button">
							Login
						</button>
					</div>

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

export default Login;
