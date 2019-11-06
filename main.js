//https://javascript.info/strict-mode
"use strict";

//initialize global task variables
let stimArray = createStimArray(); // establish stimuli set for task
let stimClassification = defineStimuli(stimArray); // define characteristics of stimuli
let taskStimuliSet, cuedTaskSet, actionSet; // global vars for task components
let canvas, ctx; // global canvas variable
let pracBlockNum = "1"; // efault/initial value for practice block logic
let stimCount, acc; // vars for tasks (iterator, accuracy)
let expType = 0; // 0 = non-task sections, 1 = task - awaiting response, 2 = task - response received/keyup needed
let stimTimeout; // global timeout variables

// ----- Task Paramenters (CHANGE ME) ----- //
let itiInterval = 1200, stimInterval = 2000, fixInterval = 500;

$(document).ready(function(){
    // prepare task canvas
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    ctx.font = "bold 70px Arial";
    ctx.textBaseline= "middle";
    ctx.textAlign="center";

    // create key press listener
    $("body").keypress(function(event){
      if (expType == 1){
        expType = 2; //prevent additional responses during this trial (i.e. holding down key)
        if (event.which == actionSet[stimCount]){
          acc = 1;
        } else {
          acc = 0;
        }
      }
    })

    $("body").keyup(function(event){
      if (expType == 2){
        expType = 0; //prevent additional keyup events during this trial
        clearTimeout(stimTimeout);
        itiScreen();
      }
    });

  // ----- Practice Blocks ----- //
    runInstructions("1");
});
