"use strict";
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
