import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { Provider } from 'react-redux';
import store from '../src/store/store';

ReactDOM.hydrate(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
