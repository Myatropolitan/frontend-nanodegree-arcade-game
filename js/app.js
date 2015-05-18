"use strict";
//Set values

//canvas related
var CANVAS_WIDTH = 505;
var ROW_HEIGHT = 83;
var COLUMN_WIDTH = 101;

//the Y distance between enemies
//(since setting to ROW_HEIGHT does not look pretty)
var ENEMY_SEP_Y_DIST = 70;

//initial starting position of the player
var initialPlayerY = 390;
var initialPlayerX = COLUMN_WIDTH * 2;

//minimum and maximum speed range for enemies
var speedMin = 200;
var speedMax = 400;

//game score
var score = 0;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    //set random speed
    this.speed = getRandomInt(speedMin, speedMax);
    //set start position x from outside of canvas, to before going off canvas
    this.x = getRandomInt((COLUMN_WIDTH * -1), 404);
    //set start position y on one of the three rows of stone
    this.y = getRandomInt(1,3) * ENEMY_SEP_Y_DIST;
    this.ignoreCollision = false;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, player) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //next intended x position
    var nextLoc = this.x + (this.speed * dt);

    //reset start position & speed if enemy goes off canvas
    if (nextLoc > CANVAS_WIDTH) {
        this.x = (COLUMN_WIDTH * -1);
        this.y = getRandomInt(1,3) * ENEMY_SEP_Y_DIST;
        this.speed = getRandomInt(speedMin, speedMax);
        this.ignoreCollision = false;
    //otherwise move the enemy forward
    } else {
        this.x = nextLoc;
    }

    // enemy and player collision detection.
    // make characters overlap a little for collision effect.
    if (player.x < (this.x + COLUMN_WIDTH/2) &&
        player.x + COLUMN_WIDTH/2 > this.x &&
        player.y < (this.y + ROW_HEIGHT/2) &&
        (player.y + ROW_HEIGHT/2) > this.y) {

        //remove a life from player if it is the first time
        //colliding with that enemy on the particular run across the screen
        if (this.ignoreCollision === false) {
            player.removeLife();

            //if player is out of lives, reset
            if (player.lives === 0) {
                resetGame();
            //if player has lives left after collision, further collision with
            //that enemy on the particular run is to be ignored
            } else {
                this.ignoreCollision = true;
            }
        }
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function(ctx) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Player of the game
var Player = function() {
    //reset player parameters
    this.resetPlayer();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
};

//remove a life from the player
Player.prototype.removeLife = function() {
    this.lives = this.lives - 1;
};

//add a life to the player
Player.prototype.addLife = function() {
    this.lives = this.lives + 1;
};

Player.prototype.update = function(heart) {
    //Add a life if player collides with the heart
    if (this.x < (heart.x + COLUMN_WIDTH/2) &&
        this.x + COLUMN_WIDTH/2 > heart.x &&
        this.y < (heart.y + ROW_HEIGHT/2) &&
        (this.y + ROW_HEIGHT/2) > heart.y) {
        this.addLife();
    }
};

// Draw the player on the screen
Player.prototype.render = function(ctx) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    ctx.font = "bold 24px sans-serif";
    //display number of lives left
    ctx.fillText("Lives: " + this.lives, 420, 570);
    //display scoring of the game
    ctx.fillText("Score: " + score, 305, 570);
};

//Reset player position & lives
Player.prototype.resetPlayer = function() {
    this.x = initialPlayerX;
    this.y = initialPlayerY;
    this.lives = 1;
};

Player.prototype.handleInput = function(key) {
    var newX, newY;

    if (key == 'left') {
        newX = this.x - COLUMN_WIDTH;
        //move left if player does not go off canvas
        if (newX >= 0)
            this.x = newX;
    } else if (key == 'up') {
        newY = this.y - ROW_HEIGHT;
        //move up if player has not reached the water
        if (newY > 0) {
            this.y = newY;
        //if player has reached the water, add a score and reset to start position
        }else{
            score++;
            this.resetPlayer();
        }
    } else if (key == 'right') {
        newX = this.x + COLUMN_WIDTH;
        //move right if player does not go off canvas
        if (newX < CANVAS_WIDTH)
            this.x = newX;
    } else if (key == 'down') {
        newY = this.y + ROW_HEIGHT;
        //move down if player does not go off canvas
        if (newY < (ROW_HEIGHT*5))
            this.y = newY;
    }
};

// Heart item
var Heart = function() {
    this.resetHeart();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Heart.png';
};

Heart.prototype.update = function(player) {
    //collision detection. make characters overlap a little for collision effect.
    if (player.x < (this.x + COLUMN_WIDTH/2) &&
        player.x + COLUMN_WIDTH/2 > this.x &&
        player.y < (this.y + ROW_HEIGHT/2) &&
        (player.y + ROW_HEIGHT/2) > this.y) {
        this.x = -101; //remove from screen (set outside of the displayed canvas)
    }
};

// Draw the player on the screen
Heart.prototype.render = function(ctx) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Heart.prototype.resetHeart = function() {
    //reset location
    this.x = getRandomInt(0,4) * COLUMN_WIDTH;
    this.y = 320;
};

function resetGame() {
    //reset player position
    player.resetPlayer();
    //reset heart
    heart.resetHeart();
    //reset score
    score = 0;
}

//Get random whole number between min & max
function getRandomInt(min, max) {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemyNum = 3;
var allEnemies = [];
for (var i=0; i<enemyNum; i++) {
    allEnemies[i] = new Enemy();
}

var player = new Player();
var heart = new Heart();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
