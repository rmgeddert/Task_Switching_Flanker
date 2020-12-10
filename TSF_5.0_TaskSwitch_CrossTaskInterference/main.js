//https://javascript.info/strict-mode
"use strict";

// for testing
let testMode = false;
let speed = "normal"; //fast, normal
// speed = (testMode == true) ? "fast" : speed; //testMode defaults to "fast"
let skipPractice = false; // turn practice blocks on or off
let openerNeeded = false; //true

// ----- Experiment Paramenters (CHANGE ME) ----- //
let rectangleCue = true; // if true, colored rectangular cue signals task, else the numbers themselves are colored
let stimInterval = (speed == "fast") ? 10 : 1500; //2000 stimulus interval
let fixInterval = (speed == "fast") ? 10 : 500; //500 ms intertrial interval
let earlyCueInterval = (rectangleCue != true) ? 0 : ((speed == "fast") ? 0 : 0); //100; early cue (relative to target presentation), 0 makes cue concurrant with target presentation. only valid with rectangle cue
let numBlocks = 4, trialsPerBlock = 128; // (multiples of 16) (48 usually)
let numPracticeTrials = 8;
let miniBlockLength = 0; //doesn't need to be multiple of 24. 0 to turn off
let practiceAccCutoff = (testMode == true) ? 0 : 85; // 75 acc%
let taskAccCutoff = (testMode == true) ? 0 : 85; // 75 acc%

function ITIInterval(){
  let itiMin = (speed == "fast") ? 20 : 1200; //1200
  let itiMax = (speed == "fast") ? 20 : 1400; //1400
  let itiStep = 50; //step size
  // random number between itiMin and Max by step size
  return itiMin + (Math.floor( Math.random() * ( Math.floor( (itiMax - itiMin) / itiStep ) + 1 ) ) * itiStep);
}

//initialize global task variables
let taskStimuliSet, cuedTaskSet, actionSet, switchRepeatList, relevancyArr; // global vars for task arrays
let canvas, ctx; // global canvas variable
let expStage = (skipPractice == true) ? "main1" : "prac1-1";
// vars for tasks (iterator, accuracy) and reaction times:
let trialCount, blockTrialCount, acc, accCount, stimOnset, respOnset, respTime, block = 1, partResp, runStart, blockType = NaN;
let stimTimeout, breakOn = false, repeatNecessary = false, data=[];
let sectionStart, sectionEnd, sectionType, sectionTimer;
let expType = 0; // see below
/*  expType explanations:
      0: No key press expected/needed
      1: Key press expected (triggered by stimScreen() func that presents stimuli)
      2: Key press from 1 received. Awaiting keyup event, which resets to 0 and calls itiScreen() function immediately.
      3: Parcticipant still holding keypress from 1 during ITI. Awaitng keyup event, which resets to 0 but doesn't call itiScreen() function.
      4: Participant still holding keypress from 1 at start of next Trial. Call promptLetGo() func to get participant to let go. After keyup resume experiment and reset to 0.
      5: Key press from 0 still being held down. On keyup, reset to 0.
      6: Key press from 0 still being held down when stimScreen() func is called. Call promptLetGo() func. After keyup resume and reset to 0.
      7: mini block screen/feedback. Awaiting key press to continue, keyup resets to 0 and goes to next trial.
      8: instruction start task "press to continue"
      9: proceed to next instruction "press to continue"
      10: Screen Size too small, "press any button to continue"
*/

let pracOrder = randIntFromInterval(1,2);
// console.log("pracOrder", pracOrder);
  // case 1: practice parity first
  // case 2: practice magnitude first

let taskMapping = randIntFromInterval(1,4);
// console.log("taskMapping", taskMapping);
  // case 1: odd/even: "z" and "m", greater/less: "z" and "m"
  // case 2: odd/even: "z" and "m", greater/less: "m" and "z"
  // case 3: odd/even: "m" and "z", greater/less: "z" and "m"
  // case 4: odd/even: "m" and "z", greater/less: "m" and "z"

let colorMapping = randIntFromInterval(1,2);
// console.log("colorMapping", colorMapping);
  // case 1: odd/even = Red, greater/less = Blue
  // case 2: greater/less = Blue, odd/even = Red

// instrction variables based on mappings
let parityColor = (colorMapping == 1) ? "red" : "blue";
let magnitudeColor = (colorMapping == 1) ? "blue" : "red";
let parity_z = (taskMapping == 1 || taskMapping == 2) ? "odd" : "even";
let parity_m = (parity_z == "odd") ? "even" : "odd";
let magnitude_z = (taskMapping == 1 || taskMapping == 3) ? "greater than 5" : "less than 5";
let magnitude_m = (magnitude_z == "greater than 5") ? "less than 5" : "greater than 5";

let blockOrder = getBlockOrder(randIntFromInterval(1,4));
  // Latin square counterbalancing
  // 1:   A   B   D   C
  // 2:   B   C   A   D
  // 3:   C   D   B   A
  // 4:   D   A   C   B
  //
  // Congruency manipulations
  // A: H Fl L TS, B: H FL H TS, C: L Fl L TS, D: L Fl L TS
  // high 75% (H), low 25% (L), Flanker Inc (Fl), Task Switch (TS)

// ------ EXPERIMENT STARTS HERE ------ //
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
      partResp = event.which;
      acc = (actionSet[trialCount].indexOf(partResp)) != -1 ? 1 : 0;
      if (acc == 1){accCount++;}
      respOnset = new Date().getTime() - runStart;
      respTime = respOnset - stimOnset;
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
    } else if (expType == 4 || expType == 6 || expType == 10) {
      expType = 0;
      countDown(3);
    } else if (expType == 7) {
      clearInterval(sectionTimer);

      // 7: block feedback - press button to start next block
      sectionEnd = new Date().getTime() - runStart;
      data.push(["feedback", sectionType, block, blockType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
      console.log(data);
      expType = 0;

      // increment block information before beginning next block
      block++; blockIndexer++;
      blockType = blockOrder[blockIndexer];
      blockTrialCount = 0;
      countDown(3);
    } else if (expType == 8) { // 8: "press button to start task"
      // log how much time was spent in this section
      sectionEnd = new Date().getTime() - runStart;
      data.push([expStage, sectionType, block, blockType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
      console.log(data);
      // reset expStage and start task
      expType = 0;
      runTasks();
    } else if (expType == 9) { // 9: "press button to start next section"
      // log how much time was spent in this section
      sectionEnd = new Date().getTime() - runStart;
      data.push([expStage, sectionType, block, blockType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
      console.log(data);
      // reset expStage and proceed to next section
      expType = 0;
      navigateInstructionPath(repeatNecessary);
    } else if (expType == 11) { // repeat instructions
      // log how much time was spent in this section
      sectionEnd = new Date().getTime() - runStart;
      data.push([expStage, sectionType, block, blockType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
      console.log(data);
      // iterate block and go back to instructions
      expType = 0;
      if (repeatNecessary) {
        block++;
      } else {
        block = 1;
      }
      navigateInstructionPath(repeatNecessary);
    }
  });

  // see if menu.html is still open
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
    // start experiment
    runStart = new Date().getTime();
    runInstructions();
  }
});

// ------- Misc Experiment Functions ------- //
function randIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function promptMenuClosed(){
  $('.MenuClosedPrompt').show();
}
