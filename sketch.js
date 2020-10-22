//Create variables here
var dog,dogImg,happyDog,foodS,foodStock;
var fedTime,lastFed,feed,addFood,food;
var database;

function preload(){
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(1000, 400);
  database = firebase.database();

  food = new Food();

  foodStock = database.ref("food");
  foodStock.on("value", (data) => {
    foodS = data.val();
    food.updateFoodStock(foodS);
  });

  dog = createSprite(800,200,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed = createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  textSize(20);
}


function draw() {  
  background(46,139,87);

  food.display();

  fedTime = database.ref("FeedTime");
  fedTime.on("value", (data) => {
    lastFed = data.val();
  });

  fill("white");
  if(lastFed >= 12){
    text("Last Feed: " + lastFed%12 + " pm", 350,30);
  }
  else if(lastFed === 0){
    text("Last Feed: 12 am", 350,30);
  }
  else{
    text("Last Feed: " + lastFed + " am",350,30);
  }

  drawSprites();
}

function feedDog(){
  dog.addImage(happyDog);

  food.deductFood();
  var stock = food.getFoodStock();
  food.updateFoodStock(stock);
  database.ref("/").update({
    food: stock,
    FeedTime: hour()
  })
}

function addFoods(){
  foodS ++;
  database.ref("/").update({
    food: foodS
  })
}