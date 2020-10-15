// some tasks.js specific variables
let trialFunc;
let screenSizePromptCount = 0, numScreenSizeWarnings = 2;

// main task function
function runTasks(){
  //clear any instructions and show canvas
  hideInstructions();
  canvas.style.display = "block";

  // clear any instruction button press listeners
  $(document).off("click","#nextInstrButton");
  $(document).off("click","#startExpButton");
  $(document).off("click","#nextSectionButton");

  //reset accuracy and block trial count
  accCount = 0; blockTrialCount = 0;

  // --- PRACTICE 1 --- //
  if (expStage.indexOf("prac1") != -1){

    runPractice(16, getFirstPracticeTask());

  // --- PRACTICE 2 --- //
  } else if (expStage.indexOf("prac2") != -1){

    runPractice(16, getSecondPracticeTask());

  // --- PRACTICE 3 --- //
  } else if (expStage.indexOf("prac3") != -1) {

    runPractice(16);

  // --- MAIN TASK --- //
  } else if (expStage.indexOf("main") != -1) {

    // set blockType for first block of real task (see blockFeedback.js)
    blockIndexer = 0;
    blockType = blockOrder[blockIndexer];

    // reset
    trialCount = 0; block = 1;

    // create task arrays
    createTaskArrays(trialsPerBlock);

    // start countdown into main task
    countDown(3);
  }
}

function runPractice(numPracticeTrials, task = ""){
  trialCount = 0;
  if (repeatNecessary != true){
    block = 1;
  }

  // create task array for practice block
  createPracticeTaskArrays(numPracticeTrials, task);

  // start countdown into practice block
  countDown(3);
}

function createPracticeTaskArrays(nTrials, task){
  let taskStimuliPairs = createPracticeStimPairs(nTrials, task);
  taskStimuliSet = getStimSet(taskStimuliPairs);
  console.log(taskStimuliSet);
  cuedTaskSet = getTaskSet(taskStimuliPairs);
  console.log(cuedTaskSet);
  switchRepeatList = getSwitchRepeatList(cuedTaskSet, nTrials);
  console.log(switchRepeatList);
  actionSet = createActionArray();
  console.log(actionSet);
}

function createTaskArrays(trialsPerBlock){
  // for each block, add to large array of all trials
  let taskStimuliPairs = [];
  blockOrder.forEach(function(blockLetter){
    taskStimuliPairs = taskStimuliPairs.concat(createStimuliAndTaskSets(trialsPerBlock, blockLetter))
  });
  taskStimuliSet = getStimSet(taskStimuliPairs);
  cuedTaskSet = getTaskSet(taskStimuliPairs);
  switchRepeatList = getSwitchRepeatList(cuedTaskSet);
  actionSet = createActionArray();
}

function countDown(seconds){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "bold 60px Arial";
  if (seconds > 0){
    ctx.fillText(seconds,canvas.width/2,canvas.height/2)
    setTimeout(function(){countDown(seconds - 1)},1000);
  } else {
    trialFunc = (expStage.indexOf("main") != -1) ? runTrial : runPracticeTrial;
    trialFunc();
  }
}

function runPracticeTrial(){
  if (openerNeeded == false || opener != null) {
    sectionType = "pracTask";
    if (trialCount < taskStimuliSet.length){
      if (expType == 3){ //check if key is being held down
        expType = 4;
        promptLetGo();
      } else {
        // check if screen size is big enough
        if (screenSizeIsOk()){
          // start next trial cycle
          fixationScreen();
        } else {
          promptScreenSize();
        }
      }
    } else { //if practice block is over, go to feedback screen
      practiceAccuracyFeedback( Math.round( accCount / (blockTrialCount) * 100 ) );
    }

  } else {
    // if menu is closed, hide other elements and show menu closed prompt
    hideInstructions();
    canvas.style.display = "none";
    promptMenuClosed();
  }
}

