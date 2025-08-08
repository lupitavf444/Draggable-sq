let labels = [
  'Step 1: Define Your Theme',
  'Step 2: Research and Gather Inspiration',
  'Step 3: Outline Content and Structure',
  'Step 4: Collect Visual and Written Content',
  'Step 5: Choose a Layout and Design Tool',
  'Step 6: Create a Mockup',
  'Step 7: Finalize the Layout and Content',
  'Step 8: Proofread and Edit',
  'Step 9: Print or Digitize Your Zine',
  'Step 10: Distribute Your Zine'
];

let labels2 = [...labels]; // initial dummy data
let text_rect = [];

let rectangles = [];
let draggingRect = null;
let offsetX, offsetY;
let itemCounter = 0;

let labels_hold = [];
let heldRectangles = [];

let buttonX = 100, buttonY = 260 + 200, buttonW = 200, buttonH = 50;

let myFont;
let colors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#eecbff', '#dbdcff'];
let lastClickTime = 0;
let doubleClickThreshold = 300;

let bgImg, typewriterImg;

let mainTheme = [];
let words = [];

let inputBox, inputBox2;
let sendButton, sendButton2;

function preload() {
  myFont = loadFont('typewcond_bold.otf');
  bgImg = loadImage('background.png');
  typewriterImg = loadImage('typewriter.png');
}

function setup() {
  createCanvas(1700, 3250);

  inputBox = createInput();
  inputBox.position(350, 220);
  inputBox.size(450, 100);
  inputBox.style('height', '100px');
  inputBox.style('font-size', '16px');
  inputBox.style('border-radius', '12px');
  inputBox.style('background-color', 'rgba(212, 185, 94)');
  inputBox.input(updatePrompt);
  inputBox.style('font-family', 'Courier Prime');
  

  sendButton = createButton('Send');
  sendButton.position(inputBox.x + inputBox.width -50, inputBox.y + 45);
  sendButton.style('font-family', 'Courier Prime');
  sendButton.mousePressed(logPrompt);
  

  inputBox2 = createInput();
  inputBox2.position(350 + 600, 220);
  inputBox2.size(180, 100);
  inputBox2.style('height', '100px');
  inputBox2.style('border-radius', '12px');
  inputBox2.style('background-color', 'rgba(212, 185, 94)');
  inputBox2.style('font-size', '16px');
  inputBox2.input(updateWords);
  inputBox2.style('font-family', 'Courier Prime');


  sendButton2 = createButton('Send');
  sendButton2.position(inputBox2.x + inputBox2.width + 10, inputBox2.y + 35);
  sendButton2.position(inputBox2.x + inputBox2.width -50, inputBox2.y + 45);
  sendButton2.mousePressed(logWords);
  sendButton2.style('font-family', 'Courier Prime');

  for (let i = 0; i < labels.length; i++) {
    rectangles.push(new DraggableRect(50, 350 + i * 80 + 200, 250, 70, labels[i], labels2[i], i));
  }
  itemCounter = labels.length;
}

function draw() {
  background(bgImg);
  textFont("Courier Prime");

  fill(0);
  textSize(120);
  textAlign(CENTER, TOP);
  text("ESSAY WRITER", width / 2, 20);
  textSize(24);
image(typewriterImg, 200, 40, 250, 180);

  fill(100, 200, 100);
  rect(buttonX, buttonY, buttonW, buttonH, 5);
  fill(0);
  textAlign(CENTER, CENTER);
  text('Add Item', buttonX + buttonW / 2, buttonY + buttonH / 2);

  let holdX = 1200;
  let holdY = 400 + 200;
  let holdWidth = width - holdX;
  let holdHeight = 400;
  fill(210, 143, 51);
  rect(holdX, holdY, holdWidth, holdHeight);
  fill(0);
  textAlign(CENTER, CENTER);
  text("HOLD AREA", holdX + holdWidth / 2, holdY + holdHeight / 2);

  let rectX = 1200;
  let rectY = 800 + 200;
  let rectWidth = width - rectX;
  let rectHeight = 150;
  fill(179, 66, 51);
  rect(rectX, rectY, rectWidth, rectHeight);
  fill(255);
  text("DELETION AREA", rectX + rectWidth / 2, rectY + rectHeight / 2);

  for (let rect of rectangles) {
    rect.update();
    rect.show();
  }

  for (let rect of heldRectangles) {
    rect.update();
    rect.show();
  }

  reorderRectangles();
}

