import Server from 'socket.io'

export default function startServer(store) {

	// Creates a Socket.io server as well as a regular HTTP server
	// bound to port 8090
	const io = new Server().attach(8090)

	// http://redux.js.org/docs/api/Store.html#subscribelistener
	store.subscribe(() => {
		io.emit('state', sendState(store))
	})

	io.on('connection', (socket) => {
		socket.emit('state', sendState(store))
		socket.on('action', store.dispatch.bind(store))
	})
}


/***************************
 * 		Utils
 *************************/

// send a JSON-serialized snapshot of the state to all action Socket.io connections
function sendState (store) {
	return () => {
		store.getState().toJS()
	}
}