function runTrial(){
  // make sure opener (menu.html) is still open
  if (openerNeeded == false || opener != null) {
    sectionType = "mainTask";
    if (trialCount < numBlocks * trialsPerBlock) { //if exp isn't over yet

      if (trialCount % trialsPerBlock == 0 && !breakOn && trialCount != 0) {
        //if arrived at big block break, update block information
        breakOn = true;
        bigBlockScreen();
        block++; blockIndexer++;
        blockType = blockOrder[blockIndexer];
        blockTrialCount = 0;

      } else if (trialCount % miniBlockLength == 0 && !breakOn && trialCount != 0) {

        //if arrived at miniblock break
        breakOn = true; miniBlockScreen();

      } else {

        if (expType == 3 || expType == 5){ //if key is being held down still
          expType = 4;
          promptLetGo();

        } else {

          // check if screen size is big enough
          if (screenSizeIsOk()){
            // start next trial cycle
            breakOn = false;
            fixationScreen();

          } else {

            promptScreenSize();

          }
        }
      }

    } else {
      endOfExperiment();
    }

  } else {
    // if menu is closed, hide other elements and show menu closed prompt
    hideInstructions();
    canvas.style.display = "none";
    promptMenuClosed();
  }
}

function endOfExperiment(){
  // end of experiment stuff
  try {
    // upload data to menu.html's DOM element
    $("#RTs", opener.window.document).val(data.join(";"));

    // call menu debriefing script
    opener.updateMainMenu(2);

    // close the experiment window
    JavaScript:window.close();
  } catch (e) {
    alert("Data upload failed. Did you close the previous window?");
  }
}

function fixationScreen(){
  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";

  // display fixation
  ctx.fillText("+",canvas.width/2,canvas.height/2);

  // determine which function is next
  let nextScreenFunc = (earlyCueInterval > 0) ? earlyTaskCue : stimScreen;

  // go to next after appropriate time
  setTimeout(nextScreenFunc, fixInterval);
}

function stimScreen(){
  if (expType == 5) {

    expType = 6;
    promptLetGo();

  } else {

    stimOnset = new Date().getTime() - runStart;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // set color, unless rectangular cue is needed.
    if (rectangleCue == false) {

      ctx.fillStyle = (cuedTaskSet[trialCount] == "g") ? globalColor : localColor;

    } else {

      drawRect();

    }

    //reset all response variables and await response (expType = 1)
    expType = 1; acc = NaN, respTime = NaN, partResp = NaN, respOnset = NaN;

    // display stimulus
    drawStimulus();

    // proceed to ITI screen after timeout
    stimTimeout = setTimeout(itiScreen,stimInterval);
  }
}

function drawStimulus(){
  // get local letter
  let letter = taskStimuliSet[trialCount]["l"];

  // determine color of text
  if (rectangleCue) {
    ctx.fillStyle = "black";
  } else {
    ctx.fillStyle = (cuedTaskSet[trialCount] == "g") ? globalColor : localColor;
  }

  // determine global shape (S or H)
  if (taskStimuliSet[trialCount]["g"] == "S") {
    drawLargeSMadeOf(letter);
  } else {
    drawLargeHMadeOf(letter);
  }
}

function drawLargeSMadeOf(letter){
  // row 1
  ctx.fillText(letter,canvas.width/2 - 50,canvas.height/2 - 100);
  ctx.fillText(letter,canvas.width/2,canvas.height/2 - 100);
  ctx.fillText(letter,canvas.width/2 + 50,canvas.height/2 - 100);

  // row 2
  ctx.fillText(letter,canvas.width/2 - 50,canvas.height/2 - 50);

  // row 3
  ctx.fillText(letter,canvas.width/2 - 50,canvas.height/2);
  ctx.fillText(letter,canvas.width/2,canvas.height/2);
  ctx.fillText(letter,canvas.width/2 + 50,canvas.height/2);

  // row 4
  ctx.fillText(letter,canvas.width/2 + 50,canvas.height/2 + 50);

  // row 5
  ctx.fillText(letter,canvas.width/2 - 50,canvas.height/2 + 100);
  ctx.fillText(letter,canvas.width/2,canvas.height/2 + 100);
  ctx.fillText(letter,canvas.width/2 + 50,canvas.height/2 + 100);
}

