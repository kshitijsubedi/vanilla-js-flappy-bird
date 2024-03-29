class GameContainer {
    constructor() {
        this.container = document.getElementById('container')
        this.gameScreen = document.getElementById('game');
        this.getReady = document.getElementById('get-ready');
        this.final = document.getElementById('final');
        this.medal = document.getElementById('medal');
        this.scorePointD = document.getElementById('score-point');
        this.highScoreD = document.getElementById('high-score');
        this.playButton = document.getElementById('play-button');
        this.final.style.display = 'none';
        this.gameScreen.style.backgroundPositionY = '500px';
        this.gameScreen.style.backgroundPositionX = "0px";
        this.getReady.style.background = "url('./assets/message.png') no-repeat";
    }

    /*
        Player Input event Listener
    */
    initialize() {
        document.addEventListener("click", handleEvent);
        document.addEventListener("keyup", (evt) => evt.keyCode === 32 ? handleEvent(evt) : '');

        function handleEvent(e) {
            if (e || e.keyCode === 32) {
                switch (playingState) {
                    case 'menu':
                        release = true;
                        playingState = 'game'
                        break;
                    case 'game':
                        bird.fall(-0.05)
                        break;
                }
            }
        }
        this.playButton.addEventListener('click', () => {
            if (playingState == 'menu') {
                bird.fall(-0.05)
                playingState = 'game';
                release = true;
            } else if (playingState == 'gameover') {
                bird.bird.style.display = 'block';
                score = 0;
                scoreElement.innerText = ''
                playingState = 'menu';
            }
        })
    }
    // Scroll bottom Background

    bgAnimate(changebg) {
        bird.fall(0.1)
        this.getReady.style.display = 'none';
        parseInt(this.gameScreen.style.backgroundPositionX) >= 1000 ?
            (this.gameScreen.style.backgroundPositionX = "0px") :
            (this.gameScreen.style.backgroundPositionX =
                parseInt(this.gameScreen.style.backgroundPositionX) + 3 + "px");
    }


    /*
        Recatangular collision detection between pipe and bird.
    */
    collision(bird, pipes) {
        var birdprop = {
            x: 70,
            y: parseInt(bird.bird.style.top),
            width: 40,
            height: 40
        }
        var topprop = {
            x: parseInt(pipes.pipes.style.left),
            y: parseInt(pipes.topPipe.style.top),
            width: 52,
            height: 300
        }
        var bottomprop = {
            x: parseInt(pipes.pipes.style.left),
            y: parseInt(pipes.bottomPipe.style.top),
            width: 52,
            height: 300
        }

        if ((birdprop.x < topprop.x + topprop.width &&
                birdprop.x + birdprop.width > topprop.x &&
                birdprop.y < topprop.y + topprop.height &&
                birdprop.y + birdprop.height > topprop.y) ||
            (birdprop.x < bottomprop.x + bottomprop.width &&
                birdprop.x + birdprop.width > bottomprop.x &&
                birdprop.y < bottomprop.y + bottomprop.height &&
                birdprop.y + birdprop.height > bottomprop.y)) {
            this.gameOver();
        }

    }

    /*
        Menu Screens
    */
    show() {

        // Main Menu
        
        if (playingState == 'menu') {
            this.getReady.style.display = 'block';
            this.getReady.style.background = "url('./assets/message.png') no-repeat";
            this.final.style.display = 'none';
        }

        // Game Over Menu mechanics.

        if (playingState == 'gameover') {
            if (score > 49) {
                this.medal.style.background = "url('./assets/gold.png') no-repeat";
                this.medal.style.backgroundSize = 'contain';
            } else if (score > 24) {
                this.medal.style.background = "url('./assets/silver.png') no-repeat";
                this.medal.style.backgroundSize = 'contain';
            }
            bird.bird.style.top = '250px'
            this.scorePointD.innerText = score;
            this.highScoreD.innerText = highScore;
            this.getReady.style.display = 'block';
            this.final.style.display = 'block';
            this.getReady.style.background = 'none';
            pipesCount.forEach((pipe) => {
                pipe.pipes.remove()
            })
            pipesCount = []
        }
    }

    /*
        Game Over condition.
    */
    gameOver() {
        bird.bird.className = 'normal';
        bird.bird.style.display = 'none';
        playingState = 'gameover';
    }
}

/*
    Bird Class
*/

