//https://javascript.info/strict-mode
"use strict";

$(document).ready(function(){

  // ----- Prepare Stimuli and Task ----- //
  let stimArray = createStimArray();
  let stimClassification = defineStimulusTypes(stimArray);

  // ----- Practice Block #1 ----- //
  runPractice1();

});

    // ----- Main Task ----- //


//  let taskCanvas = document.getElementById('myCanvas');
//  let ctx = taskCanvas.getContext('2d');