function drawLargeHMadeOf(letter){
  // row 1
  ctx.fillText(letter,canvas.width/2 - 50,canvas.height/2 - 100);
  ctx.fillText(letter,canvas.width/2 + 50,canvas.height/2 - 100);

  // row 2
  ctx.fillText(letter,canvas.width/2 - 50,canvas.height/2 - 50);
  ctx.fillText(letter,canvas.width/2 + 50,canvas.height/2 - 50);

  // row 3
  ctx.fillText(letter,canvas.width/2 - 50,canvas.height/2);
  ctx.fillText(letter,canvas.width/2,canvas.height/2);
  ctx.fillText(letter,canvas.width/2 + 50,canvas.height/2);

  // row 4
  ctx.fillText(letter,canvas.width/2 - 50,canvas.height/2 + 50);
  ctx.fillText(letter,canvas.width/2 + 50,canvas.height/2 + 50);

  // row 5
  ctx.fillText(letter,canvas.width/2 - 50,canvas.height/2 + 100);
  ctx.fillText(letter,canvas.width/2 + 50,canvas.height/2 + 100);
}

function earlyTaskCue(){
  if (expType == 5) {

    expType = 6;
    promptLetGo();

  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // if preceded by early flanker
    drawRect();

    // continue to stimulus after early cue delay
    stimTimeout = setTimeout(stimScreen,earlyCueInterval);
  }
}

function drawRect(){
  // text margin
  let borderMargin = 40;

  // set size of rectangle
  let frameWidth = 160;
  let frameHeight = 280;

  // draw box
  ctx.beginPath();
  ctx.lineWidth = "6";
  ctx.strokeStyle = (cuedTaskSet[trialCount] == "g") ? globalColor : localColor;
  ctx.rect((canvas.width/2) - (frameWidth/2), (canvas.height/2) - (frameHeight/2) - 5, frameWidth, frameHeight);
  ctx.stroke();
}

function itiScreen(){
  if (expType == 1) { // participant didn't respond
    expType = 0;
  } else if (expType == 2) { //participant still holding down response key
    expType = 3;
  }

  // variable for readability below
  let stim = taskStimuliSet[trialCount];

  // log data
  data.push(["task", sectionType, block, blockType, trialCount + 1,
    blockTrialCount + 1, getAccuracy(acc), respTime, stim["g"], stim["l"],
    (stim["g"] == stim["l"]) ? "c" : "i", cuedTaskSet[trialCount], switchRepeatList[trialCount], partResp, stimOnset, respOnset, actionSet[trialCount], NaN, NaN, NaN]);
  console.log(data);

  // prepare ITI canvas
  ctx.fillStyle = accFeedbackColor();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // display response feedback (correct/incorrect/too slow)
  ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);

  // trial finished. iterate trial counters
  trialCount++; blockTrialCount++;

  // proceed to next trial or to next section after delay
  setTimeout(trialFunc, ITIInterval());
}

function practiceAccuracyFeedback(accuracy){
  sectionStart = new Date().getTime() - runStart;
  sectionType = "pracFeedback";

  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  expType = 11;

  // display feedback
  if (accuracy < practiceAccCutoff) { //if accuracy is too low
    repeatNecessary = true;

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Remember, you need to get >" + practiceAccCutoff + "%.",canvas.width/2,canvas.height/2);
    ctx.fillText("Press any button to go back ",canvas.width/2,canvas.height/2 + 80);
    ctx.fillText("to the instructions and try again.",canvas.width/2,canvas.height/2 + 110);

  } else { //otherwise proceed to next section

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Press any button to go on to the next section.",canvas.width/2,canvas.height/2 + 100);

    // prep key press/instruction logic
    repeatNecessary = false;

  }
}

function miniBlockScreen(){
  sectionType = "miniblock";
  sectionStart = new Date().getTime() - runStart;
  expType = 7;

  // prep canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";

  // display miniblock text
  ctx.fillText("You are "+ Math.round(((trialCount%trialsPerBlock)/trialsPerBlock)*100)+"% through this block.",canvas.width/2,canvas.height/2 - 50);
  ctx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",canvas.width/2,canvas.height/2);
  ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 100);
  ctx.font = "italic bold 22px Arial";
  ctx.fillText("Remember, you need >" + taskAccCutoff + "% accuracy to be paid.",canvas.width/2,canvas.height/2 + 50);
}

