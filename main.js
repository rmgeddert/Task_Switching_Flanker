//https://javascript.info/strict-mode
"use strict";

//initialize stimArray and relevant classification variables global)
let stimArray = createStimArray();
let stimClassification = defineStimuli(stimArray);
console.log(stimArray);
console.log(stimClassification);

$(document).ready(function(){
    // prepare task canvas
    let taskCanvas = document.getElementById('myCanvas');
    let ctx = taskCanvas.getContext('2d');

  // ----- Practice Blocks ----- //
    runInstructions("1"); //start with first instruction block
});
