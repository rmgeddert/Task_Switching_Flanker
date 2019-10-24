//https://javascript.info/strict-mode
"use strict";

//declare global variables (easy access for changes)
let trialNumber = 320;
let miniBlockSize = 16;

// ----- Prepare Experiment ----- //
let stimCategories = {
  Parity: {},
  Magnitude: {},
  CongruencyClass: {}
};
let stimulusArray = createStimArray(); //also defines stimCategories
let cuedTaskArray = createCuedTaskArray();
let actionArray = createActionArray();
console.log(stimulusArray);
console.log(cuedTaskArray);
console.log(actionArray);

// ----- Instructions ----- //
runInstructions();

// ----- Practice Block ----- //
$(document).ready(function(){
  let taskCanvas = document.getElementById('myCanvas');
  let ctx = taskCanvas.getContext('2d');
});

// ----- Main Task ----- //
