# Full Stack Redux Tutorial ([Link](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html#the-architecture))

### Notes

When designing an application, whether it's with a state container like Redux or not, it's a good idea to think about 
the design of the state. In other words, how do we model effectvely the data we're trying to present to users?

It's a good idea to draw out the state tree similar to how the author draws it in this tutorial.

One of the key benefits of the Flux architectural pattern is that the application state is all stored in one single tree structure. Everything there is to know about your application's state is stored in one data structure formed out of maps and arrays. This allows you to think about the application state in isolation fro mthe application's behaviour. The state is pure data. It doesn't have methods or functions. And it's all within one big object (at least in Redux).

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


Homework: 

1 - save voting collections in mongo

2 - allow users to login and create their own votes

Use passport and sessions with connect-mongo session store 

DO NOT USE JWTs ... 

understand the passport session + expression-session + connect-mongo flow

3 - add standard js linter 

4 - load to EC2 or Google cloud instance

5 - look at cire_spec vote function tests, and see whether you can refactor the `vote` function to use the `fromJS` function