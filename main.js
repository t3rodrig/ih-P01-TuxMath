// CONFIGURACIÓN

let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let player;
let asteroidsArr;

let interval;
let frames;

// CLASES

class Characters {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw (){
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Users extends Characters {
    constructor(){
        let x = canvas.width/2;
        let y = canvas.height * 0.95;
        let width = 20;
        let height = 20;
        super(x, y, width, height);
        this.input = "";
    }
}

class Asteroids extends Characters {
    constructor(x,y){
        let width = 20;
        let height = 20;
        super(x, y, width, height);

        this.vy = 2;
        this.A = Math.round(Math.random() * 19);
        this.B = Math.round(Math.random() * 19);
        this.answer = this.A + this.B;
    }

    draw(){
        ctx.font = "40px Arial";
        this.y += this.vy;
        ctx.fillText(`${this.A} + ${this.B} = ?`, this.x, this.y);
    }
} 

// INSTANCIAS

// FUNCIONES COMPLEMENTARIAS

function isValidKey(code){
    return (code >= 48 && code <= 57) ||
           (code == 13) || (code == 8);
}

function isEndOfLine(code){
    return code == 13;
}

function generateAsteroids(){
    if (frames % 100 == 0){
        let x = 40 + Math.floor(Math.random() * (canvas.width - 230));
        let y = 40;
        let asteroid = new Asteroids(x,y);
        asteroidsArr.push(asteroid);
    }
}

function drawAsteroids(){
    asteroidsArr.forEach((item)=>{
        item.draw();
    });
}

// FUNCIONES PRINCIPALES

function update(){
    frames += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    generateAsteroids();
    drawAsteroids();
    // checkCollition
    // gameOver
}

// EVENTOS

document.getElementById("start-game-button").onclick = () => {
    frames = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player = new Users();
    asteroidsArr = [];
    clearInterval(interval);
    interval = setInterval(update, 1000/60);
}

document.onkeydown = (event) => {
    if (isValidKey(event.keyCode)){
        console.log(`The press key is: ${event.key}`);
        if (!isEndOfLine(event.keyCode)){
            if (event.keyCode != 8){
                player.input += event.key;
            } else {
                player.input = ""
            }
        } else {
            console.log("input: ",player.input);
            if (player.input == asteroid.answer){
                alert("Good job")
            } else {
                alert("try again")
                player.input = ""
            }
        }
    }
}