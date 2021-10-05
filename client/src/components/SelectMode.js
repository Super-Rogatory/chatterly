import React from 'react';
import Typewriter from 'typewriter-effect';

class SelectMode extends React.Component {
	constructor() {
		super();
	}
	render() {
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
						<button className="ui basic fluid button">Join Chatterly As Guest</button>
					</div>
					<div className="mode-background-box">
						<button className="ui basic fluid button">Register and KEEP username</button>
					</div>
				</div>
			</div>
		);
	}
}

export default SelectMode;
