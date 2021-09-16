import React from 'react';

class Input extends React.Component {
	constructor() {
		super();
		this.state = {
			message: '',
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	render() {
		return (
			<form className="ui fluid action input" onSubmit={this.handleSubmit}>
				<input
					type="text"
					value={this.state.message}
					name="message"
					placeholder="Enter a message..."
					onChange={this.handleChange}
				/>
				<button className="ui basic button">Enter</button>
			</form>
		);
	}
}

export default Input;
