import React from 'react';
import Typewriter from 'typewriter-effect';

class Login extends React.Component {
	render() {
		return (
			<div id="vertical-container" className="center-content">
				<div className="user-auth-form-background-login">
					<div className="typewriter-container">
						<Typewriter
							options={{
								strings: 'Chatterly | Sign In',
								autoStart: true,
								loop: true,
								wrapperClassName: 'auth-form-typewriter-text',
								cursorClassName: 'auth-form-typewriter-text',
								skipAddStyles: true,
								pauseFor: 3000,
							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;
