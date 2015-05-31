"use strict";
// 通用函数
var types = ["Undefined", "Null", "String", "Boolean", "Number", "Object", "Function", "Array"];
types.forEach(function (value) {
	window["is" + value] = new Function("o", "return Object.prototype.toString.call(o) === '[object " + value + "]'");
});

// defineClass
// 返回父类的构造函数，用于继承时借用构造函数
function _super (klass, that) {
	return {
		init: klass._super.prototype.init.bind(that)
	};
}

function defineClass (className, superClass, props) {
	// className必须是String
	if (!isString(className)) throw new TypeError("className must be string");
	
	// TO-DO 单重继承，待议。
	// 在这个体系内，继承只支持单重继承，单继承，不包括自带的类。
	// if (superClass !== null && superClass._super) throw new Error("继承只支持单重继承，单继承");
	
	// superClass为可选项，值为null或者一个类(function)
	if (superClass !== null && typeof superClass !== "function") throw new TypeError("superClass is opptional, if the class dont inherit any superclass, must choose null here");
	// props必须是obj
	if (!isObject(props)) throw new TypeError("props must be a obj");
	// props必须包含init函数
	if (isObject(props) && isUndefined(props.init)) throw new Error("must have a init function"); 
	
	// 邪恶的eval，等同于下面注释的函数。
	var klassString = [];
	klassString.push("(function " + className +" () {");
	klassString.push("if (!(this instanceof klass)) throw new Error(\"use 'new' keyword to create instance\");");
	klassString.push("Object.defineProperty(this, 'type', {configurable: false,enumerable: true,writable: false,value: " + className + "});");
	klassString.push("this.init.apply(this, arguments);");
	klassString.push("})");
	var klass = eval(klassString.join("\r\n"));
	
	/*	
	function klass () {
		// 安全的构造函数
		if (!(this instanceof klass)) throw new Error("use 'new' keyword to create instance");
		// type 不能删除，不能更改，可以枚举
		Object.defineProperty(this, "type", {
			configurable: false,
			enumerable: true,
			writable: false,
			value: klass
		});
		
		this.init.apply(this, arguments);
	}
	*/
	
	// 判断是否有需要继承，使用：借用构造函数和原型链继承。
	var needInherit = isFunction(superClass);
	klass.prototype = needInherit ? new superClass() : klass.prototype;
	
	Object.defineProperties(klass, {
		// 添加父类，可以是null或者一个类
		_super: {
			configurable: false,
			enumerable: false,
			writable: false,
			value: superClass
		},
		// 用于添加类属性和方法的函数
		classProps: {
			configurable: false,
			enumerable: false,
			writable: false,
			value: function (props) {
				// props必须是obj
				if (!isObject(props)) throw new TypeError("props must be a obj");
				for (var key in props) {
					Object.defineProperty(this, key, {
						configurable: false,
						enumerable: true,
						writable: isFunction(props[key]) ? false : true,
						value: props[key]
					});
				}
				
				return this;
			}
		}
	});
	
	Object.defineProperties(klass.prototype, {
		// 将原型对象的constructor指回构造函数
		constructor: {
			configurable: false,
			enumerable: false,
			writable: true,
			value: klass
		}
	});
	
	// 将方法导入klass的原型对象中
	for (var key in props) {
		// init 不可枚举，不能删除，不能更改
		Object.defineProperty(klass.prototype, key, {
			configurable: false,
			enumerable: key === "init" ? false : true,
			writeable: false,
			value: props[key]
		});
	}
	
	return klass;
}

// unittest，单元测试。
var log = console !== null && isFunction(console.log) ? console.log.bind(console) : void 0;

// 自定义的错误类型
var EqualsError = defineClass("EqualsError", Error, {
	init: function (message) {
		this.name = "EqualsError";
		this.message = message;
	}
});

var BooleanError = defineClass("BooleanError", Error, {
	init: function (message) {
		this.name = "BooleanError";
		this.message = message;
	}
});

var ErrorTypeError = defineClass("ErrorTypeError", Error, {
	init: function (message) {
		this.name = "ErrorTypeError";
		this.message = message;
	}
}); 

