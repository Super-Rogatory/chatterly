import React from 'react';
import { connect } from 'react-redux';
import { updateUserCount } from '../store/effects/thunks';
import people from '../icons/people.png';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';

class Register extends React.Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
			isLoaded: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		window.localStorage.clear();
		if (!this.props.intervalId.isClear) {
			this.props.updateUserCount('clearInterval', this.props.intervalId);
		}
		this.setState({ isLoaded: true });
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	async handleSubmit(e) {
		e.preventDefault();
		const { username, password } = this.state;
	}

	render() {
		const { username, password, usernameError, passwordError } = this.state;
		if (!this.state.isLoaded) {
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
						<form className="ui attached form lowered" autoComplete="off" onSubmit={this.handleSubmit}>
							<div className="user-auth-input">
								<label>Enter your username!</label>
								<input
									placeholder="Username"
									name="username"
									type="text"
									value={username}
									onChange={this.handleChange}
								/>
							</div>
							<div className="user-auth-input">
								<label>Enter your password!</label>
								<input
									placeholder="Password"
									name="password"
									type="password"
									value={password}
									onChange={this.handleChange}
								/>
							</div>
							<div>
								<Link to="/">
									<button type="button" className="ui basic left floated black button">
										Back
									</button>
								</Link>
								<button type="submit" className="ui basic right floated black button">
									Register
								</button>
							</div>
						</form>
						<div className="img-with-form">
							<img src={people} alt="Participants button" />
						</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
