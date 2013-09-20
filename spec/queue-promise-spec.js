var Q, Queue

try{
	Q= require("q")
}catch(ex){
	Q= require("../q")
}
try{
	Queue= require("q/queue")
}catch(ex){
	Queue= require("../queue")
}

global.Q= Q
require("./lib/jasmine-promise")

describe("queueing of promises", function(){
	it("should handle an in sequence triggering of promises", function(){
		var queue= Queue()
		queue.put(Q.delay(5).then(function(){
			return 5
		}))
		queue.put(Q.delay(30).then(function(){
			return 30
		}))
		return expectDequeue(queue,5,30)
	})

	it("should handle an out of order triggering of promises", function(){
		var queue= Queue()
		queue.put(Q.delay(30).then(function(){
			return 30
		}))
		queue.put(Q.delay(5).then(function(){
			return 5
		}))
		return expectDequeue(queue,30,5)
	})
})

function expectDequeue(queue){
	var expectations= Array.prototype.splice.call(arguments,0)
	expectations.shift()
	console.log("AT",expectations)
	function anExpect(val){
		var expected= expectations.shift()
		expect(val).toBe(expected)
		if(expectations.length)
			return queue.get().then(anExpect)
	}
	return queue.get().then(anExpect)
}
