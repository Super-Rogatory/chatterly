import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Chat from './Chat';
import SelectMode from './SelectMode';

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={SelectMode} />
				<Route path="/home" component={Home} />
				<Route path="/chat" component={Chat} />
			</Switch>
		</Router>
	);
}

export default App;