function mousePressed() {
  let clickedOnRect = false;
  let currentTime = millis();

  for (let rect of rectangles.concat(heldRectangles)) {
    if (rect.isMouseOver()) {
      if (currentTime - lastClickTime < doubleClickThreshold) {
        let newLabel = prompt("Edit the label:", rect.label);
        if (newLabel !== null && newLabel.trim() !== "") {
          rect.label = newLabel.trim();
          labels[rect.index] = rect.label;
        }
      } else {
        draggingRect = rect;
        offsetX = mouseX - rect.x;
        offsetY = mouseY - rect.y;
      }
      clickedOnRect = true;
      lastClickTime = currentTime;
      break;
    }
  }

  if (!clickedOnRect && isButtonClicked()) {
    let newLabel = prompt("Enter the label for the new item:");
    if (newLabel && newLabel.trim() !== "") {
      let newRect = new DraggableRect(50, 350 + rectangles.length * 80 + 200, 250, 70, newLabel.trim(), newLabel.trim(), labels.length);
      rectangles.push(newRect);
      labels.push(newLabel.trim());
      labels2.push(newLabel.trim());
    } else {
      alert("Invalid label. Item was not added.");
    }
  }
}

function mouseReleased() {
  if (draggingRect) {
    let isInHoldArea = draggingRect.x > 400 && draggingRect.y > (400 + 200) && draggingRect.y < (800 + 200);
    let isInDeletionArea = draggingRect.x > 400 && draggingRect.y > (800 + 200) && draggingRect.y < (950 + 200);

    if (isInHoldArea) {
      let index = rectangles.indexOf(draggingRect);
      if (index !== -1) {
        labels_hold.push(draggingRect.label);
        labels.splice(index, 1);
        labels2.splice(index, 1);
        draggingRect.x = 410;
        draggingRect.y = 400 + 200 + heldRectangles.length * 80;
        heldRectangles.push(draggingRect);
        rectangles.splice(index, 1);
      }
    } else if (isInDeletionArea) {
      let index = rectangles.indexOf(draggingRect);
      if (index !== -1) {
        rectangles.splice(index, 1);
        labels.splice(index, 1);
        labels2.splice(index, 1);
      }
    } else if (draggingRect.x < 400) {
      if (heldRectangles.includes(draggingRect)) {
        let holdIndex = labels_hold.indexOf(draggingRect.label);
        if (holdIndex !== -1) {
          let newRect = new DraggableRect(mouseX, mouseY, 250, 70, labels_hold[holdIndex], labels_hold[holdIndex], labels.length);
          rectangles.push(newRect);
          labels.push(labels_hold[holdIndex]);
          labels2.push(labels_hold[holdIndex]);
          labels_hold.splice(holdIndex, 1);
          heldRectangles.splice(heldRectangles.indexOf(draggingRect), 1);
        }
      }
    }

    draggingRect = null;
  }

  reorderRectangles();
}

function isButtonClicked() {
  return mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH;
}

function reorderRectangles() {
  if (draggingRect) return;

  rectangles.sort((a, b) => a.y - b.y);

  for (let i = 0; i < rectangles.length; i++) {
    rectangles[i].y = 350 + i * 200 + 200;
    labels[i] = rectangles[i].label;
    labels2[i] = rectangles[i].label2;
    rectangles[i].index = i;
  }
}

class DraggableRect {
  constructor(x, y, w, h, label, label2, index) {
    this.x = x;
    this.y = y;
    this.w = w * 1.25;
    this.h = 70;
    this.label = label;
    this.label2 = label2;
    this.color = random(colors);
    this.index = index;
    

    this.input1 = createInput(this.label);
    this.input1.position(this.x, this.y);
    this.input1.size(300, this.h);
    this.input1.style('font-family', 'Courier Prime');
    this.input1.input(() => {
      this.label = this.input1.value();
      labels[this.index] = this.label;
    });

    this.input2 = createInput(this.label2);
    this.input2.position(this.x + 400, this.y);
    this.input2.size(500, this.h + 100);
    this.input2.style('font-family', 'Courier Prime');
    this.input2.input(() => {
      this.label2 = this.input2.value();
      labels2[this.index] = this.label2;
    });
  }

  update() {
    if (draggingRect === this) {
      this.x = mouseX - offsetX;
      this.y = mouseY - offsetY;
    }
    this.input1.position(this.x, this.y);
    this.input2.position(this.x + 400, this.y);
  }

  show() {
    this.input1.show();
    this.input2.show();
  }

  isMouseOver() {
    return mouseX > this.x && mouseX < this.x + this.w &&
      mouseY > this.y && mouseY < this.y + this.h;
  }
}

function splitTextIntoLines(text, maxLength) {
  let lines = [];
  let words = text.split(' ');
  let currentLine = '';

  for (let word of words) {
    if (currentLine.length + word.length + 1 <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

function updatePrompt() {
  mainTheme[0] = this.value();
}

function updateWords() {
  words[0] = this.value();
}

function logPrompt() {
  console.log(mainTheme);
}

function logWords() {
  console.log(words);
}
