// CONFIGURACIÓN

let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

let gameBtn = document.getElementById("game-button");
let music = document.getElementById("music");
let cheer = document.getElementById("cheer");
let buzz = document.getElementById("buzz");
let explosion = document.getElementById("explosion");

canvas.width = 800;
canvas.height = 600;

let txt = `"TuxMath" is an educational game starring
Tux. Tux must defend his city by solving 
math problems.

Use the number keys on the keyboard to 
answer math equations, and then hit enter.

If you don't answer a comet's math equation 
before it crashes, Tux loses a heart.

When you lose all of your hearts, 
the game ends.`

ctx.font = '30px Courier';
ctx.fillStyle = "white";

let xPos = 20;
let yPos = 50;
let lineheight = 35;
let lines = txt.split('\n');

for (let i = 0; i<lines.length; i++)
    ctx.fillText(lines[i], xPos, yPos + (i*lineheight) );

let tuxImg = new Image()
tuxImg.src = "./images/tux/bigtux0.png"

tuxImg.onload = () => ctx.drawImage(tuxImg, 
    650, 
    460,
    110, 140);

// window.location.reload(true);

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
        let x = 320;
        let y = 480;
        let width = 168;
        let height = 110;
        super(x, y, width, height);
        this.life = 3;
        this.input = "";
        this.imgConsole = new Image();
        this.imgConsole.src = "./images/tux/console_led.png"; // 168 x 110
        this.imgTux = new Image();
        this.imgTux.src = "./images/tux/tux-console1.png"; // 77 x 60
    }

    draw (){
        ctx.drawImage(this.imgConsole, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.imgTux, 370, 540, 77, 60);
    }
}

class Asteroids extends Characters {
    constructor(x,y){
        let width = 83*3/5;
        let height = 149*3/5;
        super(x, y, width, height);

        this.vy = 0.25;
        this.A = Math.round(Math.random() * 19);
        this.B = Math.round(Math.random() * 19);
        this.answer = this.A + this.B;
        this.img = new Image();
        this.img.src = "./images/comets/comet0.png";
    }

    draw(){
        ctx.font = "40px Arial";
        ctx.fillStyle = "white";
        this.y += this.vy;

        if (frames % 7 == 0){
            let idx = frames % 3;
            this.img.src = "./images/comets/comet"+ idx +".png";
        }
        ctx.drawImage(this.img, this.x + 140, this.y - 90, this.width, this.height);

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
    if (frames % 650 == 0){
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
            // console.log("A collision");
            explosion.play();
            asteroidsArr.splice(index, 1);
        }
    });
}

function checkInput(){
    asteroidsArr.forEach((asteroid, index) => {
        // console.log("input: ",player.input);
        if (player.input == asteroid.answer){
            // console.log("Good job");
            cheer.play();
            asteroidsArr.splice(index, 1);
            player.input = "";
        } else {
            // console.log("Try again");
            buzz.play();
            player.input = "";
        }
    });
}

function writeUserInput(user){
    let string = user.input;
    let digits = 2;
    let x = user.x + 60;
    let y = user.y + 40;
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";

    if (string.length < digits){
        string = "0".repeat(digits - string.length) + string;
    } else if(string.length > digits){
        string = string.slice(-digits, string.length);
    }

    ctx.fillText(string, x, y);
}

function setResetBtn() {
    gameBtn.innerHTML = 'RESET';
    gameBtn.className = 'btn reset';
  }

// FUNCIONES PRINCIPALES

function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generateAsteroids();
    drawAsteroids();
    player.draw();
    writeUserInput(player);
    checkCollision();
    // gameOver
    frames += 1;
}

// EVENTOS

// Start/Reset Button
gameBtn.addEventListener('click', function (e) {  
    if (e.currentTarget.className == 'btn start'){
        music.play();
        setResetBtn();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        clearInterval(interval);
        interval = setInterval(update, 1000/60);
    }
    else {
        window.location.reload(true);
    }
});

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