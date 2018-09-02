function setup() {
    createCanvas(windowWidth, windowHeight)
      noLoop()
      background(198,198,230)
  }
  
  function draw() {
      fill(255)
      stroke(255)
      translate(100,100)
      cloud1()
      translate(200,200)
      cloud2()
  }

function cloud1(){
    beginShape()
    vertex(20,10)
    bezierVertex(20,0,40,0,40,10)
    vertex(40,10)
    bezierVertex(40,0,60,0,60,10)
    vertex(60,10)
    bezierVertex(80,10,80,25,60,25)
	vertex(60,25)
	bezierVertex(60,35,20,35,20,25)
	vertex(20,25)
	bezierVertex(0,25,0,10,20,10)
    endShape(CLOSE)
}

function cloud2(){
    v1={x:20,y:10}
    v2={x:20,y:0}
    v3={x:40,y:0}
    v4={x:40,y:10}
    beginShape()
    vertex(v1.x,v1.y)
    bezierVertex(v2.x,v2.y,v3.x,v3.y,v4.x,v4.y)
    vertex(v4.x,v4.y)
    /*bezierVertex(40,0,60,0,60,10)
    vertex(60,10)
    bezierVertex(80,10,80,25,60,25)
	vertex(60,25)
	bezierVertex(60,35,20,35,20,25)
	vertex(20,25)
	bezierVertex(0,25,0,10,20,10)*/
    endShape(CLOSE)
}
