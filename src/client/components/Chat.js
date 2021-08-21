import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { createUser, getUser, getUsers, getUsersInRoom } from '../../store/effects/thunks';

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
            users: []
        }
    }
    async componentDidMount() {
        // before anything, check to see if user object exists in localStorage and get information from Redux store
        const loggedInUser = window.localStorage.getItem('user');
        const { nameFromStore, roomFromStore, createUser, getUsersInRoom } = this.props;

        // if user is already logged in, on refresh, set the state with the user object from localStorage and fetch users in the room
        if(loggedInUser) {
            // note. if the user is already logged in, we cannot rely on logic from lines 30+. And our Redux store will not persist. We can set this up from the db, or localStorage
            const user = JSON.parse(loggedInUser);
            const room = user.room;
            // should return the users in the room
            const users = await getUsersInRoom(room);
            this.setState({ users });
        } else {
            // using information from the Redux store, we can create a new user. If user does not exist when we try to getItem, setItem in localStorage and db.
            const user = await createUser(nameFromStore, roomFromStore);
            window.localStorage.setItem('user', JSON.stringify({ name: nameFromStore, room: roomFromStore }));
            this.setState({ name: nameFromStore, room: roomFromStore, user });            
        }

        // we will modify the id to carry the socket.id

    }
    componentDidUpdate(prevProps, prevState) {
		// if prevState's properties change somehow, perform some action.
        const { name, room, ENDPOINT } = this.state;
		if(prevState.name !== this.state.name || prevState.room !== this.state.room) {
			clientSocket = io(ENDPOINT);
			clientSocket.emit('join', { name, room })			
		}

    }
    componentWillUnmount() {
        clientSocket.emit('disconnect');
        clientSocket.off();
    }

    render() {
		// testing of thunks here.
        // const { name, room, user } = this.state;
        // console.log(this.props.users);
        // console.log(this.props.usersInRoom);
        return (
            <div>
                Hi
            </div>
        )
    }
}

const mapDispatch = (dispatch) => ({
    createUser: (name, room) => dispatch(createUser(name, room)),
    getUsersInRoom: (room) => dispatch(getUsersInRoom(room)),
    getUsers: () => dispatch(getUsers()),
    getUser: (id) => dispatch(getUser(id))
});


const mapState = (state) => ({
	nameFromStore: state.name,
	roomFromStore: state.room,
});

export default connect(mapState, mapDispatch)(Chat);
