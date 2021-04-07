var socket;
let capture;
var sound;
var black_keys = [30, 80, 180, 230, 280, 380, 430, 530, 580, 630, 730];
var sounds = [];
var light = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26];
var darks = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22, 25];
var white_keys_on = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var black_keys_on = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var mouses = [];

var kw = 0;

function between(a, b, c) {
  return (a >= b) && (a <= c);
}

function get_speed(x, y) {
  if (!between(y, 100, 280) || !between(x, 200, 1000)) {
    return false;
  }

  if (between(y, 100, 200)) {
    if (between(x - 210, 30, 60)) {
      return 1;
    }
    if (between(x - 210, 80, 110)) {
      return 3;
    }
    if (between(x - 210, 180, 210)) {
      return 6;
    }
    if (between(x - 210, 230, 260)) {
      return 8;
    }
    if (between(x - 210, 280, 310)) {
      return 10;
    }
    if (between(x - 210, 380, 410)) {
      return 13;
    }
    if (between(x - 210, 430, 460)) {
      return 15;
    }
    if (between(x - 210, 530, 560)) {
      return 18;
    }
    if (between(x - 210, 580, 610)) {
      return 20;
    }
    if (between(x - 210, 630, 660)) {
      return 22;
    }
    if (between(x - 210, 730, 760)) {
      return 25;
    }
  }

  if (between(x, 200, 250)) {
    return 0;
  }
  if (between(x, 250, 300)) {
    return 2;
  }
  if (between(x, 300, 350)) {
    return 4;
  }
  if (between(x, 350, 400)) {
    return 5;
  }
  if (between(x, 400, 450)) {
    return 7;
  }
  if (between(x, 450, 500)) {
    return 9;
  }
  if (between(x, 500, 550)) {
    return 11;
  }
  if (between(x, 550, 600)) {
    return 12;
  }
  if (between(x, 600, 650)) {
    return 14;
  }
  if (between(x, 650, 700)) {
    return 16;
  }
  if (between(x, 700, 750)) {
    return 17;
  }
  if (between(x, 750, 800)) {
    return 19;
  }
  if (between(x, 800, 850)) {
    return 21;
  }
  if (between(x, 850, 900)) {
    return 23;
  }
  if (between(x, 900, 950)) {
    return 24;
  }
  if (between(x, 950, 1000)) {
    return 26;
  }
}

function preload() {
  pointer = loadImage('pointer.png');
  sound = loadSound('note.mp3');
}

function setup() {
  createCanvas(1200, 400);
  background(255);
  // noCursor();

  socket = io.connect('https://d6b282a8b635.ngrok.io') // server link goes here
  socket.on('mouse', newDrawing);
  socket.on('note', playNotes);
  pointer.resize(21, 30);

  for (var n = 1; n < 28; n++) {
    sound = loadSound('sounds/' + n + '.mp3')
    sounds = append(sounds, sound);
  }
}

function newDrawing(data) {
  positions = data[0];
  users = data[1];
}

function playNotes(data) {
  note_ = data['note']
  sound_thing = sounds[note_];
  sound_thing.play();
  if (light.indexOf(note_) > -1) {
    white_keys_on[light.indexOf(note_) - 1] = 1
  }
  if (darks.indexOf(note_) > -1) {
    black_keys_on[darks.indexOf(note_)] = 1
  }
  console.log(white_keys_on)
}

function draw() { // mouseDragged
  background(255);
  stroke(0);
  noFill();
  rect(200, 100, 800, 180, 10);
  kw++;

  if ((kw % 20) == 0) {
    white_keys_on = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    black_keys_on = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  for (var x = 250; x < 1000; x += 50) {
    if (white_keys_on[(x - 250) / 50]) {
      fill(205, 205, 220);
      rect(x, 100, 50, 180);
    }
    line(x, 100, x, 280);
  }

  for (var i = 0; i < 11; i++) {
    fill(0);

    if (black_keys_on[i]) {
      fill(50, 50, 65);
    }

    rect(205 + black_keys[i], 100, 30, 100);
  }

  var data = {
    x: mouseX,
    y: mouseY
  }

  socket.emit('mouse', data);

  //image(pointer, mouseX-10, mouseY-10);

  /*if (users) {
    for (var i = 0; i < users.length; i++) {
      image(pointer, positions[users[i]].x - 10, positions[users[i]].y - 10);
    }
  }*/
}

function mousePressed() {
  var data2 = {
    note: get_speed(mouseX, mouseY)
  }

  socket.emit('note', data2)
  playNotes(data2);
  /*if (get_speed(mouseX, mouseY)) {
    get_speed(mouseX, mouseY).play();
  }*/
}
