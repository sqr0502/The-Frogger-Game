/**
* @description creates a new enemy
* @constructor
* @param {int} x - horizontal position of enemy
* @param {int} y - vertical position of enemy
* @param {int} speed - speed of enemy
*/
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

/**
* @description checks enemy position and updates it
* @param dt - delta time provided by game engine
*/
Enemy.prototype.update = function(dt) {
    //conditional stmt that keeps enemy on canvas
    if(this.x < 500) {
        this.x += this.speed * dt;
    } else {
        this.x =  -100;
        this.y = Math.random() * (230 - 75) + 75;
    }

    //handle collision
    if(this.x - player.x < 50 && this.x - player.x > -45) {
        if(this.y - player.y < 50 && this.y - player.y > -45) {
            player.reset(false);
        }
    }
};

/**
* @description renders enemy on screen
*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description represents a player
* @constructor
* @param x  - (horizontal) position of the player
* @param y - (vertical) position of the player
*/
var Player = function(x, y) {
    this.sprite = 'images/char-princess-girl.png';
    this.x = x;
    this.y = y;
    this.lives = 3;
};

/**
* @description checks to see if player reaches goal
* @param dt - delta time provided by engine
*/
Player.prototype.update = function(dt) {
   if(this.y <= 0){
      this.reset(true);
    }
};

/**
* @description reset player if player wins or looses
* @param {boolean} winlose - determine if player has won or lost
*/
Player.prototype.reset = function(winlose) {
  this.x = 200;
  this.y = 400;

  //Decreases lives (heart) upon Player collision
  if(!winlose){
    this.lives --;
    allLives.splice(0,1);
  }

  //If Player has no lives, reset game
  if(this.lives === 0){
    for(i in allGems) {
      allGems[i].reset();
    }
    this.lives = 3;
    allLives = [new Life(290,490), new Life(360, 490), new Life(430, 490)];
  }else if (winlose) {// Check to see if Player has won
    var j = 0;
    for(i in allGems) {
      if(allGems[i].collected){
        j++;
        console.log(j);
      }
    }
    if(j === allGems.length){ // Check to see if all gems have been collected
      // Player has won, now we reset
      for(i in allGems) {
          allGems[i].reset();
        }
       this.lives = 3;
       allLives = [new Life(290,490), new Life(360, 490), new Life(430, 490)];
    }
 }
};

/**
* @description render player on screen
*/
Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description handles user input
* @param {string} key - provide by user input expected: up, down, left, right
*/
Player.prototype.handleInput = function(key) {
    console.log(key);
    switch(key) {
        case 'left':
          if(this.x > 0){
            this.x -= 80;
          }
          break;
        case 'right':
          if(this.x < 400){
            this.x += 80;
          }
          break;
        case 'down':
         if(this.y < 375){
            this.y += 80;
          }
          break;
        case 'up':
          if(this.y > 0){
            this.y -= 80;
          }
          break;
    }
};

/**
* @description describes a gem
* @constructor
* @param {int} x - horizontal position of gem
* @param {int} y - vertical position of gem
* @param {sprite} string - image url for rendering
*/
var Gem = function(x, y, sprite){
  this.initialx = x; //initial x position of gem
  this.initialy = y; //initial y position of gem
  this.sprite = sprite;
  this.width = 50;
  this.height =70;
  this.x = x;
  this.y = y;
};

/**
* @description gets and sets position of gem
* @param {double} dt - delta time for smooth movement
*/
Gem.prototype.update = function(dt) {
  if(this.x - player.x <= 40 && this.x - player.x >= -40) {
        if(this.y - player.y <= 40 && this.y - player.y >= -40) {
            this.collect();
        }
    }
};

/**
* @description updates position of gem and substracts from gem array
*/
Gem.prototype.collect = function() {
  this.x = 7;
  this.y = 495;

  // Check for other gems to set x position according to width
  for(i in allGems) {
    if(allGems[i].collected){
      this.x += 70;
    }
  }
  this.collected = true;
};

/**
* @description reset gem on game reset - player lost or won
*/
Gem.prototype.reset = function(){
  this.x = this.initialx;
  this.y = this.initialy;
  this.collected = false;
}

/**
* @description render - display gem on screen
*/
Gem.prototype.render = function(){
 ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

/**
* @description describes a life
* @constructor
* @param {int} x - horizontal position of Life
* @param {int} y - vertical position of Life
*/
var Life= function(x, y) {
  this.sprite = 'images/Heart.png';
  this.width = 60;
  this.height = 80;
  this.x = x;
  this.y = y;
};

/**
* @description render life on screen
*/
Life.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
}

/* Now instantiate your objects.
* Initialize enemy objects in an array called allEnemies
* Initialize the player object in a variable called player
* Initialize gems objects in a array called allGems
* Initialize lives objects in a array called allLives
*/

var allEnemies = [new Enemy(0, 60, 50), new Enemy(0, 130, 150), new Enemy(0, 230, 75)];
var player = new Player(200,380);
var gemblue = new Gem(100,250, 'images/Gem Blue.png');
var gemorange = new Gem(200, 250,'images/Gem Orange.png');
var gemgreen = new Gem (300, 200, 'images/Gem Green.png');
var allGems = [gemblue, gemorange, gemgreen];
var allLives = [new Life(290,495), new Life(360, 495), new Life(430, 495)];

/* This listens for key presses and sends the keys to your
* Player.handleInput() method. You don't need to modify this.
*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
