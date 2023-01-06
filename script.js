var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");
const zoom = 10
//canvas
const C = {w:canvas.width / zoom, h:canvas.height / zoom}
const toDeg = x => x * 180 / Math.PI
const toRad = x => x / 180 * Math.PI
const C2V=(cx,cy)=>new vec(cx*V.w/C.w,cy*V.h/C.h,V.d)

//classes
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
class sphere {
	constructor(pos,r,clr) {
		this.pos=pos
		this.r=r||1
		this.color=clr||[0,0,0]
	}
}
// draw
function set(x, y, rgb=[0,0,0]) {
	rgb=rgb.map(e=>e*0xFF)
	ctx.fillStyle = `rgb(${rgb.toString()})`
	ctx.fillRect((x+C.w/2-0.5) * zoom, (y+C.w/2-0.5) * zoom, zoom, zoom);
}
function clear() {
	ctx.clearRect(0, 0, C.w, C.h);
}


//World
let V={w:1,h:1,d:1}
let O = new vec(0, 0, 0)

let scene={
	background:[0,0,0],
	spheres:[
		new sphere(new vec(3,0,10),1,[0,1,0]),
		new sphere(new vec(-3,-4,10),1,[1,0,1]),
		new sphere(new vec(0,0,10),0.8,[1,0,0]),
		new sphere(new vec(-1,1,11),2.1,[1,1,1])
	]
}
//ray tracing
function trace(O, D, t_min, t_max) {
    let closest_t = Infinity
    let closest_sphere = null
    for (sphere of scene.spheres) {
		// console.log(sphere)
        let [t1, t2] = IntersectRaySphere(O, D, sphere)
		// console.log(t1,t2)
        if (t_min<t1<t_max && t1 < closest_t) {
            closest_t = t1
            closest_sphere = sphere
    	}
        if (t_min<t2<t_max && t2 < closest_t) {
            closest_t = t2
            closest_sphere = sphere
        }
    }
    if (closest_sphere == null) {
       return scene.background
    }
	// console.log(closest_t)
    return closest_sphere.color.map(e=>(1-(closest_t/10))*10*e)
}
function IntersectRaySphere(O, D, sphere) {
	// console.warn(O,D,sphere)
	let r = sphere.r
    let CO = vec.add(O,vec.prod(sphere.pos,-1))

    let a = vec.dot(D, D)
    let b = 2*vec.dot(CO, D)
    let c = vec.dot(CO, CO) - r*r

    let discriminant = b*b - 4*a*c
    if (discriminant < 0) {
        return [Infinity,Infinity]
    }
    t1 = (-b + Math.sqrt(discriminant)) / (2*a)
    t2 = (-b - Math.sqrt(discriminant)) / (2*a)
	// console.log(t1,t2,b,discriminant,a)
    return [t1, t2]
}
//test render
console.log(C)
function draw() {
	for (x=-C.w/2;x<=C.w/2;x++) {
		for (y=-C.h/2;y<=C.h/2;y++) {
			//set(i,j,[((i*j)/10)%1,((i+j)/10)%1,(i/j*10)%1])
			let D=C2V(x,y)
			let color=trace(O,D,1,Infinity)
			// console.log(x,y,D,color)
			set(x,y,color)
		}
	}
}
setInterval(function(){
	draw()
	scene.spheres[0].pos.x-=0.01
},10)
console.info('Terminated without error')
