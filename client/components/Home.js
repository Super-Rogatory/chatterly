import React from 'react';
import crownlogo from '../icons/crown.png';
import chatterlylogo from '../icons/favicon.png';
import refreshlogo from '../icons/refresh.png';
import { Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import {
	getAllRoomsForUser,
	getUserByName,
	isTokenValid,
	updateRegisteredUserRoom,
	updateUserStatus,
} from '../store/effects/utils';
import { connect } from 'react-redux';
import { updateChatterlyStatus } from '../store/effects/thunks';
import RoomList from './RoomList';

class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoggedIn: !!window.localStorage.getItem('token'), // recall that null is returned if the key does not exist !!{} is true !!null is false
			invalidToken: false,
			user: {},
			room: '',
			isUserOnline: undefined,
			isCrownReady: false,
			isLogoReady: false,
			isRefreshReady: false,
			isLoaded: false,
			canChangeUserStatusAgain: true,
			statusTimerId: null,
			roomError: false,
			redirectToChat: false,
			jwt: null,
			roomsArray: [],
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setRoomsOnState = this.setRoomsOnState.bind(this); // ensures that child component has access to the this context of the parent component
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
			this.loadImages();
			await this.setRoomsOnState(token, user);
			this.setState({ isLoaded: true, jwt: token, user, isUserOnline: user.active });
		} catch (err) {
			this.setState({ invalidToken: true });
		}
	}

	loadImages() {
		/* ensure that the logo is ready to display. */
		const crownIcon = new Image();
		const chatIcon = new Image();
		const refreshIcon = new Image();
		crownIcon.onload = () => {
			this.setState({ isCrownReady: true });
		};
		chatIcon.onload = () => {
			this.setState({ isLogoReady: true });
		};
		refreshIcon.onload = () => {
			this.setState({ isRefreshReady: true });
		};
		crownIcon.src = crownlogo; // triggers browser download of image
		chatIcon.src = chatterlylogo;
		refreshIcon.src = refreshlogo;
	}

	async setRoomsOnState(jwt, user) {
		const rooms = await getAllRoomsForUser(jwt, user.id);
		this.setState({ roomsArray: rooms });
	}

	async handleSubmit(e) {
		e.preventDefault();
		if (!this.state.room) {
			this.setState({ roomError: true });
			return;
		}
		// async update operation to tie user and room.
		const user = await updateRegisteredUserRoom(this.state.user.id, this.state.room);
		window.localStorage.setItem('user', JSON.stringify(user));
		this.setState({ redirectToChat: true });
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
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

	async openRoomListInHomePage() {
		const { jwt, user } = this.state;
		this.props.updateComponent('openRoomListInHomePage', !this.props.openRoomListTab);
		if (!this.props.openRoomListTab) {
			try {
				await this.setRoomsOnState(jwt, user);
			} catch (err) {
				console.error(err);
			}
		}
	}

	render() {
		const { user, canChangeUserStatusAgain, isUserOnline, roomError } = this.state;
		const { isLoggedIn, invalidToken, redirectToChat } = this.state;
		const { isLoaded, isLogoReady, isCrownReady, isRefreshReady, roomsArray } = this.state;

		if (!isLoggedIn || invalidToken) {
			window.localStorage.clear();
			return <Redirect to="/" />;
		}

		if (redirectToChat) {
			return <Redirect to="/chat" />;
		}

		if (!isLoaded || !isLogoReady || !isCrownReady || !isRefreshReady) {
			return (
				<div id="vertical-container" className="center-content">
					<Loader type="ThreeDots" color="#d5a26c" />;
				</div>
			);
		} else {
			return (
				<div id="vertical-container" className="center-content">
					<div className="chatroom-wrapper" align="middle">
						<div className="ui container">
							<div className="brown-background-container">
								<div className="inline-flexed-content-container">
									<div className="vertical-static-menu">
										<div className="ui basic large black button" onClick={() => this.openRoomListInHomePage()}>
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
										<div className={`ui-sandbox-top ${this.props.openRoomListTab ? '' : 'center-content'}`}>
											<div className="chatterly-logo-wrapper">
												<img src={chatterlylogo} alt="logo" />
											</div>
											<div className="chatterly-home-form">
												<form className="ui attached form" onSubmit={this.handleSubmit}>
													<div className={`field ${roomError ? 'error' : ''}`}>
														<label>Enter a room name!</label>
														<input placeholder="Enter Room" name="room" type="text" onChange={this.handleChange} />
													</div>

													<button type="submit" className="ui basic black button">
														JOIN!
													</button>
												</form>
												{roomError && (
													<div className="ui bottom warning message home">{"Don't forget to enter a room name."}</div>
												)}
											</div>
										</div>
										{/* will render out the roomlist when the room list button is toggled */}
										<div className={this.props.openRoomListTab ? 'ui-sandbox-bottom' : ''}>
											{this.props.openRoomListTab && (
												<RoomList
													refreshIcon={refreshlogo}
													rooms={roomsArray}
													refreshFunction={this.setRoomsOnState}
													jwt={this.state.jwt}
													user={this.state.user}
												/>
											)}
										</div>
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
}

const mapStateToProps = (state) => ({
	openRoomListTab: state.openRoomListTab,
});

const mapDispatchToProps = (dispatch) => ({
	updateComponent: (type, status) => dispatch(updateChatterlyStatus(type, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
