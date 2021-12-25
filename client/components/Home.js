import React from 'react';
import { Redirect } from 'react-router-dom';
import { getUserByName, isTokenValid } from '../store/effects/utils';
import crownlogo from '../icons/crown.png';

class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoggedIn: !!window.localStorage.getItem('token'), // recall that null is returned if the key does not exist !!{} is true !!null is false
			invalidToken: false,
			user: {},
			isLogoReady: false,
			isLoaded: false,
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
			else this.setState({ user });
			/* ensure that the logo is ready to display */
			const logo = new Image();
			logo.onload = () => {
				this.setState({ isLogoReady: true });
			};
			logo.src = crownlogo;
			this.setState({ isLoaded: true });
		} catch (err) {
			this.setState({ invalidToken: true });
		}
	}

	render() {
		if (!this.state.isLoggedIn || this.state.invalidToken) {
			window.localStorage.clear();
			return <Redirect to="/" />;
		}
		if (!this.state.isLoaded || !this.state.isLogoReady) {
			return <div>Loading</div>;
		} else
			return (
				<div id="vertical-container" className="center-content">
					<div className="chatroom-wrapper" align="middle">
						<div className="ui container">
							<div className="brown-background-container">
								<div className="inline-flexed-content-container">
									<div className="vertical-static-menu">Hi</div>
									<div className="ui-sandbox">Hello</div>
								</div>
								<div className="logged-in-username-footer">
									<div className="username-wrapper">
										<div className="username-wrapper-img">
											<img src={crownlogo} alt="crown-logo" />
										</div>
										{`Chuck`}
									</div>
									<div className="status-icon-container status-icon-center">
										<div className="circle green"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
	}
}

export default Home;
