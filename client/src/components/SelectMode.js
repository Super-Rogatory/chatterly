import React from 'react';
import { Redirect } from 'react-router';
import Typewriter from 'typewriter-effect';

class SelectMode extends React.Component {
	constructor() {
		super();
		this.state = {
			redirectToChatAsGuest: false,
			redirectToChatAsUser: false,
		};
	}
	render() {
		if (this.state.redirectToChatAsGuest) return <Redirect to="/home" />;
		if (this.state.redirectToChatAsGuest) return <Redirect to="/register" />; // Need to create register component
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

				<div className="select-mode-container">
					<div className="mode-background-box">
						<button className="ui basic fluid button" onClick={() => this.setState({ redirectToChatAsGuest: true })}>
							JOIN CHATTERLY AS GUEST
						</button>
					</div>
					<div className="mode-background-box">
						<button className="ui basic fluid button" onClick={() => this.setState({ redirectToChatAsUser: true })}>
							REGISTER AND KEEP USERNAME
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default SelectMode;
