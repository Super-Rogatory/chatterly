import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Typewriter from 'typewriter-effect';
import { togglePopup } from '../store/effects/thunks';
import GuestWarningPopup from './GuestWarningMessage';

class SelectMode extends React.Component {
	constructor() {
		super();
		this.state = {
			redirectToChatAsGuest: false,
			redirectToChatAsUser: false,
		};
	}

	componentDidMount() {
		window.localStorage.clear(); // fixes infinite loop error on server restart
	}

	render() {
		if (this.state.redirectToChatAsGuest) return <Redirect to="/home" />;
		if (this.state.redirectToChatAsGuest) return <Redirect to="/register" />; // Need to create register component, change isGuest user status here.
		if (window.localStorage.getItem('user')) {
			// to ensure that the same user is 'logged in' other rooms
			return <Redirect to="/chat" />;
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
						{!this.props.isTriggered ? (
							<>
								<div className="mode-background-box">
									<button className="ui basic fluid button" onClick={() => this.props.togglePopup(true)}>
										JOIN CHATTERLY AS GUEST
									</button>
								</div>
								<div className="mode-background-box">
									<button
										className="ui basic fluid button"
										onClick={() => this.setState({ redirectToChatAsUser: true })}
									>
										REGISTER AND KEEP USERNAME
									</button>
								</div>
							</>
						) : (
							''
						)}
					</div>
					{/* Warning messages that popups when the user choices to join the chatroom as a guest. */}
					<GuestWarningPopup>
						<h3>
							As a guest your username WILL disappear from my server within the hour. If you wish to keep your name
							permanently, make sure to create an account with us. Ready to rock and roll?
						</h3>
					</GuestWarningPopup>
				</div>
			);
	}
}

const mapStateToProps = (state) => ({
	isTriggered: state.isTriggered,
});

const mapDispatchToProps = (dispatch) => ({
	togglePopup: (status) => dispatch(togglePopup(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectMode);
