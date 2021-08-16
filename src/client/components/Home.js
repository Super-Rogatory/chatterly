import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			name: '',
			room: '',
            inputError: false
		};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.canSubmit = this.canSubmit.bind(this);
	}
    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state);
    }
    canSubmit(e) {
        const { name, room } = this.state;
        if(!name || !room) {
            e.preventDefault();
            this.setState({ inputError: true });
        }
    }
    componentWillUnmount(){
        this.setState({ inputError: false });
    }
	render() {
		return (
			<div className="ui container">
				<div className="ui segment">
					<div className="ui centered header">Chatterly</div>
					<form className="ui form" onSubmit={this.handleSubmit}>
						<div className={`field ${this.state.inputError && 'error'}`}>
							<label>What is your name?</label>
							<input
								placeholder="Enter Name"
                                name="name"
								type="text"
                                value={this.state.name}
								onChange={this.handleChange}
                                required
							/>
						</div>
						<div className={`field ${this.state.inputError && 'error'}`}>
							<label>Which room do you intend to join?</label>
							<input
								placeholder="Enter Room"
                                name="room"
								type="text"
                                value={this.state.room}
								onChange={this.handleChange}
                                required
							/>
						</div>
						<Link to='/chat' onClick={this.canSubmit}>
							<button type="submit" className="ui button">Submit</button>
						</Link>
					</form>
				</div>
			</div>
		);
	}
}
export default Home;
