const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const animations = {
    idle: {
        spriteSheet: new Image(),
        cols: 10,
        totalFrames: 10,
        src: 'https://i.postimg.cc/DwpYyPZ2/Idle.png'
    },
    run: {
        spriteSheet: new Image(),
        cols: 10,
        totalFrames: 10,
        src: 'https://i.postimg.cc/vm121xg5/Run.png'
    },
    attack: {
        spriteSheet: new Image(),
        cols: 4,
        totalFrames: 4,
        src: 'https://i.postimg.cc/t44MjM9S/Attack.png'
    },
    jump: {
        spriteSheet: new Image(),
        cols: 3,
        totalFrames: 3,
        src: 'https://i.postimg.cc/cHS7svQx/Jump.png'
    }
};

const sounds = {
  attack: new Audio('sounds/attack.wav'),
  run: new Audio('sounds/run.wav'),
  jump: new Audio('sounds/jump.mp3')
};

let currentAnimation = 'idle';
let currentFrame = 0;
let framesDrawn = 0;
let isAttacking = false;
let isRunning = false;
let isJumping = false;

for (let key in animations) {
    animations[key].spriteSheet.src = animations[key].src;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);

    const animation = animations[currentAnimation];
    const spriteWidth = animation.spriteSheet.width / animation.cols;
    const spriteHeight = animation.spriteSheet.height;

    currentFrame = currentFrame % animation.totalFrames;
    const srcX = currentFrame * spriteWidth;

    ctx.save();
    resizeImage(spriteWidth - (spriteWidth / 3), spriteHeight + (spriteHeight / 3));
    ctx.drawImage(animation.spriteSheet, srcX, 0, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    ctx.restore();

    framesDrawn++;
    if (framesDrawn >= 10) {
        currentFrame++;
        framesDrawn = 0;
    }

    if (isAttacking && currentFrame === animation.totalFrames - 1) {
      isAttacking = false;
      currentAnimation = 'idle';
      sounds.attack.pause();
      sounds.attack.currentTime = 0;
    }

    if (isRunning && currentAnimation !== 'run') {
        isRunning = false;
        sounds.run.pause();
        sounds.run.currentTime = 0;
    }

    if (isJumping && currentFrame === animation.totalFrames - 1) {
      isJumping = false;
      currentAnimation = 'idle';
      sounds.jump.pause();
      sounds.jump.currentTime = 0;
    }
}

function resizeImage(spriteWidth, spriteHeight) {
    const scaleFactor = 4;
    const midXPos = innerWidth / 2 - (spriteWidth * scaleFactor) / 2;
    const midYPos = innerHeight / 2 - (spriteHeight * scaleFactor) / 2;
    ctx.translate(midXPos, midYPos);
    ctx.scale(scaleFactor, scaleFactor);
}

function run() {
  if (!isRunning && !isJumping && !isAttacking) {
      currentAnimation = 'run';
      isRunning = true;
      currentFrame = 0;
      sounds.run.play();
  }
}

function attack() {
  if (!isAttacking && !isJumping) {
      currentAnimation = 'attack';
      isAttacking = true;
      currentFrame = 0;
      sounds.attack.play();
  }
}

function jump() {
  if (!isJumping && !isAttacking) {
      currentAnimation = 'jump';
      isJumping = true;
      currentFrame = 0;
      sounds.jump.play();
  }
}

addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      run();
  } else if (e.key === 'a') {
      attack();
  } else if (e.key === ' ') {
      jump();
  }
});

addEventListener("keyup", e => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      if (!isAttacking && !isJumping) {
          currentAnimation = 'idle';
          isRunning = false;
          sounds.run.pause();
          sounds.run.currentTime = 0;
      }
  }
});

document.getElementById("run-button").addEventListener("click", run);
document.getElementById("attack-button").addEventListener("click", attack);
document.getElementById("jump-button").addEventListener("click", jump);

function loadImages() {
    let imagesLoaded = 0;
    const totalImages = Object.keys(animations).length;

    for (let key in animations) {
        animations[key].spriteSheet.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                animate();
            }
        };
    }
}

loadImages();