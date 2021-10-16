import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Typewriter from 'typewriter-effect';
import { togglePopup } from '../store/effects/thunks';
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
		};
	}

	async componentDidMount() {
		this.setState({ activeUsers: await getActiveUsers() });
		window.localStorage.clear(); // fixes infinite loop error on server restart
		this.setState({ isLoaded: true });
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
					{/* Show select mode menu only when launchPopup is false */}
					<div className="select-mode-container">
						{!this.props.isTriggered && (
							<div className="select-panel">
								<button className="ui basic button black" onClick={() => this.props.toggleGuestWarning(true)}>
									JOIN CHATTERLY AS GUEST
								</button>

								<div className="ui basic center aligned segment">
									<h3>{`${this.state.activeUsers.count} people online`}</h3>
								</div>

								<button className="ui basic button black" onClick={() => this.setState({ redirectToChatAsUser: true })}>
									REGISTER AND KEEP USERNAME
								</button>
							</div>
						)}
					</div>

					{/* Warning messages that popups when the user choices to join the chatroom as a guest. */}
					<GuestWarningPopup>
						<h3>
							As a guest your username WILL disappear from my server within the hour. If you wish to keep your name
							permanently, make sure to create an account with us. Ready to rock and roll?
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
});

const mapDispatchToProps = (dispatch) => ({
	toggleGuestWarning: (status) => dispatch(togglePopup(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectMode);
