const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const width = 640, height = 480
const lw = 1
const ms = 32

let keyRight = false,keyLeft = false,keySpace = false

addEventListener("keydown",(e) => {
if(e.key == "ArrowRight") keyRight = true
if(e.key == "ArrowLeft") keyLeft = true
if(e.key == " ") keySpace = true
if(e.key == "r") start()
})

addEventListener("keyup",(e) => {
if(e.key == "ArrowRight") keyRight = false
if(e.key == "ArrowLeft") keyLeft = false
if(e.key == " ") keySpace = false
})



function drawRect(x,y,w,h,col,stroke=false){
        ctx.fillStyle = col
        ctx.fillRect(x,y,w,h)
if(stroke){
        ctx.strokeRect(x+lw/2,y+lw/2,w-lw,h-lw)
}
}

class Rect{
constructor(x,y,w,h,col,stroke){
this.x = x
this.y = y
this.w = w
this.h = h
this.col = col
this.stroke = stroke
}
draw(){
drawRect(this.x, this.y, this.w, this.h, this.col, this.stroke)
}}

class Block extends Rect{
constructor(x,y,w=ms,h=ms,col="sienna",stroke){
super(x,y,ms,ms,col,stroke)
}
}

class Abyss extends Rect{
constructor(x,y){
super(x,y,ms,ms,"black")
}
}

class Player extends Rect{
constructor(x,y){
super(x,y,26,26,"white",true)
this.vx = 0
this.vy = 0
this.speed = 3
this.dir= 1
this.sjumpSpeed = -3
this.jumpSpeed = this.sjumpSpeed
}

move(){
if(keyRight) this.dir = 1
if(keyLeft) this.dir = -1
if(keyRight || keyLeft) this.vx = this.speed*this.dir
else this.vx = 0

this.vy += g

if(keySpace){
    if(this.jumpSpeed < 0){
        this.vy += this.jumpSpeed
    }
    this.jumpSpeed += g
}else{
     this.jumpSpeed = 0
}


this.beforColl()

this.x += this.vx
this.y += this.vy

abyss.forEach(a =>{
if(
this.x + this.w > a.x &&
this.x < a.x + a.w &&
this.y + this.h > a.y &&
this.y < a.y + a.h
){
start()
}
})

if(this.x < 0){
this.x = 0
}
}

beforColl(){
blocks.forEach(b =>{
if(this.y + this.h + this.vy > b.y &&
   this.y + this.vy < b.y + b.h &&
   this.x + this.w > b.x &&
   this.x < b.x + b.w){

if(this.vy > 0){
this.y = b.y - this.h
this.vy = 0
if(!keySpace){
        this.jumpSpeed = this.sjumpSpeed
}

}else if(this.vy < 0){
        this.y = b.y+b.h
        this.vy = 0
        this.jumpSpeed = 0
}

}
if(this.x+this.w+this.vx > b.x && this.x+this.vx < b.x+b.w && this.y+this.h > b.y &&  this.y < b.y+b.h){
        if(this.vx > 0){
                this.x = b.x-this.w
                this.vx = 0
        }else if(this.vx < 0){
                this.x = b.x+b.w
                this.vx = 0
        }
}

})
}



}

function init(){
        canvas.width = width
        canvas.height = height
        ctx.lineWidth = lw

        start()

        loop()
}


const g = 0.5

let player
let blocks = []
let abyss = []
let camX = 0

function start(){
blocks = []
for(let i = 0; i < map.length; i++){
for(let j = 0; j < map[0].length; j++){
let m = map[i][j]
if(m == 1) blocks.push(new Block(j*ms, i*ms))
if(m == 2) player = new Player(j*ms+3, i*ms+6)
if(m == 3) abyss.push(new Abyss(j*ms, i*ms))
}
}
}

function loop(){
        drawRect(0,0,width,height,"aliceblue")

        player.move()

        camX = player.x - width/2

        if(camX < 0) camX = 0

        blocks.forEach(block =>{
        drawRect(
        block.x - camX,
        block.y,
        block.w,
        block.h,
        block.col,
        block.stroke
        )
        })

        abyss.forEach(a =>{
        drawRect(
        a.x - camX,
        a.y,
        a.w,
        a.h,
        a.col
                )
                })

        drawRect(
        player.x - camX,
        player.y,
        player.w,
        player.h,
        player.col,
        player.stroke
        )

        requestAnimationFrame(loop)
}

onload = init