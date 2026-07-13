// script.js

const ctx = document.getElementById('gameCanvas').getContext('2d');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const endButton = document.getElementById('endButton');
const musicButton = document.getElementById('musicButton');
const score = document.getElementById("score");
const lines = document.getElementById("lines");
const level = document.getElementById("level");
const sound = new Audio("assets/audio/sound.mp3"); sound.loop=true;


class Game {
    constructor(data_,ctx_) {
        this.data = data_;
        this.grid_controler = new Grid(data_,ctx_);
        this.logic = new Logic(data_,this.grid_controler);
        this.imageStop = true;
        this.images = [];
        this.counter = 1;
        this.life = true;
        this.score = 0;
        this.lines = 0;
        this.reset();
    }
    reset() {
        // Reset grid and variables
        this.grid_controler.reset();
        this.grid_controler.clearAll();
        this.imageStop = true;
        this.images = [];
        this.counter = 1;
        this.life = true;
        this.score = 0;
        this.lines = 0;
    }
    frame() {
        this.grid_controler.drawClearAll();
    }
    frameDead() {
        // Game over frame
        this.grid_controler.clearAll();
        this.grid_controler.drawDead(this.score);
    }
    move(key) {
        // Translates keys into actions using logic, grid, and sound
        if(this.counter != 1 && this.life) {
            if(key == "KeyA") {
                if(this.logic.verify_move_img(this.images[this.images.length-1],-1,0)) {
                    this.logic.move_img(this.images[this.images.length-1],-1,0);
                    this.frame();
                }
            }
            else if(key == "KeyD"){
                if(this.logic.verify_move_img(this.images[this.images.length-1],1,0)) {
                    this.logic.move_img(this.images[this.images.length-1],1,0);
                    this.frame();
                }
            }
            else if(key == "KeyW"){
                if(this.logic.verify_move_img(this.images[this.images.length-1],0,-1)) {
                    this.logic.move_img(this.images[this.images.length-1],0,-1);
                    this.frame();
                }
            }
            else if(key == "KeyS"){
                if(this.logic.verify_move_img(this.images[this.images.length-1],0,1)) {
                    this.logic.move_img(this.images[this.images.length-1],0,1);
                    this.frame();
                }
            }
            else if(key == "Space") {
                if(this.logic.verify_rotate_img(this.images[this.images.length-1],1)) {
                    this.logic.rotate_img(this.images[this.images.length-1],1);
                    this.frame();
                }
            }
            else if(key == "KeyE") {
                if(this.logic.verify_rotate_img(this.images[this.images.length-1],1)) {
                    this.logic.rotate_img(this.images[this.images.length-1],1);
                    this.frame();
                }
            }
            else if(key == "KeyQ") {
                if(this.logic.verify_rotate_img(this.images[this.images.length-1],-1)) {
                    this.logic.rotate_img(this.images[this.images.length-1],-1);
                    this.frame();
                }
            }
        }
    }
    logic_sands() {
            // Sand logic
            let verify = this.logic.verify_rows();
            this.score += verify.score;
            this.lines += verify.rows.length;
            this.logic.move_sands(); 
            let total_ids = new Set();
            for (let i = 0; i < verify.rows.length; i++) {
                let ids = this.logic.pop_row(verify.rows[i]);
                total_ids = new Set([...total_ids,...ids])
            }
            // Update Box sands
            this.logic.acctually_sands(total_ids);
            // Remove sand images from images
            this.images = this.images.filter(obj => !total_ids.has(obj.id));
    }
    logic_move() {
        // Move images and check life
        for (let i = 0; i < this.images.length; i++) {
            if(this.logic.verify_move_img(this.images[i],0,1)) {
                this.logic.move_img(this.images[i],0,1);
            }
            else if(i == (this.images.length-1)) {
                if(this.images[i].y < 4) {
                    this.life = false;
                    this.counter = 0;
                }
                this.imageStop = true;
            }
        }
    }
    loop() {
        // Main game loop
        if(this.life) {
            // Generate image
            if(this.imageStop || this.images.length == 0) {
                // Sometimes length is 0 due to bugs between sands and movement
                this.images.push(this.logic.spawn_img(this.counter));
                this.imageStop = false;
            }
            // Sand logic
            this.logic_sands();
            // Move images and check life
            this.logic_move();
            // Update frame
            this.frame();
            this.counter++; 
        } 
    }
    
}

const speed = 200;
let loop;
let game;
let paused = false;
let running = false;
let musicEnabled = false;

// Start Variables
function start() {
    let data = new Data(BLOCKS_DATA);
    game = new Game(data,ctx);
}
start();

function updateStats() {
    score.textContent = game.score;
    lines.textContent = game.lines;
    level.textContent = 1;
}

function stopLoop() {
    clearInterval(loop);
    loop = null;
}

function runLoop() {
    stopLoop();
    loop = setInterval(() => {
        updateStats();
        if(game.life) game.loop();
        else {
            game.frameDead(game.score);
            sound.pause();
            stopLoop();
            running = false;
            updateControls();
        }
    }, speed);
}

function updateControls() {
    startButton.disabled = running;
    pauseButton.textContent = "Pause Game";
    pauseButton.disabled = !running;
    endButton.disabled = !running;
    musicButton.textContent = musicEnabled ? "Music On" : "Music Off";
}

function setMusic(enabled) {
    musicEnabled = enabled;
    if(musicEnabled && running && !paused) sound.play();
    else {
        sound.pause();
        if(!musicEnabled) sound.currentTime = 0;
    }
    updateControls();
}

function endGame() {
    stopLoop();
    running = false;
    paused = false;
    sound.pause();
    sound.currentTime = 0;
    game.reset();
    updateStats();
    updateControls();
}

updateControls();
updateStats();

// Event Listeners
document.addEventListener("keydown", (e)=>{
    if(["Space", "KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyE"].includes(e.code)) {
        e.preventDefault();
    }
    if(e.code == "Escape") {
        setMusic(!musicEnabled);
        return;
    }
    if((paused || !running)) return;
    game.move(e.code);
});
startButton.addEventListener('click', (e) => {
    e.currentTarget.blur();
    if(running) return;
    game.reset();
    updateStats();
    running = true;
    paused = false;
    pauseButton.textContent = "Pause Game";
    if(musicEnabled) sound.play();
    runLoop();
    updateControls();
});
pauseButton.addEventListener('click', (e) => {
    e.currentTarget.blur();
    if(!running || !game.life) return;
    if(paused) {
        paused = false;
        pauseButton.textContent = "Pause Game";
        if(musicEnabled) sound.play();
        runLoop();
    }
    else {
        paused = true;
        pauseButton.textContent = "Resume Game";
        sound.pause();
        stopLoop();
    }
});
endButton.addEventListener('click', (e) => {
    e.currentTarget.blur();
    endGame();
});
musicButton.addEventListener('click', (e) => {
    e.currentTarget.blur();
    setMusic(!musicEnabled);
});
