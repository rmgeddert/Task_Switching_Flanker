//https://javascript.info/strict-mode
"use strict";

//declare global variables (easy access for changes)

$(document).ready(function(){
  // ----- Prepare Stimulis ----- //
  let stimArray = createStimArray();
  let stimClassification = defineStimulusTypes(stimArray);

  // ----- Practice Block ----- //
  runInstructions();
  let taskCanvas = document.getElementById('myCanvas');
  let ctx = taskCanvas.getContext('2d');
});

// ----- Main Task ----- //
