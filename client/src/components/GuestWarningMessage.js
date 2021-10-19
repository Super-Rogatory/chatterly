import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateChatterlyStatus } from '../store/effects/thunks';

class GuestWarningPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			redirectToChatAsGuest: false,
		};
	}
	render() {
		if (this.state.redirectToChatAsGuest) {
			return <Redirect to="/home" />;
		}
		if (this.props.isTriggered) {
			return (
				<div className="warning-message-container">
					<div className="warning-message">
						{this.props.children}
						<div className="confirmations-buttons">
							<button
								className="ui basic button"
								onClick={() => this.props.updateComponent('toggleGuestWarningPopup', false)}
							>
								I am not ready to rock and roll.
							</button>
							<button className="ui basic button" onClick={() => this.setState({ redirectToChatAsGuest: true })}>
								I understand that my name will disappear in one hour!
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
	isTriggered: state.isTriggered,
});

const mapDispatchToProps = (dispatch) => ({
	updateComponent: (type, status) => dispatch(updateChatterlyStatus(type, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GuestWarningPopup);
