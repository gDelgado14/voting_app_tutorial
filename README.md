# Full Stack Redux Tutorial ([Link](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html#the-architecture))

### Notes

When designing an application, whether it's with a state container like Redux or not, it's a good idea to think about 
the design of the state. In other words, how do we model effectvely the data we're trying to present to users?

It's a good idea to draw out the state tree similar to how the author draws it in this tutorial.

One of the key benefits of the Flux architectural pattern is that the application state is all stored in one single tree structure. Everything there is to know about your application's state is stored in one data structure formed out of maps and arrays. This allows you to think about the application state in isolation from the application's behaviour. The state is pure data. It doesn't have methods or functions. And it's all within one big object (at least in Redux).

This tutorial illustrates the beauty of [BDD / TDD](http://jrsinclair.com/articles/2016/gentle-introduction-to-javascript-tdd-intro/) ... the idea is to first think about the expected outcome, and then build it. This forces you to think about a good design. 

The core methodology is: 

1 - Red: Write a test and make sure it fails

2 - Green: Write the simplest, easiest possible code to make the test pass.

> This usually means starting off by hard coding the value that we expect to see

3 - Refactor: Optimise and/or simplify the application code, making sure that all the tests still pass

The application logic consists of multiple functions that return the new state of the application.

In order to test that the application logic is working as intended we organize our tests around classes, and organize the functionality of the classes around the different functions the class is intended to impolement. 

i.e. in the case of the application logic we have the application logic itself as the class, and the functions that mutate the state as the different functions of said class. 

Thus the tests for this aspect of the application are:

```javascript

import { expect } from 'chai'

describe('application logic', () => {
	describe('some_function', () => {

		it('should behave like this in this situation', () => {
			...
			// test the functionality
			let ooutcome = some_function(param)
			expect(outcome).to.equal(dummyTestValue)
		})
		
		it('should also behave like this in this OTHER situation', () => {
			...
			// test more of the functionality
			let outcome = some_function(param)
			...
			expect(outcome).to.equal(anotherDummyTestValue)	
		})
	})

	describe('some_other_function', () => {

		it('should behave like this in this situation', () => {
			...
			// test the functionality
			let outcome = some_other_function(param1, param2)
			expect(outcome).to.equal(dummyTestValue)
		})


		it('should also behave like this in this OTHER situation', () => {
			...
			// test more of the functionality
			let outcome = some_other_function(param1, param2)
			...
			..
			expect(outcome).to.equal(anotherDummyTestValue)	
		})
		
	})
})
``` 


#### On Redux Actions and Reducers 

An action describes the applications intent to change the state. The application does not alter the state directly, but rather Redux takes care of being the only source of state within the application.

> Every action must contain `type` attribute that describes which operation the action is for. Everything else about the action is up to the implementer's choice.

Facebook has [written](https://github.com/acdlite/flux-standard-action/blob/master/README.md) about good action design.

In the context of our app, this is what some actions would look like: 

```javascript
{type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']}

{type: 'NEXT'}

{type: 'VOTE', entry: 'Trainspotting'}

...

/*
	we must therefore have a mechanism to transform 
	actions into function invocations. We do this
	through 'Reducers'
	
*/

...
// This action
let voteAction = {type: 'VOTE', entry: 'Trainspotting'}
// should cause this to happen
return vote(state, voteAction.entry);

```

##### Reducers

Reducers return a new copy of the old state. 

If there is no defined state, then we must define the initial state and return it from within the reducer.

```javascript
(previousState, action) => newState
```

Note that if the reducer doesn't recognize the action, it just returns the current state.

What is interesting about the way this reducer works is how it can be generically used to take the application from one state to the next, fiven any type of action. Actually, given a collection of past actions, you can actually [reduce](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) that collection into the current state. That's why the function is called a reducer: It fullfills the contract of a reduce callback function.

> note that we are using plain objects as actions. This is required for Redux.


###### Reducer Composition

Each piece of functionality should only be aware of its own piece of state. We should pass it the smallest subtree of state required for it to do its necessary operations. This also simplifies tests.

The [Redux documentation](http://rackt.github.io/redux/docs/basics/Reducers.html) goes into detail about good reducer composition.


#### The Redux Store

The Redux Store is an object that stores the state of your application over time. It is the single source of truth for your application.

A Redux Store is initialized with a reducer function, such as the one we have just implemented.

The Store can be thought of as the application's controller. It uses the reducer to dictate the next state of the application. We `dispatch` actions to the Store, and out comes a new state thanks to the Reducer, which is then stored in the store. 

```javascript
// some_file.js
import {createStore} from 'redux';

const store = createStore(reducer);

//app_fle.js
// dispatching an action that the reducer understands
store.dispatch({type: 'NEXT'}) 
```

At any point in time, you can obtain the current state from inside the store: 

```javascript
store.getState();
```


#### Intro to Socket.IO

Not all browsers implement the WebSocket standard the same. Thus we need a wrapper to make real-time web-development seamless accross multiple devices & browsers. 


##### Broadcasting State from a Redux Listener
Our server should be able to let clients know about the current state of the application. It can do so by emitting a sockiet.io event to all connected clients.

In order for us to know when state has changed, we must subscribe to the store. We subscribe by providing a function that the store will call after every action it applies.


##### Receiving Remote Redux Actions
We should also be able to receive updates from clients. What we can do is have our clients emit '`action`' events that we feed directly into our Redux store.



--- 

### Homework: 

1 - save voting collections in mongo

2 - allow users to login and create their own votes

Use passport and sessions with connect-mongo session store 

DO NOT USE JWTs ... 

understand the passport session + expression-session + connect-mongo flow

3 - add standard js linter 

4 - load to EC2 or Google cloud instance

5 - look at core_spec vote function tests, and see whether you can refactor the `vote` function to use the `fromJS` function

6 - Optimize the sending of state to just send a diff of the relevant parts of the state that the client needs. 

note that currently we are sending the WHOLE state tree, not a subset of it. 

This is therefore a two part problem: 
	- figure out what subset the client needs
	- send a diff of the old and nextState

	
	
