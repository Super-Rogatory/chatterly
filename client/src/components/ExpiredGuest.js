import React from 'react';
import { connect } from 'react-redux';
import { isGuestExpired } from '../store/effects/thunks';

class ExpiredGuest extends React.Component {
	// eslint-disable-next-line no-useless-constructor
	constructor(props) {
		super(props);
	}
	render() {
		if (this.props.isGuestExpired) {
			return (
				<div className="warning-message-container">
					<div className="warning-message">
						{this.props.children}
						<div className="confirmations-buttons">
							<button className="ui basic button" onClick={() => this.props.toggleGuestExpired(false)}>
								OK!
							</button>
						</div>
					</div>
				</div>
			);
		}
		return '';
	}
}

const mapStateToProps = (state) => ({
	isGuestExpired: state.isGuestExpired,
});

const mapDispatchToProps = (dispatch) => ({
	toggleGuestExpired: (status) => dispatch(isGuestExpired(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpiredGuest);
