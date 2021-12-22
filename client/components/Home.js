import React from 'react';
import { Redirect } from 'react-router-dom';
import { isTokenValid } from '../store/effects/utils';

class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoggedIn: !!window.localStorage.getItem('token'), // recall that null is returned if the key does not exist !!{} is true !!null is false
			invalidToken: false,
		};
	}

	async componentDidMount() {
		// if there is a token we need to verify it somehow.
		const localStorageToken = window.localStorage.getItem('token');
		const { token } = JSON.parse(localStorageToken); // localStorageToken is an object with the token property in it.
		try {
			await isTokenValid(token); // isTokenValid is a function that returns an object with the status property, if there is an error we can catch it and then redirect to home.
		} catch (err) {
			this.setState({ invalidToken: true });
		}
	}

	render() {
		if (!this.state.isLoggedIn || this.state.invalidToken) {
			window.localStorage.clear();
			return <Redirect to="/" />;
		}
		return 'hi';
	}
}

export default Home;
