"use strict";
var EqualsError = function (message) {
	this.name = "EqualsError";
	this.message = message;
};
EqualsError.prototype = new Error();
EqualsError.prototype.constructor = EqualsError;

var BooleanError = function (message) {
	this.name = "BooleanError";
	this.message = message;
};
BooleanError.prototype = new Error();
BooleanError.prototype.constructor = BooleanError;

var ErrorTypeError = function (message) {
	this.name = "ErrorTypeError";
	this.message = message;
};
ErrorTypeError.prototype = new Error();
ErrorTypeError.prototype.constructor = ErrorTypeError;

function assertTrue (a) {
	if (a !== true) throw new BooleanError("Isn't true");
}

function assertEquals (a, b) {
	if (a !== b) throw new EqualsError(a + " isn't equal to " + b)
};

function assertErrorType (errorType, fn){
	try {
		fn();
	} catch (error) {
		if (error.name !== errorType) throw new ErrorTypeError("It's " + error.name + " not " + errorType);
	}
}

var unittest = function () {
	this.passed = 0;
	this.failed = 0;
	this.save = [];
};

unittest.prototype = {
	constructor: unittest,
	
	addTestCase: function (name, fn) {
		this.save.push({
			name: name,
			fn: fn
		});
		
		return this;
	},
	runTestCase: function (index ,name, fn) {
		var result = document.createElement("div");
		result.style.fontFamily = "Monaco";
		result.style.fontSize = "18px";
		result.appendChild(document.createTextNode(index + ": " + name));
		
		try {
			fn();
			result.style.color = "green";
			++ this.passed;
		} catch (error) {
			result.style.color = "red";
			result.appendChild(document.createTextNode(" (failed) {" + error.name + " : " + error.message + "}"));
			++ this.failed;
		}
		
		return result;
	},
	run: function () {
		var start = Date.parse(new Date());
		var fragment = document.createDocumentFragment();
		
		this.save.forEach(function (cur, index, arr) {
			fragment.appendChild(this.runTestCase(index, cur.name, cur.fn));
		}, this);
		document.body.appendChild(fragment);

		var finallyResults = document.createElement("div");
		finallyResults.style.marginTop = "30px";
		finallyResults.style.fontFamily = "Monaco";
		finallyResults.style.fontSize = "18px";
		
		fragment = document.createDocumentFragment();
		
		var div = document.createElement("div");
		div.style.color = "grey";
		div.appendChild(document.createTextNode("---------------"));
		fragment.appendChild(div);
		
		div = document.createElement("div");
		div.style.color = "grey";
		div.appendChild(document.createTextNode("finallyResults: "));
		fragment.appendChild(div);
		
		div = document.createElement("div");
		div.style.color = "green";
		div.appendChild(document.createTextNode("Passed: " + this.passed));
		fragment.appendChild(div);
		
		div = document.createElement("div");
		div.style.color = "red";
		div.appendChild(document.createTextNode("Failed: " + this.failed));
		fragment.appendChild(div);
		
		var end = Date.parse(new Date());
		var range = (end - start) / 1000;
		div = document.createElement("div");
		div.style.color = "red";
		div.appendChild(document.createTextNode("Time: " + range + "s"));
		fragment.appendChild(div);
		
		finallyResults.appendChild(fragment);
		document.body.appendChild(finallyResults);
	}
};