class Bird {
    constructor() {
        this.bird = document.getElementById('bird');
        this.bird.className = 'normal'
        this.bird.style.top = '250px';
        this.gravity = 0.05;
        this.gravitySpeed = 0;
        this.downStep = 1;
        this.upStep = 50
        this.fallState = true;
    }
    /*
        Upward Motion and Down fall motion
    */
    fall(gravity) {
        this.bird.className = 'going-down';
        this.gravitySpeed += gravity;
        if (Math.sign(gravity) == 1) {
            this.bird.style.top = parseInt(this.bird.style.top) + this.gravitySpeed + 'px';
        } else {
            this.bird.className = 'going-up'
            for (var i = 0; i < 10; i++) {
                this.bird.style.top = parseInt(this.bird.style.top) - 4 + this.gravity + 'px';
            }
            this.gravitySpeed = 0
        }
        if (parseInt(this.bird.style.top) > 500) {
            this.bird.className = 'normal'
            bird.bird.style.display = 'none';
            this.gravitySpeed = 0;
            playingState = 'gameover'
        }
    }
}

/*
    Pipe Class
*/
class Pipes {
    constructor() {
        this.pipesArea = document.getElementById('pipes-area');
        let pipes = document.createElement('div')
        pipes.classList.add('pipes')
        this.pipesArea.appendChild(pipes)
        let topPipe = document.createElement('div')
        topPipe.classList.add('top-pipe')
        pipes.appendChild(topPipe)
        let bottomPipe = document.createElement('div')
        bottomPipe.classList.add('bottom-pipe')
        pipes.appendChild(bottomPipe)
        this.pipes = pipes
        this.topPipe = topPipe;
        this.bottomPipe = bottomPipe;
        this.pipes.style.display = 'none';
        this.ready = false;
        this.callanother = false;
        this.point = false;
    }
    render() {
        let randomPipePosition = Math.floor(Math.random() * 200 - 200)
        this.ready = true;
        this.pipes.style.left = '500px';
        this.topPipe.style.transform = 'rotate(180deg)';
        this.topPipe.style.top = (randomPipePosition) + 'px';
        this.bottomPipe.style.top = parseInt(this.topPipe.style.top) + 420 + 'px';
        this.bottomPipe.style.height = 500 - parseInt(this.bottomPipe.style.top) + 'px';
        this.pipes.style.display = 'block';
    }
    move() {

        /*
            Move Pipe from right to left 
            Upon reaching left end destroy pipe.
        */
        this.pipes.style.left = parseInt(this.pipes.style.left) - step + 'px';
        if (parseInt(this.pipes.style.left) < -60) {
            this.pipes.remove();
            pipesCount.shift();
        }
        // Send Another pipe 
        if (parseInt(this.pipes.style.left) < 300 && !this.callanother) {
            release = true;
            this.callanother = true;
        }

        // Score update when bird passes it.
        if (parseInt(this.pipes.style.left) < 90 && !this.point) {
            score += 1;
            scoreElement.innerText = score;
            this.point = true;
            if (score > highScore) {
                localStorage.setItem("score", score);
            }
        }
    }
}



/*
    Main Game Loop
*/
let score = 0;
let highScore = localStorage.getItem("score") || 0;
let step = 2;
let start;
let playingState = 'menu';
let pipesCount = [];
let release = true;
let maxPipe = 3
let backgroundImages = [
    "url('./assets/background-day.png')",
    "url('./assets/background-night.png')"
]
let scoreElement = document.getElementById('score');
let gameContainer = new GameContainer();
gameContainer.initialize();
let bird = new Bird();


let gameLoop = (timestamp) => {
    window.requestAnimationFrame(gameLoop);

    /*
        Generate New Pipes When Old one is destroyed.
    */
    if (playingState == 'game') {
        let howMany = document.getElementById("pipes-area").childElementCount;

        if (howMany < maxPipe) {
            for (var i = 0; i < maxPipe - pipesCount.length; i++) {
                pipesCount.push(new Pipes());
            }
        }

        /*
             Render Pipes on screen and motion it.
        */
        pipesCount.forEach((pipe) => {
            if (release) {
                if (!pipe.ready) {
                    release = false;
                    pipe.render();
                }
            }
            if (pipe.ready) {
                pipe.move();
                gameContainer.collision(bird, pipe);
            }
        })
        gameContainer.bgAnimate('toggle') //Background Motion
    } else if (playingState == 'menu' || playingState == 'gameover') {
        gameContainer.show();
    }
}

gameLoop()