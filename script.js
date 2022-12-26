var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");
const zoom = 10
const [width, height] = [canvas.width / zoom, canvas.height / zoom]
const toDeg = x => x * 180 / Math.PI
const toRad = x => x / 180 * Math.PI
// x-axis: fwd   y-axis: right  z-axis: up
function set(x, y, i = 0) {
	i *= 255
	i = 1 - i / 255;
	ctx.fillStyle = 'rgba(0,0,0,' + i + ')';
	ctx.fillRect(x * zoom, y * zoom, zoom, zoom);
}
function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
class vec {
	constructor(x, y, z) {
		this.x = x || 0
		this.y = y || 0
		this.z = z || 0
	}
	//v.yaw
	get rxy() {
		let x = Math.atan2(this.y, this.x)
		return x >= 0 ? x : x + 2 * Math.PI
	}
	set rxy(theta) {
		this.x = this.length * Math.cos(theta)
		this.y = this.length * Math.sin(theta)
	}
	//v.roll
	get rzy() {
		let x = Math.atan2(this.y, this.z)
		return x >= 0 ? x : x + 2 * Math.PI
	}
	set rzy(theta) {
		this.z = this.length * Math.cos(theta)
		this.y = this.length * Math.sin(theta)
	}
	//magnitude
	get length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
	}
	//normal
	get norm() {
		return vec.prod(this, 1 / this.length)
	}
	//vector operators
	static add(a, b) {
		return new vec(a.x + b.x, a.y + b.y, a.z + b.z)
	}
	static prod(a, c) {
		return new vec(a.x * c, a.y * c, a.z * c)
	}
	static dot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z
	}
}
let a = new vec(3, 4, 0)
a.rxy = 0
console.log(a)


for (i = 0; i < width; i++) {
	for (j = 0; j < height; j++) {
		if (i % 2 | j % 2) set(i, j, (i * j / width / width))
	}
}
