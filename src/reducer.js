import { setEntries, next, vote, INITIAL_STATE } from './core'

export default function reducer(state = INITIAL_STATE, action) {
	// Figure out which function to call and then call it

	switch (action.type) {
		case 'SET_ENTRIES':
			return setEntries(state, action.setEntries)
		case 'NEXT':
			return next(state)
		case 'VOTE':
			return vote(state, action.entry)
		default:
			return state
	}
}