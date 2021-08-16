import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { setRoom, setName, createUser } from '../../store/effects/thunks';

let clientSocket;

function Chat({ name, room, users }) {
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
        <div>
           {users.length > 0 && users.map((user, index) => <div key={index}>user.name</div>)} 
        </div>
        
    )

}
const mapDispatch = (dispatch) => ({
	setRoom: (room) => dispatch(setRoom(room)),
	setName: (name) => dispatch(setName(name)),
    createUser: (user) => dispatch(createUser(user))
});


const mapState = (state) => ({
	name: state.name,
	room: state.room,
    users: state.users
});

export default connect(mapState, mapDispatch)(Chat);
