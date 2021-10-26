import * as types from './actionTypes';
export const _setName = (name) => {
	return {
		type: types.SET_NAME,
		payload: name,
	};
};
export const _setRoom = (room) => {
	return {
		type: types.SET_ROOM,
		payload: room,
	};
};

export const _getUsersInRoom = (users) => {
	return {
		type: types.GET_USERS_IN_ROOM,
		users,
	};
};

export const _togglePopup = (status) => {
	return {
		type: types.TOGGLE_POPUP,
		status,
	};
};
export const _toggleParticipantsTab = (status) => {
	return {
		type: types.TOGGLE_PARTICIPANTS_TAB,
		status,
	};
};
export const _saveIntervalForUserCount = (intervalId) => {
	return {
		type: types.SAVE_INTERVAL_FOR_USER_COUNT,
		intervalId,
	};
};
export const _clearIntervalForUserCount = (status) => {
	return {
		type: types.CLEAR_INTERVAL_FOR_USER_COUNT,
		status,
	};
};
export const _expiredGuest = (status) => {
	return {
		type: types.EXPIRED_GUEST,
		status,
	};
};
export const _missingUser = (status) => {
	return {
		type: types.MISSING_USER,
		status,
	};
};
