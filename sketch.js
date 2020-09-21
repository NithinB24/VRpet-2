var dog, happyDog, garden, washroom, database;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;
var gameState, readState;

//currentTime

function preload() {
  dogimg = loadImage("Images/Dog.png");
  happyDogimg = loadImage("Images/happydog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 800);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  //read game state from database
  readState = database.ref('gameState');
  readState.on("value", function (data) {
    gameState = data.val();
  });

  dog = createSprite(500, 400, 150, 150);
  dog.addImage(dogimg);
  dog.scale = 0.2;

  feed = createButton("Feed the dog");
  feed.position(450, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(550, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  currentTime = hour();
  foodObj.display();
  lastFeed = foodObj.lastFed;
  fill(255, 255, 254);
  textSize(15)
  //text("Last Fed:",350,30);
  if (lastFed >= 12) {

    text("last Feed : " + lastFed % 12 + "PM", 350, 30);
  }
  else if (lastFed == 0) {

    text("Last Feed:12AM", 350, 30);
  }
  else {

    text("last Feed : " + lastFed + "AM", 350, 30);

  }

  drawSprites();
}


//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog() {
  dog.addImage(happyDogimg);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

//update gameState
function update(state) {
  database.ref('/').update({
    gameState: state
  })
}