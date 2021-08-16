import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			name: '',
			room: '',
			nameError: false,
			roomError: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}
	handleSubmit(e) {
		const { name, room } = this.state;
		if (!name || !room) {
			e.preventDefault();
			if (room) this.setState({ nameError: true, roomError: false });
			else if (name) this.setState({ roomError: true, nameError: false });
			else this.setState({ nameError: true, roomError: true });
		}
        else {
            console.log({name, room});
        }
	}
	componentWillUnmount() {
		this.setState({ inputError: false });
	}
	render() {
		return (
			<div className="ui container">
				<div className="ui segment">
					<div className="ui centered header">Chatterly</div>
					<form className="ui attached form" >
						<div className={`field ${this.state.nameError ? 'error' : ''}`}>
							<label>What is your name?</label>
							<input
								placeholder="Enter Name"
								name="name"
								type="text"
								value={this.state.name}
								onChange={this.handleChange}
							/>
						</div>
						<div className={`field ${this.state.roomError ? 'error' : ''}`}>
							<label>Which room do you intend to join?</label>
							<input
								placeholder="Enter Room"
								name="room"
								type="text"
								value={this.state.room}
								onChange={this.handleChange}
							/>
						</div>
						<Link to="/chat" onClick={this.handleSubmit}>
							<button type="submit" className="ui button">
								Submit
							</button>
						</Link>
					</form>
					{(this.state.nameError || this.state.roomError) && (
						<div className="ui bottom warning message">
							Don't forget to enter both name and room.
						</div>
					)}
				</div>
			</div>
		);
	}
}
export default Home;
