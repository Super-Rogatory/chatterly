import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GuestSignin from './GuestSignin';
import Chat from './Chat';
import SelectMode from './SelectMode';
import Register from './Register';

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={SelectMode} />
				<Route path="/guestsignin" component={GuestSignin} />
				<Route path="/register" component={Register} />
				<Route path="/chat" component={Chat} />
			</Switch>
		</Router>
	);
}

export default App;
