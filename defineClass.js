"use strict";

// 寻找父类，再返回父类构造函数bind了子类this的wrapper
function _super (klass, scope) {
	return {
		init: klass._super.prototype.init.bind(scope)
	}
}

function defineClass (superClass, props) {
	var klass = function () {
		// type 不能删除，不能更改，可以枚举
		Object.defineProperty(this, "type", {
			configurable: false,
			enumerable: true,
			writable: false,
			value: klass
		});
		
		this.init.apply(this, arguments);
	};
	
	// 判断是否有需要继承
	if (superClass !== null) {
		klass.prototype = new superClass();
		Object.defineProperty(klass, "_super", {
			configurable: false,
			enumerable: true,
			writable: false,
			value: superClass
		});
	} else {
		Object.defineProperty(klass, "_super", {
			configurable: false,
			enumerable: true,
			writable: false,
			value: null
		});
	}
	
	Object.defineProperty(klass.prototype, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: klass
	});
	
	
	for (var key in props) {
		// init 不可枚举
		if (key === "init") {
			Object.defineProperty(klass.prototype, key, {
				configurable: false,
				enumerable: false,
				writeable: false,
				value: props[key]
			});
			continue ;
		}
		Object.defineProperty(klass.prototype, key, {
			configurable: false,
			enumerable: true,
			writeable: false,
			value: props[key]
		});
	}
	
	return klass;
}