function bigBlockScreen(){
  sectionType = "bigBlock";
  sectionStart = new Date().getTime() - runStart;
  expType = 7;

  // prep canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";

  // display big  block text
  ctx.font = "25px Arial";
  ctx.fillText("You finished block " + block + "/" + numBlocks + "!",canvas.width/2,canvas.height/2 - 100);
  ctx.fillText("Your overall accuracy so far is " + Math.round((accCount / trialCount) * 100) + "%.",canvas.width/2,canvas.height/2 - 50);

  // display accuracy reminder based on current accuracy
  ctx.font = "italic bold 22px Arial";
  if (Math.round((accCount / trialCount) * 100) < taskAccCutoff) {
    ctx.fillStyle = "red";
    ctx.fillText("You need >" + taskAccCutoff + "% accuracy in the task.",canvas.width/2,canvas.height/2);
  } else {
    ctx.fillStyle = "black";
    ctx.fillText("You need >" + taskAccCutoff + "% accuracy in the task.",canvas.width/2,canvas.height/2);
  }
  ctx.fillStyle = "black";

  ctx.font = "25px Arial";
  ctx.fillText("Always respond as quickly and as accurately as possible.",canvas.width/2,canvas.height/2 + 50);

  ctx.font = "bold 25px Arial";
  ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 150);
}

// functions for determining ITI feedback depending on accuracy
function accFeedback(){
  if (acc == 1){
    return "Correct";
  } else if (acc == 0) {
    return "Incorrect";
  } else {
    return "Too Slow";
  }
}

function accFeedbackColor(){
  if (acc == 1){
    return "green";
  } else if (acc == 0) {
    return "red";
  } else {
    return "black";
  }
}

function getAccuracy(accValue){
  //normalizes accuracy values into 0 or 1 (NaN becomes 0)
  return accValue == 1 ? 1 : 0;
}

// --- misc functions for edge cases (pressing and not letting go, caps lock, screensize) ---
function promptLetGo(){
  //prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";

  // show warning
  ctx.fillText("Please release key",canvas.width/2,canvas.height/2);
  ctx.fillText("immediately after responding.",canvas.width/2,canvas.height/2 + 30);
}

function screenSizeIsOk(){
  // attempts to check window width and height, using first base JS then jquery.
  // if both fail, returns TRUE
  let w, h, minWidth = 800, midHeight = 600;
  try {
    // base javascript
    w = window.innerWidth;
    h = window.innerHeight;
    if (w == null | h == null) {throw "window.innerWidth/innerHeight failed.";}
  } catch (err) {
    try{
      // jquery
      w = $(window).width();
      h = $(window).height();
      if (w == null | h == null) {throw "$(window).width/height failed.";}
    } catch (err2) {
      // failure mode, returns true if both screen checks failed
      return true;
    }
  }
  // return dimension check if values are defined
  return w >= minWidth && h >= midHeight;
};

function promptScreenSize(){
  // set key press experiment type
  expType = 10;

  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";

  // allows up to two warnings before terminating experiment
  if (screenSizePromptCount < numScreenSizeWarnings) {
    screenSizePromptCount++;

    // display screen size prompt
    ctx.font = "25px Arial";
    ctx.fillText("Your screen is not full screen or the",myCanvas.width/2,myCanvas.height/2);
    ctx.fillText("screen size on your device is too small.",myCanvas.width/2,(myCanvas.height/2) + 40);
    ctx.fillText("If this issue persists, you will need",myCanvas.width/2,(myCanvas.height/2)+160);
    ctx.fillText("to restart the experiment and will ",myCanvas.width/2,(myCanvas.height/2)+200);
    ctx.fillText("not be paid for your previous time.",myCanvas.width/2,(myCanvas.height/2)+240);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Please correct this and press any button to continue.",myCanvas.width/2,(myCanvas.height/2)+100);

  } else {

    // display screen size prompt
    ctx.fillText("Your screen is not full screen",myCanvas.width/2,myCanvas.height/2);
    ctx.fillText("or the screen size on your device is too small.",myCanvas.width/2,(myCanvas.height/2)+50);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Please refresh the page to restart the experiment.",myCanvas.width/2,(myCanvas.height/2)+100);

  }
}
