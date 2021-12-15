import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateChatterlyStatus } from '../store/effects/thunks';

class GuestWarningPopup extends React.Component {
	// eslint-disable-next-line no-useless-constructor
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.isTriggered) {
			return (
				<div className="warning-message-container">
					<div className="warning-message">
						{this.props.children}
						<div className="confirmations-buttons">
							<button
								className="ui basic black button"
								onClick={() => this.props.updateComponent('toggleGuestWarningPopup', false)}
							>
								I am not ready to rock and roll.
							</button>
							<button className="ui basic black button" onClick={() => this.props.history.push('/guestsignin')}>
								I am ready to rock and roll.
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

const GuestWarningWithRouter = withRouter(GuestWarningPopup);
export default connect(mapStateToProps, mapDispatchToProps)(GuestWarningWithRouter);
