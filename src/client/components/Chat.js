import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { setRoom, setName, createUser } from '../../store/effects/thunks';

let clientSocket;

class Chat extends React.Component {
	// constructor serves to keep track of the name, room, and the address to reference the server
    constructor(){
        super();
        this.state = {
            name: '',
            room: '',
            ENDPOINT: 'localhost:8080',
        }
    }
    componentDidMount() {
		// setting data from redux to the current state.
        const { stateName, stateRoom } = this.props;
        this.setState({ name: stateName, room: stateRoom });
    }
    componentDidUpdate(prevProps, prevState) {
		// if prevState's properties change somehow, perform some action.
        const { name, room, ENDPOINT } = this.state;
		if(prevState.name !== this.state.name || prevState.room !== this.state.room) {
			clientSocket = io(ENDPOINT);
			clientSocket.emit('join', { name, room })			
		}

    }
    componentDidUnmount() {
        clientSocket.emit('disconnect');
        clientSocket.off();
    }
    render() {
		// testing of thunks here.
        const { name, room } = this.state;
        return (
            <div>
                <button onClick={() => this.props.createUser(name, room)}>+</button>
            </div>
        )
    }
}

const mapDispatch = (dispatch) => ({
	setRoom: (room) => dispatch(setRoom(room)),
	setName: (name) => dispatch(setName(name)),
    createUser: (name, room) => dispatch(createUser(name, room))
});


const mapState = (state) => ({
	stateName: state.name,
	stateRoom: state.room,
    users: state.users
});

export default connect(mapState, mapDispatch)(Chat);
