import React from 'react';

class SelectMode extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			// Add Loop For Chatterly, a typewriter message that repeats.
			<div className="select-mode-outerContainer">
				<div className="select-mode-container">
					<div className="mode-background-box">
						<p>Join Chatterly As Guest</p>
					</div>
					<div className="mode-background-box">
						<p>Register and KEEP your username</p>
					</div>
				</div>
			</div>
		);
	}
}

export default SelectMode;
