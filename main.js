//https://javascript.info/strict-mode
"use strict";

//initialize global task variables
let stimArray = createStimArray(); // establish stimuli set for task
let stimClassification = defineStimuli(stimArray); // define characteristics of stimuli
let taskStimuliSet, cuedTaskSet, actionSet; // global vars for task components
let canvas, ctx; // global canvas variable
let expStage = "prac1"; // default/initial value for experiment logic
let stimCount, acc; // vars for tasks (iterator, accuracy)
let expType = 0; // 0 = non-task sections, 1 = task - awaiting response, 2 = task - response received/keyup needed, 3 - held button too long
console.log(expType);
let stimTimeout; // global timeout variables

// ----- Task Paramenters (CHANGE ME) ----- //
let stimInterval = 1000, fixInterval = 500;

function ITIInterval(){
  let itiMin = 1200; //minimum ITI value
  let itiMax = 1400; //maximum ITI value
  let itiStep = 50; //step size for randomization

  // random number between itiMin and Max by step size
  let randInterval = itiMin + (Math.floor( Math.random() * ( Math.floor( (itiMax - itiMin) / itiStep ) + 1 ) ) * 50);
  console.log(randInterval);
  return randInterval;
}

$(document).ready(function(){

    // prepare task canvas
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    ctx.font = "bold 60px Arial";
    ctx.textBaseline= "middle";
    ctx.textAlign="center";

    // create key press listener
    $("body").keypress(function(event){
      if (expType == 0) {
        expType = 5; //keydown when not needed. Keyup will reset to 0.
        console.log(expType);
      } else if (expType == 1){
        expType = 2; //prevent additional responses during this trial (i.e. holding down key)
        console.log(expType);
        acc = (event.which == actionSet[stimCount]) ? 1 : 0;
      }
    })

    $("body").keyup(function(event){
      if (expType == 2){
        expType = 0;
        console.log(expType);
        clearTimeout(stimTimeout);
        itiScreen();
      } else if (expType == 3 || expType == 5) {
        expType = 0;
        console.log(expType);
      } else if (expType == 4 || expType == 6) {
        expType = 0;
        console.log(expType);
        setTimeout(function(){countDown(3);},500);
      }
    });

  // ----- Practice Blocks ----- //
    runInstructions("1");
});

// function for wrapping text in Canvas
// https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
function getLines(text, maxWidth) {
    let words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function getLinesForParagraphs(ctx, text, maxWidth){
  return text.split("\n").map(para => getLines(ctx, para, maxWidth)).reduce([], (a, b) => a.concat(b))
}
