// CONFIGURACIÓN

let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

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
        let y = canvas.height * 0.80;
        let width = 168;
        let height = 110;
        super(x, y, width, height);
        this.life = 3;
        this.input = "";
        this.imgConsole = new Image();
        this.imgConsole.src = "./images/tux/console_led.png"; // 168 x 110
    }

    draw (){
        ctx.drawImage(this.imgConsole, this.x, this.y, this.width, this.height);
    }
}

class Asteroids extends Characters {
    constructor(x,y){
        let width = 20;
        let height = 20;
        super(x, y, width, height);

        this.vy = 0.5;
        this.A = Math.round(Math.random() * 19);
        this.B = Math.round(Math.random() * 19);
        this.answer = this.A + this.B;
    }

    draw(){
        ctx.font = "40px Arial";
        ctx.fillStyle = "black";
        this.y += this.vy;
        ctx.fillText(`${this.A} + ${this.B} = ?`, this.x, this.y);
    }

    crashWith(){
        let floor = canvas.height - 40;

        return (this.y >= floor);
    }
} 

// INSTANCIAS e INICIALIZACIONES

let player = new Users();
let asteroidsArr = [];

let interval;
let frames = 0;

// FUNCIONES COMPLEMENTARIAS

function isValidKey(code){
    `valid keys are: 
    * numbers (48-57)
    * enter key (13)
    * backspace (8)`

    return (code >= 48 && code <= 57) ||
           (code == 13) || (code == 8);
}

function isEndOfLine(code){
    `Enter key`

    return code == 13;
}

function generateAsteroids(){
    if (frames % 350 == 0){
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

function checkCollision(){
    asteroidsArr.forEach((item, index)=>{
        if(item.crashWith()){
            console.log("A collision");
            asteroidsArr.splice(index, 1);
        }
    });
}

function checkInput(){
    asteroidsArr.forEach((asteroid, index) => {
        // console.log("input: ",player.input);
        if (player.input == asteroid.answer){
            console.log("Good job");
            asteroidsArr.splice(index, 1);
            player.input = "";
        } else {
            console.log("Try again");
            player.input = "";
        }
    });
}

function writeUserInput(user){
    let string = user.input;
    let digits = 2;
    let x = user.x;
    let y = user.y;
    let space = 60;
    let letter;
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";

    if (string.length < digits){
        string = "0".repeat(digits - string.length) + string;
    } else if(string.length > digits){
        string = string.slice(-digits, string.length);
    }

    ctx.fillText(string, x, y);
}

// FUNCIONES PRINCIPALES

function update(){
    frames += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generateAsteroids();
    drawAsteroids();
    player.draw();
    writeUserInput(player);
    checkCollision();
    // gameOver
}

// EVENTOS

document.getElementById("start-game-button").onclick = () => {
    // toggle start -> stop
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearInterval(interval);
    interval = setInterval(update, 1000/60);
}

document.onkeydown = (event) => {
    if (isValidKey(event.keyCode)){
        // console.log(`The press key is: ${event.key}`);
        if (!isEndOfLine(event.keyCode)){
            if (event.keyCode != 8){ // key != "Backspace"
                player.input += event.key;
            } else {
                player.input = ""
            }
        } else {
            checkInput();
        }
    }
}