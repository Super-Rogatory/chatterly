import React from 'react';
import { connect } from 'react-redux';
import { updateUserCount } from '../store/effects/thunks';

class Register extends React.Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
		};
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		if (!this.props.intervalId.isClear) {
			this.props.updateUserCount('clearInterval', this.props.intervalId);
		}
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	render() {
		const { username, password, usernameError, passwordError } = this.state;

		return (
			<div id="vertical-container" className="center-content">
				<div className="user-auth-form-background">
					<div className="ui centered large header">Create your Chatterly Account</div>
					<form className="ui attached form" autoComplete="off">
						<div>
							<label>Enter your username!</label>
							<input placeholder="Username" name="username" type="text" value={username} onChange={this.handleChange} />
						</div>
						<div>
							<label>Enter your password!</label>
							<input
								placeholder="Password"
								name="password"
								type="password"
								value={password}
								onChange={this.handleChange}
							/>
						</div>
					</form>
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
