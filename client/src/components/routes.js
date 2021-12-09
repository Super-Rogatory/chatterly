import SelectMode from './SelectMode';
import GuestSignin from './GuestSignin';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Chat from './Chat';

const routes = [
	{ path: '/', exact: true, component: SelectMode },
	{ path: '/guestsignin', component: GuestSignin },
	{ path: '/register', component: Register },
	{ path: '/signin', component: Login },
	{ path: '/home', component: Home },
	{ path: '/chat', component: Chat },
];

export default routes;
