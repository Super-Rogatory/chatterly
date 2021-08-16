import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			name: '',
			room: '',
		};
	}
	render() {
		return (
			<div className="ui container">
				<div className="ui segment">
					<div className="ui centered header">Join</div>
					<div className="ui form">
						<div className="field">
							<label>Some Stuff</label>
							<input
								placeholder=""
								type="text"
								onChange={() => console.log('change')}
							/>
						</div>
						<div className="field">
							<label>Some More Stuff</label>
							<input
								placeholder=""
								type="text"
								onChange={() => console.log('change')}
							/>
						</div>
						<Link>
							<button type="submit" className="ui button">Submit</button>
						</Link>
					</div>
				</div>
			</div>
		);
	}
}
export default Home;
