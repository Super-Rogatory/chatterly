import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { addMessage, createUser, fetchMessages, getUser, getUsers, getUsersInRoom } from '../../store/effects/thunks';

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
            users: [],
            message: '',
            messages: []
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
            // name and room is set in the Home component.
            const user = await createUser(nameFromStore, roomFromStore);
            window.localStorage.setItem('user', JSON.stringify({ name: nameFromStore, room: roomFromStore }));
            this.setState({ name: user.name, room: user.room, user });            
        }

        // we will modify the id to carry the socket.id

    }
    componentDidUpdate(prevProps, prevState) {
		// if prevState's properties change somehow, perform some action.
        const { name, room, user, ENDPOINT, message, messages } = this.state;
		if(prevState.name !== name || prevState.room !== room) {
			clientSocket = io(ENDPOINT);
			clientSocket.emit('join', user, () => {

            });		
		}
        // if(prevState.messages !== messages) {
        //     clientSocket.on('message', (message) => {
        //         this.props.addMessage(message);
        //     })
        // }
    }
    componentWillUnmount() {
        clientSocket.emit('disconnect');
        clientSocket.off();
    }

    render() {
        const message = {message: 'This is to test our thunks'};
        return (
            <div>
                <button onClick={() => this.props.addMessage(message)}>+</button>
                <button onClick={() => this.props.fetchMessages()}>fetch</button>
            </div>
        )
    }
}

const mapDispatch = (dispatch) => ({
    createUser: (name, room) => dispatch(createUser(name, room)),
    getUsersInRoom: (room) => dispatch(getUsersInRoom(room)),
    getUsers: () => dispatch(getUsers()),
    getUser: (id) => dispatch(getUser(id)),
    addMessage: (message) => dispatch(addMessage(message)),
    fetchMessages: () => dispatch(fetchMessages())
});


const mapState = (state) => ({
	nameFromStore: state.name,
	roomFromStore: state.room,
});

export default connect(mapState, mapDispatch)(Chat);
