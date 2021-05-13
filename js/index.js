class GameContainer {
    constructor()
    {
        this.container = document.getElementById('container')
        this.gameScreen = document.getElementById('game');
        this.getReady = document.getElementById('get-ready');
        this.final = document.getElementById('final');
        this.medal = document.getElementById('medal');
        this.scorePointD = document.getElementById('score-point');
        this.highScoreD = document.getElementById('high-score');
        this.final.style.display='none';
        this.gameScreen.style.backgroundPositionY='500px';
        this.gameScreen.style.backgroundPositionX = "0px";
        this.getReady.style.background="url('./assets/message.png') no-repeat";
    }
    initialize(){
    document.addEventListener("click", handleEvent);
    document.addEventListener("keyup",(evt)=>evt.keyCode===32? handleEvent(evt):'');
    function handleEvent(e){
       if(e || e.keyCode === 32){
                switch(playingState){
                    case 'menu':
                        release=true;
                        playingState='game'
                        break;
                    case 'game':
                        console.log('ok')
                        break;
                    case 'gameover':
                        score=0;
                        scoreElement.innerText=''
                        playingState='menu';
                        break;
                }
               }
            }
    }
    bgAnimate(changebg){
        this.getReady.style.display='none';
        parseInt(this.gameScreen.style.backgroundPositionX) >= 1000 ?
      (this.gameScreen.style.backgroundPositionX = "0px") :
      (this.gameScreen.style.backgroundPositionX =
        parseInt(this.gameScreen.style.backgroundPositionX) + 3 + "px");
    // if (changebg=='toggle'){
    // (this.container.style.backgroundImage == "url('./assets/background-night.png')")?
    // this.container.style.backgroundImage = "url('./assets/background-day.png') ":
    // this.container.style.backgroundImage = "url('./assets/background-night.png') ";
    // }
    }
    collision(bird,pipes){
        var birdprop = {x: 70, y: parseInt(bird.bird.style.top), width: 40, height: 40}
        var topprop = {x: parseInt(pipes.pipes.style.left), y: parseInt(pipes.topPipe.style.top), width: 52, height: 300}
        var bottomprop = {x: parseInt(pipes.pipes.style.left), y: parseInt(pipes.bottomPipe.style.top), width: 52, height: 300}

    if( (birdprop.x < topprop.x + topprop.width &&
       birdprop.x + birdprop.width > topprop.x &&
       birdprop.y < topprop.y + topprop.height &&
       birdprop.y + birdprop.height > topprop.y) ||
       (birdprop.x < bottomprop.x + bottomprop.width &&
          birdprop.x + birdprop.width > bottomprop.x &&
          birdprop.y < bottomprop.y + bottomprop.height &&
          birdprop.y + birdprop.height > bottomprop.y))
        {
           this.gameOver();
    }

    }
    show(){
        if(playingState=='menu'){
            this.getReady.style.display='block';
            this.getReady.style.background="url('./assets/message.png') no-repeat";
            this.final.style.display='none';
        }
        if (playingState=='gameover'){
            if(score>49){
                this.medal.style.background="url('./assets/gold.png') no-repeat";
                this.medal.style.backgroundSize='contain';
            }
            else if (score>24){
                this.medal.style.background="url('./assets/silver.png') no-repeat";
                this.medal.style.backgroundSize='contain';
            }
            this.scorePointD.innerText=score;
            this.highScoreD.innerText=highScore;
            this.getReady.style.display='block';
            this.final.style.display='block';
            this.getReady.style.background='none';
            pipesCount.forEach((pipe)=>{pipe.pipes.remove()})
            pipesCount=[]
        }
    }

    gameOver(){
        playingState='gameover';
    }
}

class Bird{
        constructor(){
            let bird = document.getElementById('bird');
            this.bird=bird;
            this.bird.style.backgroundImage="url('./assets/bird.png')";
            this.bird.style.top='250px'
        }
}

class Pipes {
    constructor(){
        this.pipesArea=document.getElementById('pipes-area');
        let pipes = document.createElement('div')
        pipes.classList.add('pipes')
        this.pipesArea.appendChild(pipes)
        let topPipe = document.createElement('div')
        topPipe.classList.add('top-pipe')
        pipes.appendChild(topPipe)
        let bottomPipe = document.createElement('div')
        bottomPipe.classList.add('bottom-pipe')
        pipes.appendChild(bottomPipe)
        this.pipes=pipes
        this.topPipe=topPipe;
        this.bottomPipe=bottomPipe;
        this.pipes.style.display='none';
        this.ready=false;
        this.callanother=false;
        this.point=false;
        }
    render(){
        let randomPipePosition = Math.floor(Math.random()*200-200)
        this.ready=true;
        this.pipes.style.left='500px';
        this.topPipe.style.transform='rotate(180deg)';
        this.topPipe.style.top=(randomPipePosition)+'px';
        this.bottomPipe.style.top=parseInt(this.topPipe.style.top)+420+'px';
        this.bottomPipe.style.height=500-parseInt(this.bottomPipe.style.top)+'px';
        this.pipes.style.display='block';
    }
    move(){
        this.pipes.style.left = parseInt(this.pipes.style.left)-step+'px';
        if(parseInt(this.pipes.style.left)<-60){
            this.pipes.remove();
            pipesCount.shift();
        }
        if(parseInt(this.pipes.style.left)<300 && !this.callanother){
            release=true;
            this.callanother=true;
        }
        if(parseInt(this.pipes.style.left)<90 && !this.point){
            score+=1;
            scoreElement.innerText=score;
            this.point=true;
            if (score > highScore) {
                localStorage.setItem("score", score);
            }
        }
    }
}

let score=0;
let highScore = localStorage.getItem("score")||0;
let step=2;
let start;
let playingState='menu';
let pipesCount=[];
let release=true;
let maxPipe=3
let scoreElement=document.getElementById('score');


let gameLoop = (timestamp)=>{
   //  if (start === undefined)
   //  start = timestamp;
   // const elapsed = Math.round(timestamp) - Math.round(start);

    window.requestAnimationFrame(gameLoop);

    if(playingState=='game'){
        let howMany = document.getElementById("pipes-area").childElementCount;

   if (howMany < maxPipe) {
     for (var i = 0; i < maxPipe - pipesCount.length; i++) {
       pipesCount.push(new Pipes());
     }
   }
    pipesCount.forEach((pipe)=>{
        if(release){
            if(!pipe.ready){
                release=false;
                pipe.render();
            }
        }
        if(pipe.ready){
            pipe.move();
            gameContainer.collision(bird,pipe);
        }
    })
    // (elapsed%5000==0)?
        gameContainer.bgAnimate('toggle')
        // :gameContainer.bgAnimate()
    }
    else if(playingState=='menu' || playingState=='gameover'){
        gameContainer.show();
    }
}

let gameContainer= new GameContainer();
gameContainer.initialize();
let bird = new Bird();

gameLoop()
