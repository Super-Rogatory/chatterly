import {
	_getUsersInRoom,
	_togglePopup,
	_expiredGuest,
	_missingUser,
	_toggleParticipantsTab,
	_saveIntervalForUserCount,
	_clearIntervalForUserCount,
} from '../actions/actionCreators';
import axios from 'axios';

const PORT = process.env.PORT || 5000;
const url = process.env.NODE_ENV === 'production' ? 'https://wechatterly.herokuapp.com' : `http://localhost:${PORT}`;

// transformed from our utils file.
export const fetchUsersInRoom = (room) => {
	return async (dispatch) => {
		try {
			const { data } = await axios.get(`${url}/api/rooms/users/${room}`);
			dispatch(_getUsersInRoom(data.users));
			const activeUsers = data.users.filter((user) => user.active === true);
			return { activeUsers, users: data.users };
		} catch (err) {
			console.log(err);
		}
	};
};

// -----------------------------------------------------------------------------------------------------------------------------------------------//
export const updateChatterlyStatus = (type, status) => {
	// creating a 'one-stop-shop' consumer experience - Ryan [The Office]
	return (dispatch) => {
		switch (type) {
			case 'toggleGuestWarningPopup':
				dispatch(_togglePopup(status));
				break;

			case 'toggleGuestExpiredPopup':
				dispatch(_expiredGuest(status));
				break;

			case 'openParticipantsTab':
				dispatch(_toggleParticipantsTab(status));
				break;

			case 'missingUser':
				dispatch(_missingUser(status));
				break;

			default:
				break;
		}
		return status;
	};
};

export const updateUserCount = (type, intervalId) => {
	return (dispatch) => {
		switch (type) {
			case 'clearInterval':
				clearInterval(intervalId);
				dispatch(_clearIntervalForUserCount({ isClear: true }));
				break;
			case 'saveInterval':
				dispatch(_saveIntervalForUserCount(intervalId));
				break;
			default:
				break;
		}
	};
};
