let player = {};
let target = {};
let then = NaN;
let size = 0;
let offset = ((Math.atan2(5, 14) + Math.atan2(3, 14)) * 180) / Math.PI;
let stop = false;
let debugMode = false ;

function handleClick(){
    if (checkCollision()) {
        debugMode && target.element.style.setProperty("--fill", "green");
        randomizeTarget();
        player.score++;
        score.textContent = player.score ;
        player.speed += Math.sign(player.speed) * 5 ;
        player.speed *= -1 ;
    } else {
        window.removeEventListener("click",handleClick);
        window.removeEventListener("keydown",handleKey);
        debugMode && target.element.style.setProperty("--fill", "white");
        stop = true;
        highscore.textContent = player.score ;
        gameOver.setAttribute("data-visible","true");
    }
}

function handleKey(e){
    e.preventDefault();
    if(e.key === " " || e.code=="Space" || e.keyCode == 32) {
        handleClick();
    } else if(e.key === "q" || e.code=="q") {
        if(debugMode){
            log.style.display = "none" ;
            debug.style.display = "none" ;
        } else {
            log.style.display = "block" ;
            debug.style.display = "block" ;
        }
        debugMode = !debugMode ;
    }
}

function start(){
    stop = false ;
    init();
    startScreen.setAttribute("data-visible","false");
    gameOver.setAttribute("data-visible","false");
    setTimeout(()=>{
        window.addEventListener("click",handleClick);
        window.addEventListener("keydown",handleKey);
    },300)
}

function init() {
    let wrapper = document.querySelector(".wrapper");
    size = Math.min(window.innerHeight * 0.8, window.innerWidth * 0.8);
    wrapper.style.setProperty("--size", size + "px");

    player = {
        element: document.getElementById("player"),
        set angle(value) {
            value = value % 360;
            this.element.style.setProperty("--angle", value + "deg");
        },
        get angle() {
            let a = this.element.style.getPropertyValue("--angle");
            return parseFloat(a);
        },
        speed: 200,
        score: 0,
    };

    target = {
        element: document.getElementById("target"),
        set angle(value) {
            this.element.style.setProperty("--angle", value + "deg");
        },
        get angle() {
            let a = this.element.style.getPropertyValue("--angle");
            return parseFloat(a);
        },
        set length(value) {
            this.element.style.setProperty("--p", value);
        },
        get length() {
            return parseFloat(this.element.style.getPropertyValue("--p"));
        },
    };

    player.angle = 0;
    player.score = 0;
    score.textContent = 0 ;
    randomizeTarget();

    if(debugMode){
        log.style.display = "block" ;
        debug.style.display = "block" ;
    }

    requestAnimationFrame(gameloop);
}

function gameloop(delta) {
    let now = Date.now();
    if (!then) {
        then = now;
    }
    delta = now - then;

    // Update Player
    player.angle = player.angle + (delta / 1000) * player.speed;

    if(debugMode) {
        if (checkCollision()) {
            debugMode && target.element.style.setProperty("--fill", "green");
        } else {
            debugMode && target.element.style.setProperty("--fill", "white");
        }
    }

    then = now;
    if (!stop) requestAnimationFrame(gameloop);
}

function checkCollision() {
    let targetMin = target.angle - offset;
    let targetMax = target.angle + target.length * 360 + offset;
    let minX = Math.cos(toRad(targetMin)) * 200;
    let minY = Math.sin(toRad(targetMin)) * 200;
    let maxX = Math.cos(toRad(targetMax)) * 200;
    let maxY = Math.sin(toRad(targetMax)) * 200;
    let pX = Math.cos(toRad(player.angle)) * 200;
    let pY = Math.sin(toRad(player.angle)) * 200;
    let p1 = minY * pX - minX * pY;
    let p2 = maxY * pX - maxX * pY;
    let p3 = pY * minX - pX * minY;
    let p4 = maxY * minX - maxX * minY;

    if (debugMode === true) {
        l1.setAttribute("x2", 200 + minX);
        l1.setAttribute("y2", 200 + minY);
        l2.setAttribute("x2", 200 + maxX);
        l2.setAttribute("y2", 200 + maxY);
        l3.setAttribute("x2", 200 + pX);
        l3.setAttribute("y2", 200 + pY);
        d1.innerText = `MIN : ${minX.toFixed(2)}i + ${minY.toFixed(2)}j`;
        d2.innerText = `MAX : ${maxX.toFixed(2)}i + ${maxY.toFixed(2)}j`;
        d3.innerText = `PLR : ${pX.toFixed(2)}i + ${pY.toFixed(2)}j`;
        d5.innerText = `CP1  : ${p1.toFixed(0)}`;
        d6.innerText = `CP2  : ${p2.toFixed(0)}`;
        d7.innerText = `CP3  : ${p3.toFixed(0)}`;
        d8.innerText = `CP4  : ${p4.toFixed(0)}`;
        d9.innerText = `SPD  : ${player.speed.toFixed(0)}`;
    }

    if (Math.sign(p1) * Math.sign(p2) < 0 && Math.sign(p3) * Math.sign(p4) > 0) {
        debugMode && (d4.innerText = `INS : True`);
        return true;
    } else {
        debugMode && (d4.innerText = `INS : False`);
        return false;
    }
}

function toRad(a) {
    if (a < 0) a += 360;
    return (a * Math.PI) / 180;
}

function randomizeTarget() {
    target.angle = Math.floor(Math.random() * 360);
    target.length = Math.random() * 0.1 + 0.05;
}
