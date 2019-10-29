//https://javascript.info/strict-mode
"use strict";

$(document).ready(function(){

  // ----- Prepare Stimuli and Task ----- //
    let stimArray = createStimArray();
    let stimClassification = defineStimuli(stimArray);

    // prepare task canvas
    let taskCanvas = document.getElementById('myCanvas');
    let ctx = taskCanvas.getContext('2d');

  // ----- Practice Blocks ----- //
    runInstructions("1"); //start with first instruction block

});

    // ----- Main Task ----- //


//  let taskCanvas = document.getElementById('myCanvas');
//  let ctx = taskCanvas.getContext('2d');

// let cuedTaskArray = createCuedTaskArray(stimArray.length);
// let actionArray = createActionArray();
