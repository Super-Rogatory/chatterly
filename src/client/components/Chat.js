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
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
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
        if(prevState.messages !== messages) {
            this.props.fetchMessages()
            .then((messages) => console.log(messages));
            // clientSocket.on('message', (message) => {
                
            // })
        }
    }
    componentWillUnmount() {
        clientSocket.emit('disconnect');
        clientSocket.off();
    }

    handleChange(e) {

    }
    handleSubmit(e) {

    }
    render() {
        // message is in an object because our server expects information in a JSON object
        // handled by the implementation of our thunk, we provided a JSON object to the backend (well, axios did)
        // const message = {message: 'This is to test our thunks'};
        const { handleChange, handleSubmit } = this;
        const { message } = this.state;
        return (
            <div id="vertical-container" className="ui grid middle aligned">
                <div className="row">
                    <div className="column" align="middle">
                        <div className="ui container">
                            {/* Need to flesh out the content */}
                            <form onSubmit={handleSubmit}>
                                <input name='message' value={message} placeholder="Send a message!" onChange={handleChange} />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatch = (dispatch) => ({
    createUser: (name, room) => dispatch(createUser(name, room)),
    getUsersInRoom: (room) => dispatch(getUsersInRoom(room)),
    getUsers: () => dispatch(getUsers()),
    getUser: (id) => dispatch(getUser(id)),
    addMessage: (messageObject) => dispatch(addMessage(messageObject)),
    fetchMessages: () => dispatch(fetchMessages())
});


const mapState = (state) => ({
	nameFromStore: state.name,
	roomFromStore: state.room,
});

export default connect(mapState, mapDispatch)(Chat);
