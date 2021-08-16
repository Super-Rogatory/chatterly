import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { setRoom, setName } from '../../store/effects/thunks';

let clientSocket;

function Chat({ name, room }) {

    const ENDPOINT = 'localhost:8080';
    useEffect(() => {
        clientSocket = io(ENDPOINT);

        clientSocket.emit('join', { name, room })

        return () => {
            clientSocket.emit('disconnect');
            
            clientSocket.off();
        }
    }, [ENDPOINT, name, room])
    return(
        <h1>Chat</h1>
    )

}
const mapDispatch = (dispatch) => ({
	setRoom: (room) => dispatch(setRoom(room)),
	setName: (name) => dispatch(setName(name)),
});


const mapState = (state) => ({
	name: state.name,
	room: state.room,
});

export default connect(mapState, mapDispatch)(Chat);
