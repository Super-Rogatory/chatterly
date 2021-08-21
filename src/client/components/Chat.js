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
            user: {},
        }
    }
    async componentDidMount() {
		// setting data from redux to the current state.
        const { nameFromStore, roomFromStore, createUser } = this.props;
        // keep in mind, if name argument is empty, we will get a validation error
        const user = await createUser(nameFromStore, roomFromStore);
        // we will modify the id to carry the socket.id
        
        this.setState({ name: nameFromStore, room: roomFromStore, user });
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
        const { name, room, user } = this.state;
        console.log(user);
        return (
            <div>
                Hi
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
	nameFromStore: state.name,
	roomFromStore: state.room,
    users: state.users
});

export default connect(mapState, mapDispatch)(Chat);