// 断言
function assertTrue (a) {
	if (a !== true) throw new BooleanError(a + "(" + typeof a + ")" + " isn't true");
}

function assertEquals (a, b) {
	if (a !== b) throw new EqualsError(a + "(" + typeof a + ")" + " isn't equals to " + b + "(" + typeof b + ")");
};

// TO-DO assertErrorType为草稿，待议。
function assertErrorType (errorType, fn){
	try {
		fn();
	} catch (error) {
		if (error.name !== errorType) throw new ErrorTypeError("It's " + error.name + " not " + errorType);
	}
}

// 单元测试类
var UnitTest = defineClass("UnitTest", null, {
	init: function () {
		this.passed = 0;
		this.failed = 0;
		this.testCases = new Queue();
	},
	addTestCase: function (name, fn) {
		if (!isFunction(fn)) throw new TypeError("fn must be a function");
		this.testCases.enqueue({
			name: name,
			fn: fn,
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
			result.appendChild(document.createTextNode(" (failed) {" + error.name + ": " + error.message + "}"));
			++ this.failed;
		}
		
		return result;
	},
	run: function () {
		var start = Date.parse(new Date());
		var fragment = document.createDocumentFragment();
		
		// 运行所有的testCase
		var index = 1;
		this.testCases.foreach(function (cur) {
			fragment.appendChild(this.runTestCase(index, cur.name, cur.fn));
			++ index;
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
		var range = end - start;
		div = document.createElement("div");
		div.style.color = "red";
		div.appendChild(document.createTextNode("Time: " + range + "ms"));
		fragment.appendChild(div);
		
		finallyResults.appendChild(fragment);
		document.body.appendChild(finallyResults);
		this.testCases = null;
	}
});

// 简单的Stack和Queue实现
var Node = defineClass("Node", null, {
	init: function (item) {
		this.item = item;
		this.next = null;
	}
});

var Stack = defineClass("Stack", null, {
	init: function () {
		this.first = null;
		this.N = 0;
	},
	size: function () {
		return this.N;
	},
	isEmpty: function () {
		return this.first === null;
	},
	push: function (item) {
		var oldfirst = this.first;
		this.first = new Node(item);
		this.first.next = oldfirst;
		++ this.N;
		return this;
	},
	pop: function () {
		if (this.isEmpty()) throw "Stack为空";
		var item = this.first.item;
		this.first = this.first.next;
		-- this.N;
		return item;
	},
	foreach: function (fn, that) {
		if (this.isEmpty()) throw "Stack为空";
		var cur = this.first;
		while (cur !== null) {
			fn.call(that, cur.item);
			cur = cur.next;
		}
	}
});

var Queue = defineClass("Queue", null, {
	init: function () {
		this.first = null;
		this.last = null;
		this.N = 0;
	},
	size: function () {
		return this.N;
	},
	isEmpty: function () {
		return this.first === null;
	},
	enqueue: function (item) {
		var oldlast = this.last;
		this.last = new Node(item);
		if (this.isEmpty()) {
			this.first = this.last;
		} else {
			oldlast.next = this.last;
		}
		++ this.N;
		return this;
	},
	dequeue: function (item) {
		if (this.isEmpty()) throw new Error("Queue为空");
		var item = this.first.item;
		this.first = this.first.next;
		if (this.isEmpty()) this.last = null;
		-- this.N;
		return item;
	},
	foreach: function (fn, that) {
		if (this.isEmpty()) throw new Error("Queue为空"); 
		var cur = this.first;
		while (cur !== null) {
			fn.call(that, cur.item);
			cur = cur.next;
		}
	}
});

// 十进制数转换成二进制数
function ten2two(num) {
	var quotient = num;
	var remainder = [];
	while (quotient !== 0) {
		quotient = Math.floor(num / 2);
		remainder.push(num - 2 * quotient);
		num = quotient;
	}
	
	var result = "";	
	while (remainder.length > 0) {
		result += remainder.pop();
	}
	return result;
}
		

	



