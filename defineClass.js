"use strict"

function isinstance (o, c) {
	var types = o._type;
	return c in types;
}

function _super (klass, scope) {
	return {
		init: klass._super.prototype.init.bind(scope)
	}
}

function defineClass (superClass, props) {
	var events = props.events ? props.events : null;
	var fn = function () {
		var types = []
		this.type = fn;
		if (events !== null && typeof events["beforeInit"] === "function") events["beforeInit"]();
		this.init.apply(this, arguments);
	};
	
	if (superClass !== null) {
		fn.prototype = new superClass();
		fn._super = superClass;
	} else {
		fn._super = null;
	}
	
	Object.defineProperties(fn.prototype, {
		constructor: {
			configurable: false,
			enumerable: false,
			writeable: false,
			value: fn
		}
	});
	
	fn.prototype.init = function () {};
		 
	for (var key in props) {		
		Object.defineProperty(fn.prototype, key, {
			configurable: false,
			enumerable: true,
			writeable: true,
			value: props[key]
		});
	}
	
	return fn;
}






