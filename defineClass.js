"use strict"
function _super (klass, scope) {
	return {
		init: klass._super.prototype.init.bind(scope)
	}
}

function defineClass (superClass, props) {
	var events = props.events ? props.events : null;
	var fn = function () {
		this._type = fn;
		if (events !== null && events["beforeInit"] !== null) events["beforeInit"]();
		this.init.apply(this, arguments);
	};
	
	if (superClass !== null) {
		fn.prototype = new superClass();
		fn._super = superClass;
	} else {
		fn._super = null;
	}
	
	fn.prototype.constructor = fn;
	fn.prototype.init = function () {};
		 
	for (var key in props) {
		fn.prototype[key] = props[key];
	}
	
	return fn;
}






