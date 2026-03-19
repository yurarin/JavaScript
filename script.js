var Snakecanvas = document.getElementById("game")
var Snakectx = canvas.getContext("2d")

function Rectangle(){
 this.width=0
 this.height=0
 this.color="white"
 this.x=0
 this.y=0
}

function touching(a,b){
 return(
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y
 )
}

function random(min,max){
 return Math.floor(Math.random()*(max-min+1))+min
}

var dir = "right"

var snake = new Rectangle()
snake.width = 20
snake.height = 20
snake.color = "green"
snake.x = 200
snake.y = 200

var apple = new Rectangle()
apple.width = 20
apple.height = 20
apple.color = "red"

var score = 0
var bodies = []

var sw = "off"
var gameover = false
var pause = false

// STARTボタン
var startButton = new Rectangle()
startButton.width = 140
startButton.height = 60
startButton.color = "blue"
startButton.x = 130
startButton.y = 170

// STOPボタン
var stopButton = {
 x:370,
 y:30,
 r:20
}

// RESUMEボタン
var resumeButton = {
 x:330,
 y:30,
 r:20
}

function Food(){
 apple.x = random(0,19)*20
 apple.y = random(0,19)*20
}

function reset(){
 snake.x = 200
 snake.y = 200
 bodies = []
 dir = "right"
 score = 0
 gameover = false
 pause = false
 Food()
}

function over(){
 sw="off"
 gameover=true
}

Food()

document.addEventListener("keydown",(e)=>{
 if(sw!="on") return

 if(e.key=="ArrowUp" && dir!="down") dir="up"
 if(e.key=="ArrowDown" && dir!="up") dir="down"
 if(e.key=="ArrowLeft" && dir!="right") dir="left"
 if(e.key=="ArrowRight" && dir!="left") dir="right"
})

canvas.addEventListener("mousedown",(e)=>{

 var rect = canvas.getBoundingClientRect()
 var mx = e.clientX - rect.left
 var my = e.clientY - rect.top

 // START
 if(sw=="off" && !pause){
  if(
   mx > startButton.x &&
   mx < startButton.x + startButton.width &&
   my > startButton.y &&
   my < startButton.y + startButton.height
  ){
   reset()
   sw="on"
  }
 }

 // STOP
 if(sw=="on"){
  var dx = mx - stopButton.x
  var dy = my - stopButton.y
  var dist = Math.sqrt(dx*dx + dy*dy)

  if(dist < stopButton.r){
   pause = true
   sw="off"
  }
 }

 // RESUME
 if(pause){
  var dx = mx - resumeButton.x
  var dy = my - resumeButton.y
  var dist = Math.sqrt(dx*dx + dy*dy)

  if(dist < resumeButton.r){
   pause = false
   sw="on"
  }
 }

})

setInterval(()=>{

 if(sw=="on"){

  bodies.unshift({x:snake.x,y:snake.y})

  if(dir=="up") snake.y -=20
  if(dir=="down") snake.y +=20
  if(dir=="left") snake.x -=20
  if(dir=="right") snake.x +=20

  if(bodies.length>score) bodies.pop()

  if(
   snake.x<0 || snake.x>=400 ||
   snake.y<0 || snake.y>=400
  ){
   over()
  }

  for(let i=0;i<bodies.length;i++){
   if(snake.x==bodies[i].x && snake.y==bodies[i].y){
    over()
   }
  }

  if(touching(snake,apple)){
   score++
   Food()
  }

 }

},200)

function draw(){

 ctx.fillStyle="black"
 ctx.fillRect(0,0,400,400)

 ctx.fillStyle=apple.color
 ctx.fillRect(apple.x,apple.y,apple.width,apple.height)

 ctx.fillStyle="green"
 ctx.fillRect(snake.x,snake.y,20,20)

 bodies.forEach(b=>{
  ctx.fillRect(b.x,b.y,20,20)
 })

 ctx.fillStyle="white"
 ctx.font="20px Arial"
 ctx.fillText("SCORE : "+score,10,20)

 // STOPボタン
 if(sw=="on"){
  ctx.fillStyle="Red"
  ctx.beginPath()
  ctx.arc(stopButton.x,stopButton.y,stopButton.r,0,Math.PI*2)
  ctx.fill()

  ctx.fillStyle="white"

  ctx.fillRect(stopButton.x - 6, stopButton.y - 8, 4, 16)
  ctx.fillRect(stopButton.x + 2, stopButton.y - 8, 4, 16)
 }

 // RESUMEボタン
 if(pause){
  ctx.fillStyle="Red"
  ctx.beginPath()
  ctx.arc(resumeButton.x,resumeButton.y,resumeButton.r,0,Math.PI*2)
  ctx.fill()

  ctx.fillStyle="white"
  ctx.beginPath()
  ctx.moveTo(resumeButton.x-6,resumeButton.y-8)
  ctx.lineTo(resumeButton.x+8,resumeButton.y)
  ctx.lineTo(resumeButton.x-6,resumeButton.y+8)
  ctx.fill()
 }

 // START
 if(sw=="off" && !pause){
  ctx.fillStyle="blue"
  ctx.fillRect(startButton.x,startButton.y,startButton.width,startButton.height)

  ctx.fillStyle="white"
  ctx.font="30px Arial"
  ctx.fillText("START",150,210)
 }

 // GAME OVER
 if(gameover){
  ctx.fillStyle="red"
  ctx.font="40px Arial"
  ctx.fillText("GAME OVER",90,140)
 }

 requestAnimationFrame(draw)
}

draw()