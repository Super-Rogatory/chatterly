import React from 'react';
import { connect } from 'react-redux';

class Message extends React.Component {
	constructor() {
		super();
		this.state = {
			currentUser: false,
		};
	}
	render() {
		console.log(this.props.message);
		return this.props.message.text;
	}
}

export default connect(null, null)(Message);
