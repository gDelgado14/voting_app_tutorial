// using babel-node from babel-cli to run this code

// Server logic 
import makeStore from './src/store'
import { startServer } from './src/server'

// export for use with a Node REPL by requiring index.js
export const store = makeStore()
startServer(store)


// load a set of test entries into the state
store.dispatch({
	type: 'SET_ENTRIES',
	entries: require('./entries.json')
})

// kick off the voting
store.dispatch({type: 'NEXT'})