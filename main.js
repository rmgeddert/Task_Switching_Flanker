//https://javascript.info/strict-mode
"use strict";

// ----- Task Paramenters (CHANGE ME) ----- //
let stimInterval = 100, fixInterval = 100; //1500, 500
let numBlocks = 3, trialsPerBlock = 48; // (multiples of 24)
let miniBlockLength = 24;

function ITIInterval(){
  let itiMin = 100; //minimum ITI value 1200
  let itiMax = 100; //maximum ITI value 1400
  let itiStep = 50; //step size

  // random number between itiMin and Max by step size
  let randInterval = itiMin + (Math.floor( Math.random() * ( Math.floor( (itiMax - itiMin) / itiStep ) + 1 ) ) * itiStep);
  return randInterval;
}

//initialize global task variables
let stimArray = selectExperimentStimuli(); // establish stimuli set for task
let stimClassification = defineStimuli(stimArray); // define characteristics of stimuli
let taskStimuliSet, cuedTaskSet, actionSet; // global vars for task components
let canvas, ctx; // global canvas variable
let expStage = "prac1"; // default/initial value for experiment logic
let stimCount, acc; // vars for tasks (iterator, accuracy)
let stimTimeout, miniBlockOn = false, feedbackOn = false;
let expType = 0; // see comments below

/*  expType explanations:
      0: No key press expected/needed
      1: Key press expected (triggered by stimScreen() func that presents stimuli)
      2: Key press from 1 received. Awaiting keyup event, which resets to 0 and calls itiScreen() function immediately.
      3: Parcticipant still holding keypress from 1 during ITI. Awaitng keyup event, which resets to 0 but doesn't call itiScreen() function.
      4: Participant still holding keypress from 1 at start of next Trial. Call promptLetGo() func to get participant to let go. After keyup resume experiment and reset to 0.
      5: Key press from 0 still being held down. On keyup, reset to 0.
      6: Key press from 0 still being held down when stimScreen() func is called. Call promptLetGo() func. After keyup resume and reset to 0.
      7: mini block screen. Awaiting key press to continue, keyup resets to 0 and goes to next trial.
*/

// ------ EXPERIMENT STARTS HERE ------ //
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv //
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
      } else if (expType == 1){
        expType = 2; //prevent additional responses during this trial (i.e. holding down key)
        acc = (event.which == actionSet[stimCount]) ? 1 : 0;
      }
    })

    // create key release listener
    $("body").keyup(function(event){
      if (expType == 2){
        expType = 0;
        clearTimeout(stimTimeout);
        itiScreen();
      } else if (expType == 3 || expType == 5) {
        expType = 0;
      } else if (expType == 4 || expType == 6 || expType == 7) {
        expType = 0;
        setTimeout(function(){countDown(3);},500);
      }
    });

  // ----- Start with Practice Block Instructions ----- //
    runInstructions();
    // runTasks();
});

// ------- Misc Experiment Functions ------- //

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
