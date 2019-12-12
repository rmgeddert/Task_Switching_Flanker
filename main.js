//https://javascript.info/strict-mode
"use strict";

// for testing
let speed = "NORMAL" //fast

// ----- Experiment Paramenters (CHANGE ME) ----- //
let stimInterval = (speed == "fast") ? 20 : 2000 //2000
let fixInterval = (speed == "fast") ? 20 : 500; //500 ms
let numBlocks = 8, trialsPerBlock = 48; // (multiples of 24) (48 usually)
let miniBlockLength = 0; //when little breaks appear (doesn't need to be multiple of 24). 0 to turn offm
let practiceAccCutoff = 0; // 75 acc%
let taskAccCutoff = 75; // 75 acc%
let skipPractice = false; // <- turn practice blocks on or off
function ITIInterval(){
  let itiMin = (speed == "fast") ? 20 : 1200; //1200
  let itiMax = (speed == "fast") ? 20 : 1400; //1400
  let itiStep = 50; //step size

  // random number between itiMin and Max by step size
  let randInterval = itiMin + (Math.floor( Math.random() * ( Math.floor( (itiMax - itiMin) / itiStep ) + 1 ) ) * itiStep);
  return randInterval;
}

//initialize global task variables
let stimArray = selectExperimentStimuli(); // establish stimuli set for task
let expStimDict = defineStimuli(stimArray); // define characteristics of stimuli
let taskStimuliSet, cuedTaskSet, actionSet; // global vars for task components
let canvas, ctx; // global canvas variable
let expStage = (skipPractice == true) ? "main1" : "prac1-1";
// vars for tasks (iterator, accuracy) and reaction times:
let trialCount, acc, accCount, stimOnset, respOnset, respTime, block = 1, partResp, runStart;
let stimTimeout, breakOn = false, repeatNecessary = false, data=[];
let sectionStart, sectionEnd, sectionType;
let expType = 0; // see comments below
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
*/
let pracOrder = randIntFromInterval(1,2);
  // case 1: practice magnitude first
  // case 2: practice parity first
let taskMapping = randIntFromInterval(1,8);
  // case 1: LH [par_odd, par_even]  -  RH [mag_higher, mag_lower]
  // case 2: LH [par_odd, par_even]  -  RH [mag_lower, mag_higher]
  // case 3: LH [par_even, par_odd]  -  RH [mag_higher, mag_lower]
  // case 4: LH [par_even, par_odd]  -  RH [mag_lower, mag_higher]
  // case 5: LH [mag_lower, mag_higher]  -  RH [par_odd, par_even]
  // case 6: LH [mag_lower, mag_higher]  -  RH [par_even, par_odd]
  // case 7: LH [mag_higher, mag_lower]  -  RH [par_odd, par_even]
  // case 8: LH [mag_higher, mag_lower]  -  RH [par_even, par_odd]
let colorMapping = randIntFromInterval(1,2);
  // case 1: magnitude = Red, parity = Blue
  // case 2: magnitude = Blue, parity = Red

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
        partResp = event.which;
        acc = (partResp == actionSet[trialCount]) ? 1 : 0;
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
        if (CapsLock.isOn()){
          promptCapsLock();
        } else {
          itiScreen();
        }
      } else if (expType == 3 || expType == 5) {
        expType = 0;
      } else if (expType == 4 || expType == 6 ) {
        expType = 0;
        countDown(3);
      } else if (expType == 7) {
        // 7: feedback - press button to start next block
        sectionEnd = new Date().getTime() - runStart;
        data.push(["Feedback", sectionType, block, blockType, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, sectionStart, sectionEnd, sectionEnd - sectionStart]);
        console.log(data);
        expType = 0;
        countDown(3);
      } else if (expType == 8) { // 8: "press button to start task"
        // log how much time was spent in this section
        sectionEnd = new Date().getTime() - runStart;
        data.push([expStage, sectionType, block, blockType, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, sectionStart, sectionEnd, sectionEnd - sectionStart]);
        console.log(data);

        // reset expStage and start task
        expType = 0;
        runTasks();
      } else if (expType == 9) { // 9: "press button to start next section"
        // log how much time was spent in this section
        sectionEnd = new Date().getTime() - runStart;
        data.push([expStage, sectionType, block, blockType, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, sectionStart, sectionEnd, sectionEnd - sectionStart]);
        console.log(data);

        // reset expStage and proceed to next section
        expType = 0;
        navigateInstructionPath(repeatNecessary);
      }
    });

  // ----- Start with instructions after loading ----- //
    runStart = new Date().getTime();
    loadImages();
    runInstructions();
});

// ------- Misc Experiment Functions ------- //
let images = {
  "F": {},
  "C": {},
  "S": {}
}

function loadImages(){
  // these are indexes, not file names
  let controlNums = [0,1,2,3,4,5,6,7,8,9];
  let proFlexNums = [0,1,2,3,4,5,6,7,8,9];
  let proStabNums = [0,1,2,3,4,5,6,7,8,9];
  let numControl = 4, numFlex = 2, numStab = 2; // how many images needed per block
  let currArr;

  // get images numbers for control blocks
  currArr = controlNums;
  loopAndLoad(numControl,"C");

  // get image numbers for pro flexibility blocks
  currArr = proFlexNums;
  loopAndLoad(numFlex,"F");

  // get images numbers for pro stability blocks
  currArr = proStabNums;
  loopAndLoad(numStab,"S");

  function loopAndLoad(numImgNeeded, blockType){
    for (var i = 0; i < numImgNeeded; i++) {
      images[blockType][i] = new Image();
      images[blockType][i].src = feedbackImages[blockType][getRandomFromArr()];
    }
  }

  function getRandomFromArr(){
    let randIndex = Math.floor(Math.random() * currArr.length);
    return currArr.splice(randIndex, 1)[0];
  }
}

function randIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
