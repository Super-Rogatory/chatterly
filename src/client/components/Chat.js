import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { setRoom, setName, createUser } from '../../store/effects/thunks';

let clientSocket;

class Chat extends React.Component {
    constructor(){
        super();
        this.state = {
            name: '',
            room: '',
            ENDPOINT: 'localhost:8080'
        }
    }
    componentDidMount() {
        const { stateName, stateRoom } = this.props;
        this.setState({ name: stateName, room: stateRoom });    
    }
    componentDidUpdate() {
        const { name, room, ENDPOINT } = this.state;
        clientSocket = io(ENDPOINT);
        clientSocket.emit('join', { name, room })
    }
    componentWillUnmount() {
        clientSocket.emit('disconnect');

        clientSocket.off();
    }
    render() {
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
