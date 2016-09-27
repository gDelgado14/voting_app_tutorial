import { List, Map } from 'immutable'
import { expect } from 'chai'

import { setEntries, next, vote } from '../src/core'

describe('application logic', () => {
	describe('setEntries', () => {

		// Produce the first of the state trees we designed in 
		// immutable_spec.js
		it('adds the entries to the state', () => {
			const state = Map()
			const entries = List.of('Trainspotting', '28 Days Later')
			const nextState = setEntries(state, entries)
			
			expect(nextState).to.equal(Map({
				entries: List.of('Trainspotting', '28 Days Later')
			}))
		})

		// It should still be an Immutable List by the time it's in the state tree
		it('converts to immutable', ()=> {
			const state = Map()

			// using an MUTABLE structure
			const entries = ['Trainspotting', '28 Days Later']

			const nextState = setEntries(state, entries)
			expect(nextState).to.equal(Map({
				entries: List.of('Trainspotting', '28 Days Later')
			}))
		})
	})

	// We can begin the voting by calling a function called 'next' on a state
	// that already has entries set. This means going from one state tree
	// to another
	//
	// This function must also take care of transitioning from one pair
	// onto the next. Once the vote for a given pair is over, the winning
	// entry from the current vote should be kept, and added back to the end
	// of the entries, so that it will later be paired with something else
	// the losing entry is thrown away. If there is a tie, both entries are kept.
	describe('next', () => {

		// Should create a 'vote' Map on the state, where the
		// first entries are includedd under the key 'pair'.
		// The entries under vote should no longer be in the 'entries list'
		it('takes the next two entries under vote', () => {
			const state = Map({
				entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
			})
			const nextState = next(state)
			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later')
				}),
				entries: List.of('Sunshine')
			}))
		})

		it('puts winner of current vote back to entries', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 4,
						'28 Days Later': 2
					})
				}),
				entries: List.of('Sunshine', 'Millions', '127 Hours')
			})
			const nextState = next(state)
			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Sunshine', 'Millions')
				}),
				entries: List.of('127 Hours', 'Trainspotting')
			}))
		})

		it('puts both from tied vote back to entries', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 4,
						'28 Days Later': 4
					})
				}),
				entries: List.of('Sunshine', 'Millions', '127 Hours')
			})
			const nextState = next(state)
			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Sunshine', 'Millions')
				}),
				entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
			}))
		})

		// ending the vote ...
		it('marks winner when just one entry left', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 4,
						'28 Days Later': 2
					})
				}),
				entries: List()
			})
			const nextState = next(state)
			expect(nextState).to.equal(Map({
				winner: 'Trainspotting'
			}))
		})

	})

	// while a vote is ongoing, it should be possible for people to vote on entries.
	// When a new vote is cast for an entry, a "tally" for it should appear in the
	// vote. If there already is a tally for the entry, it should be incremented
	describe('vote', () => {

		// HOMEWORK
		// You could build all these nested Maps and Lists more concisely using
		// the fromJS function from Immutable.
		it('creates a tally for the voted entry', () => {
			const state = Map({
				pair: List.of('Trainspotting', '28 Days Later')
			})
			const nextState = vote(state, 'Trainspotting')
			expect(nextState).to.equal(Map({
				pair: List.of('Trainspotting', '28 Days Later'),
				tally: Map({
					'Trainspotting': 1
				})
			}))
		})

		it('adds to existing tally for the voted entry', () => {
			const state = Map({
				pair: List.of('Trainspotting', '28 Days Later'),
				tally: Map({
					'Trainspotting': 3,
					'28 Days Later': 2
				})
			})
			const nextState = vote(state, 'Trainspotting')
			expect(nextState).to.equal(Map({
				pair: List.of('Trainspotting', '28 Days Later'),
				tally: Map({
					'Trainspotting': 4,
					'28 Days Later': 2
				})
			}))
		})
	})
})