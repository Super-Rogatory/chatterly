import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Typewriter from 'typewriter-effect';
import { updateChatterlyStatus, updateUserCount } from '../store/effects/thunks';
import GuestWarningPopup from './GuestWarningMessage';
import ExpiredGuest from './ExpiredGuest';
import { getActiveUsers } from '../store/effects/utils';
import Loader from 'react-loader-spinner';

class SelectMode extends React.Component {
	constructor() {
		super();
		this.state = {
			redirectToChatAsGuest: false,
			redirectToChatAsUser: false,
			activeUsers: 0,
			isLoaded: false,
			intervalFunction: async () => {
				const count = await getActiveUsers();
				this.setState({ activeUsers: count });
			},
		};
		this.handleGuest = this.handleGuest.bind(this);
	}

	async componentDidMount() {
		this.setState({ activeUsers: (await getActiveUsers()) || 0 });
		// updateUserCount is fed a type, and an intervalId (returned from the setInterval function)
		this.props.updateUserCount('saveInterval', setInterval(this.state.intervalFunction, 5000));
		this.setState({ isLoaded: true });
	}

	componentDidUpdate(prevProps, prevState) {
		// if the guest warning's isTriggered value changes, run this block.
		// if the guest warning's isTriggered value changes and the it's false, setInterval again
		// updateUserCount is fed a type, and in intervalId (returned from the setInterval function)
		if (prevProps.isTriggered !== this.props.isTriggered) {
			if (!this.props.isTriggered) {
				this.props.updateUserCount('saveInterval', setInterval(this.state.intervalFunction, 5000));
			}
		}
	}

	handleGuest() {
		this.props.updateUserCount('clearInterval', this.props.intervalId);
		this.props.updateComponent('toggleGuestWarningPopup', true);
	}

	render() {
		if (this.state.redirectToChatAsGuest) return <Redirect to="/home" />;
		if (this.state.redirectToChatAsGuest) return <Redirect to="/register" />; // Need to create register component, change isGuest user status here.
		if (window.localStorage.getItem('user')) {
			// to ensure that the same user is 'logged in' other rooms
			return <Redirect to="/chat" />;
		}
		if (!this.state.isLoaded) {
			return (
				<div id="vertical-container" className="ui grid middle aligned">
					<div className="middle">
						<Loader type="ThreeDots" color="#d5a26c" />;
					</div>
				</div>
			);
		} else
			return (
				// Add Loop For Chatterly, a typewriter message that repeats.
				<div className="select-mode-outerContainer">
					<section className="color-dark-background-overlay">
						<div className="typewriter-flex-container">
							<div className="typewriter-container">
								<Typewriter
									options={{
										strings: 'Chatterly',
										autoStart: true,
										loop: true,
										wrapperClassName: 'typewriter-text',
										cursorClassName: 'typewriter-text',
										skipAddStyles: true,
										pauseFor: 2000,
									}}
								/>
							</div>
						</div>
						{/* Show select mode menu only when launchPopup is false */}
						<div className="select-mode-container">
							{!this.props.isTriggered && (
								<div className="select-panel">
									<button className="ui basic button black" onClick={this.handleGuest}>
										JOIN CHATTERLY AS GUEST
									</button>

									<div className="ui basic center aligned segment">
										<h3>{`${this.state.activeUsers.count} ${
											this.state.activeUsers.count === 1 ? 'person' : 'people'
										} online`}</h3>
									</div>

									<button
										className="ui basic button black"
										onClick={() => this.setState({ redirectToChatAsUser: true })}
									>
										REGISTER AND KEEP USERNAME
									</button>
								</div>
							)}
						</div>
					</section>
					<footer className="footer-container-selectmode">
						<h3 className="adjacent-quote-left">Chatterly: A mixture of old and new school chat room styles.</h3>
						<h3 className="adjacent-quote-right">- Chukwudi Ikem.</h3>
					</footer>
					{/* Warning messages that popups when the user choices to join the chatroom as a guest. */}
					<GuestWarningPopup>
						<h3>
							Guest users will be deleted in 30 minutes. Rooms filled with guests will have all messages wiped when the
							room is emptied. Registered users keep their messages and name. Ready to rock and roll?
						</h3>
					</GuestWarningPopup>

					{
						/* Will load after the component has to unmount from chat */
						<ExpiredGuest>
							<h3>Your guest session has expired. Consider creating an account to keep your username!</h3>
						</ExpiredGuest>
					}
				</div>
			);
	}
}

const mapStateToProps = (state) => ({
	isTriggered: state.isTriggered,
	isGuestExpired: state.isGuestExpired,
	intervalId: state.intervalId,
});

const mapDispatchToProps = (dispatch) => ({
	updateComponent: (type, status) => dispatch(updateChatterlyStatus(type, status)),
	updateUserCount: (type, intervalId) => dispatch(updateUserCount(type, intervalId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectMode);
