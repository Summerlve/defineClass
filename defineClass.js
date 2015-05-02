"use strict";

// 返回父类的构造函数
function _super (klass, scope) {
	return {
		init: klass._super.prototype.init.bind(scope)
	}
}

function classMethod () {}

function defineClass (superClass, props) {
	// 继承只支持单重继承，单继承
	if (superClass !== null && superClass._super !== null) throw new Error("继承只支持单重继承，单继承");
	// superClass为可选项，值为null或者一个类
	if (superClass !== null && typeof superClass !== "function") throw new TypeError("superClass is opptional, if the class dont inherit any class, must choose null here");
	// props必须是obj
	if (!(props instanceof Object)) throw new TypeError("props must be a obj");
	var klass = function () {
//		if (!(this instanceof kalss)) throw new Error("dont forget the keyword 'new'");
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
	if (typeof superClass === "function") {
		klass.prototype = new superClass();
		Object.defineProperty(klass, "_super", {
			configurable: false,
			enumerable: false,
			writable: false,
			value: superClass
		});
	} else {
		Object.defineProperty(klass, "_super", {
			configurable: false,
			enumerable: false,
			writable: false,
			value: null
		});
	}
	
	// 将原型的constructor指回构造函数
	Object.defineProperty(klass.prototype, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: klass
	});
	
	// 将方法导入klass的原型
	for (var key in props) {
		// init 不可枚举，不能删除，不能更改
		if (key === "init") {
			Object.defineProperty(klass.prototype, key, {
				configurable: false,
				enumerable: false,
				writeable: false,
				value: props[key]
			});
		} else {
			Object.defineProperty(klass.prototype, key, {
				configurable: false,
				enumerable: true,
				writeable: false,
				value: props[key]
			});
		}
	}
	
	return klass;
}


// 简单的Stack和Queue实现
var Node = defineClass(null, {
	init: function (item) {
		this.item = item;
		this.next = null;
	}
});

var Stack = defineClass(null, {
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
	foreach: function (fn) {
		if (this.isEmpty()) throw "Stack为空";
		var cur = this.first;
		while (cur !== null) {
			fn.call(null, cur.item);
			cur = cur.next;
		}
	}
});

var Queue = defineClass(null, {
	init: function () {
		this.first = null;
		this.last = null;
		this.N = 0
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
	foreach: function (fn) {
		if (this.isEmpty()) throw new Error("Queue为空"); 
		var cur = this.first;
		while (cur !== null) {
			fn.call(null, cur.item);
			cur = cur.next;
		}
	}
});




