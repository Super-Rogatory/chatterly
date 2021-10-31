import React from 'react';

class Register extends React.Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
		};
	}
	render() {
		return (
			<div id="vertical-container" className="center-content">
				<form className="register-form-container">
					<label>Test</label>
				</form>
			</div>
		);
	}
}

export default Register;
