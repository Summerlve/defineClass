"use strict"
var People = defineClass(null, {
	init: function (name, age) {
		this.name = name;
		this.age = age;
	},
	say: function () {
		console.log(this.name + " " + this.age);
	}
})

var Student = defineClass(People, {
	init: function (name, age, stuId) {		
		_super(Student, this).init(name, age);
		this.stuId = stuId;
	},
	say: function () {
		console.log(this.name + " " + this.age + " " + this.stuId);
	}
});
		
var thr = defineClass(Student, {
	init: function (name, age, stuId, score) {
		_super(thr, this).init(name, age, stuId);
		this.score = score;
	},
	events: {
		
	},
	say: function () {
		console.log(this.name + this.age + this.stuId + this.num);
	}
});

var t = new thr("zhanghao", 22, 1226, 123123);
//		t.say();

console.log("枚举");

for (var key in t) {
	console.log(key);
}