var mic, fft;

function setup() {
  createCanvas(displayWidth,displayHeight);
  background(0);
  noCursor();
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  var level = mic.getLevel();
  var flash = map(level, 0,1,5,120);
  background(flash);
  
  noStroke();
  var spec = fft.analyze();
  //console.log(spec[1]);
  for(var i = 0; i<spec.length; i++){
    var x = map(i, 0, spec.length, 0, width);
    var h = map(spec[i], 0, 255, 0, height/2);
    fill(165);
    rect(x, height/2, width/spec.length, -h);
    fill(color(165,165,165,160));
    rect(x, height/2, width/spec.length, h);
  }
  //fill(color(255,255,255,127));
  //var radius = map(level, 0,1,100,900);
  //ellipse(width/2, height/2, radius, radius);
}

function mousePressed() {
  let fs = fullscreen();
  fullscreen(!fs);
}