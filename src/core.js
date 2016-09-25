import { List, Map } from 'immutable'

/***************************
 * 		Public API
 *************************/


/**
 * set the entries within a state
 * 
 * @param {Immutable Map} state
 * @param {iterable} entries - can be any iterable and mutable / immutable data structure
 * @returns {Immutable Map} next state
 */
export function setEntries (state, entries) {
	// Entries should be an Immutable List by the time it's in the actual state tree
	return state.set('entries', List(entries))
}

/**
 * Initialize the voting of a pair of elements within the set of entries
 * 
 * @param {Immutable Map} state
 * @returns {Immutable Map} next state
 */
export function next(state) {
	const entries = state.get('entries')
					 .concat(getWinners(state.get('vote'))) // concatenate the winners of the current vote to the entries

	// Voting is done. We have a winner.
	// 
	// We could have just returned Map({winner: entries.first()}).
	// It is generally a good idea in these state transformation
	// functions to always morph the old state into the new one instead
	// of building the new state completely from scratch. This 'future proofs'
	// the application, as we may have more unrelated data in the state
	// that will be presisted because we explicitly morph the old state
	// rather than return the next state from scratch
	if (entries.size === 1)
		return state.remove('vote')
			        .remove('entries')
					.set('winner', entries.first())

	// https://facebook.github.io/immutable-js/docs/#/Map/merge
	return state.merge({
		vote: Map({ pair: entries.take(2) }),
		entries: entries.skip(2)
	})
}

/**
 * The app's voting functionality
 * 
 * Updates vote.tally['entry'] 
 * 
 * if the entry doesn't exist, set it to 0 and then immediately increment the value
 * to 1
 * 
 * if the entry already exists, simply increment it by 1
 * 
 * 
 * @param {Immutable Map} state
 * @param {Immutable Map Element} entry
 * @returns {Immutable Map} next state
 */
export function vote(state, entry) {
	// https://facebook.github.io/immutable-js/docs/#/Map/updateIn
	return state.updateIn(
		['vote', 'tally', entry],
		0,
		tally => tally + 1
	)
}



/***************************
 * 		Utils
 *************************/

// find the winners of a vote
function getWinners(vote) {
	if (!vote) return []
	
	const [a, b] = vote.get('pair')
	const aVotes = vote.getIn(['tally', a], 0)
	const bVotes = vote.getIn(['tally', b], 0)

	if (aVotes > bVotes) 	  return [a]
	else if (aVotes < bVotes) return [b]
	else 					  return [a, b] 
}

