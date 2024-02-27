const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const circleElement = document.querySelector('.circle');

canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;

class Particle{
    constructor(x, y, effect){
        this.originX = x;
        this.originY = y;
        this.effect = effect;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.ctx = this.effect.ctx;
        this.ctx.fillStyle = 'rgb(142, 141, 138 )';
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.2;
        this.friction = 0.95;
        this.dx = 0;
        this.dy = 0;
        this.distance = 0;
        this.force = 0;
        this.angle = 0;
        // this.size = Math.floor(Math.random() * 4);
        this.size = 1.5;
        this.draw();
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.fillRect(this.x, this.y, this.size, this.size)
    }

    update(){
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = this.dx * this.dx + this.dy * this.dy;
        this.force = -this.effect.mouse.radius / this.distance * 8;

        if(this.distance < this.effect.mouse.radius){
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
        }

        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        this.draw()
    }
}


class Effect {
    constructor(width, height, context){
        this.width = width;
        this.height = height;
        this.ctx = context;
        this.particlesArray = [];
        this.gap = 30;
        this.mouse = {
            radius: 2000,
            x: 0,
            y: 0
        }
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX * window.devicePixelRatio;
            this.mouse.y = e.pageY * window.devicePixelRatio;
        })

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = window.innerHeight * window.devicePixelRatio;
            this.width = canvas.width
            this.height = canvas.height
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        
            this.particlesArray = [];
            this.init();
        })
        this.init();
    }

    init(){
        for(let x = 0; x < this.width; x += this.gap){
            for(let y = 0; y < this.height; y += this.gap){
                this.particlesArray.push(new Particle(x, y, this))
            }
        }
    }

    update(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        for(let i = 0; i < this.particlesArray.length; i++){
            this.particlesArray[i].update();
        }
    }
}

let effect = new Effect(canvas.width, canvas.height, ctx);
function animate(){
    effect.update();
    requestAnimationFrame(animate)
}
animate()

const mouse = {x:0, y:0};
const previousMouse = {x:0, y:0};
const circle = {x:0, y:0};
let currentScale = 0;
let currentAngle = 0;

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

const speed = 0.17;

const tick = () => {

    circle.x += (mouse.x - circle.x) *speed;
    circle.y += (mouse.y - circle.y) *speed;

    circleElement.style.transform = `translate(${circle.x}px, ${circle.y}px)`;

    const translateTransform = `translate(${circle.x}px, ${circle.y}px)`
    // sqeeze
    const deltaMouseX = mouse.x - previousMouse.x;
    const deltaMouseY = mouse.y - previousMouse.y;
    previousMouse.x = mouse.x;
    previousMouse.y = mouse.y;

    const mouseVelocity = Math.min(Math.sqrt(deltaMouseX**2 + deltaMouseY**2)* 4, 150);

    const scaleValue = (mouseVelocity / 150) * 0.5;
    currentScale += (scaleValue - currentScale) * speed;
    const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

    // rotate
    const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
    if (mouseVelocity > 20 ){
        currentAngle = angle;
    }
    const rotateTransform = `rotate(${angle}deg)`;

    // apply all transformation
    circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;
    window.requestAnimationFrame(tick);
}
tick();

// project
// gsap.registerPlugin(ScrollTrigger);

// const textElements = gsap.utils.toArray(".text_proj");

// textElements.forEach((text) => {
// 	gsap.to(text, {
// 		backgroundSize: "100%",
// 		ease: "none",
// 		scrollTrigger: {
// 			trigger: text,
// 			start: "center 80%",
// 			end: "center 20%",
// 			scrub: true,
// 		},
// 	});
// });