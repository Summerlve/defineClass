### Just A Toy
---
```
var People = defineClass(null, {
	init: function (name, age) {
		this.name = name;
		this.age = age;
	},
	say: function () {
		console.log(this.name + " " + this.age);
	}
});

var p = new People("zhanghao", 22);
p.say();

var Student = defineClass(People, {
	init: function (name, age, stuId) {		
	    // the _super function will return a object include current class's superClass's constructor function, just like what's in python.
		_super(Student, this).init(name, age);
		this.stuId = stuId;
	},
	say: function () {
		console.log(this.name + " " + this.age + " " + this.stuId);
	}
});

var s = new Student("zhanghao", 22, 12261018);
s.say();
```




