
var trex ,trex_running,ground,ground_image, fake_ground, cloud, cloud_image;
var cactus, c1_image, c2_image, c3_image, c4_image, c5_image, c6_image
var score, caGroup, clGroup, gameState = "play"
var deadtrex, gameOver, restart, gameOver_image, restart_image
var jump, die, checkpoint
function preload(){
  trex_running = loadAnimation("trex3.png","trex4.png")
  deadtrex = loadAnimation("trex_collided.png")
  ground_image = loadImage ("ground2.png")
  cloud_image = loadImage ("cloud.png")
  c1_image = loadImage("obstacle1.png")
  c2_image = loadImage("obstacle2.png")
  c3_image = loadImage("obstacle3.png")
  c4_image = loadImage("obstacle4.png")
  c5_image = loadImage("obstacle5.png")
  c6_image = loadImage("obstacle6.png")
  gameover_image = loadImage("gameOver.png")
  restart_image = loadImage ("reset.png")
  jump = loadSound("jump.mp3")
  die = loadSound("die.mp3")
  checkpoint = loadSound("checkpoint.mp3")
}

function setup(){
  createCanvas(600,200)
  
  //create a trex sprite
 trex = createSprite (50,190,20,50)
 trex.addAnimation("run",trex_running)
 trex.addAnimation("dead",deadtrex) 
 trex.scale = 0.5
 //making hitbox visible
 //trex.debug = true
 //changing shape and size of collider radius/hitbox
 trex.setCollider("circle",0,0,40)



 //creating ground
 ground = createSprite (200,180,400,5)
 ground.addImage(ground_image)
 fake_ground = createSprite (200,190,400,5)
 fake_ground.visible = false

 //creating game over and reset icons
 gameOver = createSprite(300,100)
 gameOver.addImage (gameover_image)
 restart = createSprite(300,140)
 restart.addImage (restart_image)
 gameOver.scale = 0.5
 restart.scale = 0.5

 //var rand = Math.round(random(1,200))
 //console.log(rand)
 score = 0

 //creating groups
 clGroup = createGroup()
 caGroup = new Group()
}

function draw(){
  background("steelblue")
  fill ("white")
  textSize(20)
  //displays score
  text("Score: "  + score,450,50)

   //play block
    if (gameState == "play"){
    //making restart and gameover icons disapear 
    restart.visible = false
    gameOver.visible = false
  
    //moving ground
    ground.velocityX = -10 - score/50
    //updating score
    score = score + Math.round(getFrameRate()/60)
    //Make trex jump
      if (keyDown("space")&& trex.collide(fake_ground)){
      trex.velocityY = -23
      jump.play()
      }   
      if (score%200 == 0&&score>0){
        checkpoint.play()
      }      

    //giving gravity
    trex.velocityY = trex.velocityY + 2
    //scrolling ground making infinite
      if (ground.x < 0){
      ground.x = 200
    }
    //creating clouds and obstacles
    clouds()
    obstacle()
    //checking if trex hits cactus
    if (trex.isTouching(caGroup)){      
      trex.velocityY = 0
      die.play()
      gameState = "end"
    }

  }



  //end block
  else if (gameState == "end"){
    //making restart and gameover icons appear  
    restart.visible = true
    gameOver.visible = true    
    //stopping ground
    ground.velocityX = 0
    //freezing clouds n cacti
    caGroup.setVelocityXEach(0)
    clGroup.setVelocityXEach(0)
    //stopping clouds n cacti from disapearing
    caGroup.setLifetimeEach(-1)
    clGroup.setLifetimeEach(-1)
    //changing animation of trex 
    trex.changeAnimation("dead")

    //clicking reset button?
    if (mousePressedOver(restart)){
      reset()
    }

  }
 
  //make trex standon ground
  trex.collide (fake_ground)

  drawSprites()

}

function clouds (){
  if (frameCount%60 == 0){
    cloud = createSprite (600,100,40,10)
    cloud.addImage(cloud_image)
    cloud.scale = 0.5
    cloud.y = Math.round(random(10,100))
    cloud.velocityX = -5 - score/100
    //making trex above cloud
    trex.depth = cloud.depth + 1
    //fixing memory leak for clouds
    cloud.lifetime = 130
    //putting clouds in group
    clGroup.add(cloud)
    
  }
}

function obstacle (){
  if(frameCount%40==0){
    cactus = createSprite(600,160,10,40)
    cactus.velocityX = -10 - score/50
    //putting cacti in group
    caGroup.add(cactus)
  
   var r = Math.round(random(1,6))
   switch(r){
    case 1: cactus.addImage(c1_image)
    break;
    case 2: cactus.addImage(c2_image)
    break;
    case 3: cactus.addImage(c3_image)
    break;
    case 4: cactus.addImage(c4_image)
    break;
    case 5: cactus.addImage(c5_image)
    break;
    case 6: cactus.addImage(c6_image)
    break;
    
    default:break;
  }
  //scaling down cacti
  cactus.scale = 0.5
  //adding lifetime t cactus
  cactus.lifetime = 130
  
}
}
function reset(){
gameState = "play"
score = 0
caGroup.destroyEach()
clGroup.destroyEach()
trex.changeAnimation("run")
}