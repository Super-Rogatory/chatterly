import React from 'react';
import crownlogo from '../icons/crown.png';
import chatterlylogo from '../icons/favicon.png';
import { Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { getUserByName, isTokenValid, updateUserStatus } from '../store/effects/utils';
import { connect } from 'react-redux';
import { updateChatterlyStatus } from '../store/effects/thunks';

class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoggedIn: !!window.localStorage.getItem('token'), // recall that null is returned if the key does not exist !!{} is true !!null is false
			invalidToken: false,
			user: {},
			isUserOnline: undefined,
			isCrownReady: false,
			isLogoReady: false,
			isLoaded: false,
			canChangeUserStatusAgain: true,
			statusTimerId: null,
			roomError: false,
		};
	}

	async componentDidMount() {
		// if there is a token we need to verify it somehow.
		const localStorageName = window.localStorage.getItem('username');
		const localStorageToken = window.localStorage.getItem('token');
		const { token } = JSON.parse(localStorageToken); // localStorageToken is an object with the token property in it.
		try {
			/* ensure that the jwt from local storage is valid, then get user */
			await isTokenValid(token); // isTokenValid is a function that returns an object with the status property, if there is an error we can catch it and then redirect to home.
			const user = await getUserByName(localStorageName);
			if (!user) throw new Error('failed to find user');
			else this.setState({ user, isUserOnline: user.active });
			/* ensure that the logo is ready to display. */
			const logo = new Image();
			const logo2 = new Image();
			logo.onload = () => {
				this.setState({ isCrownReady: true });
			};
			logo2.onload = () => {
				this.setState({ isLogoReady: true });
			};
			logo.src = crownlogo; // triggers browser download of image
			logo2.src = chatterlylogo;
			this.setState({ isLoaded: true });
		} catch (err) {
			this.setState({ invalidToken: true });
		}
	}

	async updateUserStatusWithTimeout(user) {
		try {
			await updateUserStatus(user);
			this.setState({ canChangeUserStatusAgain: false, isUserOnline: !this.state.isUserOnline });
			setTimeout(() => this.setState({ canChangeUserStatusAgain: true }), 3000);
		} catch (err) {
			console.error(err);
		}
	}

	async updateUserStatusAndLogout(user, typeObject) {
		try {
			await updateUserStatus(user, typeObject);
			this.setState({ isLoggedIn: false });
		} catch (err) {
			console.error(err);
		}
	}

	render() {
		const { user, canChangeUserStatusAgain, isUserOnline, roomError } = this.state;
		if (!this.state.isLoggedIn || this.state.invalidToken) {
			window.localStorage.clear();
			return <Redirect to="/" />;
		}
		if (!this.state.isLoaded || !this.state.isLogoReady || !this.state.isCrownReady) {
			return (
				<div id="vertical-container" className="center-content">
					<Loader type="ThreeDots" color="#d5a26c" />;
				</div>
			);
		} else
			return (
				<div id="vertical-container" className="center-content">
					<div className="chatroom-wrapper" align="middle">
						<div className="ui container">
							<div className="brown-background-container">
								<div className="inline-flexed-content-container">
									<div className="vertical-static-menu">
										<div
											className="ui basic large black button"
											onClick={() => this.props.updateComponent('openRoomListInHomePage', !this.props.openRoomListTab)}
										>
											Room List
										</div>
										<div
											className={`ui basic ${canChangeUserStatusAgain ? '' : 'disabled'} black button`}
											onClick={() => this.updateUserStatusWithTimeout(user)}
										>
											Change Status
										</div>
										<div
											className="ui basic large black button"
											onClick={() => this.updateUserStatusAndLogout(user, { type: 'logout' })}
										>
											Logout
										</div>
									</div>
									<div className="ui-sandbox">
										<div className="ui-sandbox-top-container">
											<div className="chatterly-logo-wrapper">
												<img src={chatterlylogo} alt="logo" />
											</div>
											<form className="ui attached form">
												<div className={`field ${roomError ? 'error' : ''}`}>
													<label>Enter a room name!</label>
													<input placeholder="Enter Room" name="room" type="text" />
												</div>
											</form>
											<button type="submit" className="ui basic black button">
												JOIN!
											</button>
											{roomError && (
												<div className="ui bottom warning message">{"Don't forget to enter the room name."}</div>
											)}
										</div>
										<div className="ui-sandbox-room-list">{this.props.openRoomListTab && 'tab opened'}</div>
									</div>
								</div>

								<div className="logged-in-username-footer">
									<div className="username-wrapper">
										<div className="username-wrapper-img">
											<img src={crownlogo} alt="crown-logo" />
										</div>
										<div className="username-wrapper-name">{user.name}</div>
									</div>
									<div className="status-icon-container status-icon-center">
										<div className={`circle ${isUserOnline ? 'green' : 'greyed'}`}></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
	}
}

const mapStateToProps = (state) => ({
	openRoomListTab: state.openRoomListTab,
});

const mapDispatchToProps = (dispatch) => ({
	updateComponent: (type, status) => dispatch(updateChatterlyStatus(type, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
