// see function navigateInstructionPath() in tasks.js for navigation code

// global instruction iterator information. Change as needed
let instructions = {
  // contains the interator for each instruction block
  iterator: {
    "prac1-1": 1, "prac1-2": 1, "prac1-3": 1, "prac2": 1, "prac3": 1, "main1": 1, "main2": 1, "main3": 1
  },
  // contains the max value of each instruction iteration. iteration will STOP at max.
  max: {
    "prac1-1": 3, "prac1-2": 3, "prac1-3": 4, "prac2": 6, "prac3": 6, "main1": 5, "main2": 3, "main3": 6
  },
  // what does instruction section end with?
  // #nextSectionButton, #startExpButton, buttonPressNextSection, buttonPressStartTask
  exitResponse: {
    "prac1-1": '#nextSectionButton',
    "prac1-2": '#nextSectionButton',
    "prac1-3": 'buttonPressStartTask',
    "prac2": 'buttonPressStartTask',
    "prac3": 'buttonPressStartTask',
    "main1": '#nextSectionButton',
    "main2": '#nextSectionButton',
    "main3": 'buttonPressStartTask'
  }
};
let iterateAgain = false, task;

function navigateInstructionPath(repeat = false){
  if (repeat == true) {
    // if multi stage instructions, ensures it goes back to first not second
    switch (expStage){
      case "prac1-1":
      case "prac1-2":
      case "prac1-3":
        expStage = "prac1-1";
        break;
    }
    runInstructions();
  } else {
    switch (expStage){
      case "prac1-1":
        expStage = "prac1-2";
        break;
      case "prac1-2":
        expStage = "prac1-3";
        break;
      case "prac1-3":
        expStage = "prac2";
        break;
      case "prac2":
        expStage = "prac3";
        break;
      case "prac3":
        expStage = "main1";
        break;
      case "main1":
        expStage = "main2";
        break;
      case "main2":
        expStage = "main3";
        break;
    }
    runInstructions();
  }
}

function getNextInstructions(slideNum, expStage){
/* use the following options when modifying text appearance
    -  iterateAgain = true;
    -  changeTextFormat('#instructions' + slideNum,'font-weight','bold');
    -  changeTextFormat('#instructions' + slideNum,'font-size','60px');
    -  changeTextFormat('#instructions' + slideNum,'color','red');
    -  changeTextFormat('#instructions' + slideNum,'margin-top', '20px');
    -  changeTextFormat('#instructions' + slideNum,'margin-bottom', '20px');
    - $("<img src='../pics/finalpics/M33.jpg' class='insertedImage'>").insertAfter( "#instructions" + slideNum);
*/
  switch (expStage){
    case "prac1-1":
      switch (slideNum){
        case 1:
          $( getImageText(instructionImages[6]) ).insertBefore( "#instructions" + slideNum);
          return "In this task, you will see a number (1-9 excluding 5) appear in the middle of the screen.";
        case 2:
          return "Press '" + getLetter(getHand(1),1) + "' with your " + getHand(1) + " hand " + getFinger(getHand(1),1) + " finger if the number is " + getTaskInstruction(getHand(1),1) + ".";
        case 3:
          return "Press '" + getLetter(getHand(1),2) + "' with your " + getHand(1) + " hand " + getFinger(getHand(1),2) + " finger if the number is " + getTaskInstruction(getHand(1),2) + ".";
      }
    case "prac1-2":
      switch (slideNum){
        case 1:
          $( getImageText(instructionImages[5]) ).insertBefore( "#instructions" + slideNum);
          return "There will be 2 numbers on either side of the center number. These numbers will either be the same or different than the target number.";
        case 2:
          return "Do not respond to these numbers. You should only respond with respect to the target number.";
        case 3:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "It is important that you respond as quickly and as accurately as possible.";
      }
    case "prac1-3":
      task = 1;
      switch (slideNum){
        case 1:
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen. You must get at least " + practiceAccCutoff + "% correct in order to move on to the next practice block.";
        case 2:
          return "Remember, press '" + getLetter(getHand(1),1) + "' with your " + getHand(1) + " hand " + getFinger(getHand(1),1) + " finger if the number is " + getTaskInstruction(getHand(1),1) + " and '" + getLetter(getHand(1),2) + "' with your " + getHand(1) + " hand " + getFinger(getHand(1),2) + " finger if the number is " + getTaskInstruction(getHand(1),2) + "."
        case 3:
          iterateAgain = true;
          $( getImageText(instructionImages[getHandImageNum(1)]) ).insertAfter( "#instructions" + slideNum);
          return "This block contains "+numPracticeTrials+" trials. Please place your " + getHand(task) + " hand on the '" + getLetter(getHand(task),1) + "' and '" + getLetter(getHand(task),2) + "' keys as shown.";
        case 4:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button begin."
      }
    case "prac2":
      task = 2;
      switch (slideNum){
        case 1:
          return "In this next block, you will again see a number (1-9 excluding 5) appear in the middle of the screen.";
        case 2:
          return "Press '" + getLetter(getHand(task),1) + "' with your " + getHand(task) + " hand " + getFinger(getHand(task),1) + " finger if the number is " + getTaskInstruction(getHand(task),1) + ".";
        case 3:
          return "Press '" + getLetter(getHand(task),2) + "' with your " + getHand(task) + " hand " + getFinger(getHand(task),2) + " finger if the number is " + getTaskInstruction( getHand(task),2) + ".";
        case 4:
          return "Remember to only respond to the center number and to respond as quickly and as accurately as possible. You must get at least " + practiceAccCutoff + "% correct in order to move on to the next section.";
        case 5:
          iterateAgain = true;
          $( getImageText(instructionImages[getHandImageNum(2)]) ).insertAfter( "#instructions" + slideNum);
          return "This block contains "+numPracticeTrials+" trials. Please place your " + getHand(task) + " hand on the '" + getLetter(getHand(task),1) + "' and '" + getLetter(getHand(task),2) + "' keys as shown.";
        case 6:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button begin."
      }
    case "prac3":
      switch (slideNum){
        case 1:
          return "In the final practice block, you will indicate if the number is greater or less than 5 OR odd or even, depending on the prompt that precedes the numbers.";
        case 2:
          task = 1;
          return "If the prompt says '" + getFirstCue() + "', indicate if the number is " + getTaskInstruction(getHand(task),1) + " ('" + getLetter(getHand(task),1) + "' with " + getHand(task) + " hand " + getFinger(getHand(task),1) + " finger) or " + getTaskInstruction(getHand(task),2) + " ('" + getLetter(getHand(task),2) + "' with " + getHand(task) + " hand " + getFinger(getHand(task),2) + " finger).";
        case 3:
          task = 2;
          return "If the prompt says '" + getSecondCue() + "', indicate if the number is " + getTaskInstruction(getHand(task),1) + " ('" + getLetter(getHand(task),1) + "' with " + getHand(task) + " hand " + getFinger(getHand(task),1) + " finger) or " + getTaskInstruction(getHand(task),2) + " ('" + getLetter(getHand(task),2) + "' with " + getHand(task) + " hand " + getFinger(getHand(task),2) + " finger).";
        case 4:
          return "Remember to only respond to the center number and to respond as quickly and as accurately as possible. You must get at least " + practiceAccCutoff + "% correct in order to move on to the main task.";
        case 5:
          iterateAgain = true;
          $( getImageText(instructionImages[2]) ).insertAfter( "#instructions" + slideNum);
          return "This block contains "+numPracticeTrials+" trials. Please place your hands on the 'Z' and 'X' keys and 'N' and 'M' keys as shown.";
        case 6:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button begin."
      }
    case "main1":
      switch (slideNum){
        case 1:
          return "Great job! You are now ready to begin the main experiment.";
        case 2:
          return "In this task, participants often struggle with:";
        case 3:
          iterateAgain = true;
          return "1) Switching between the two tasks, and";
        case 4:
          return "2) Ignoring the distractor numbers.";
        case 5:
          return "As you complete the experiment, try your best to avoid distraction from the side numbers and switch well between the two tasks. We will let you know how you are doing compared to previous participants.";
        }
      case "main2":
        switch (slideNum){
          case 1:
            return "This feedback is based on both your accuracy and reaction time during the task. Remember to respond as quickly and as accuractely as possible.";
          case 2:
            return "Please note that you are not required to perform as well as or better than previous participants, and you will be compensated no matter how well you perform relative to other participants.";
          case 3:
            return "However, we do ask that you get > 75% correct over the course of the experiment. Performing worse may impact whether you are compensated.";
        }
      case "main3":
        switch (slideNum){
          case 1:
            return "Remember, respond greater/less than 5 or odd/even based on the color of the stimuli."
          case 2:
            task = 1;
            return "If the prompt says '" + getFirstCue() + "', indicate if the number is " + getTaskInstruction(getHand(task),1) + " ('" + getLetter(getHand(task),1) + "' with " + getHand(task) + " hand " + getFinger(getHand(task),1) + " finger) or " + getTaskInstruction(getHand(task),2) + " ('" + getLetter(getHand(task),2) + "' with " + getHand(task) + " hand " + getFinger(getHand(task),2) + " finger).";
          case 3:
            task = 2;
            return "If the prompt says '" + getSecondCue() + "', indicate if the number is " + getTaskInstruction(getHand(task),1) + " ('" + getLetter(getHand(task),1) + "' with " + getHand(task) + " hand " + getFinger(getHand(task),1) + " finger) or " + getTaskInstruction(getHand(task),2) + " ('" + getLetter(getHand(task),2) + "' with " + getHand(task) + " hand " + getFinger(getHand(task),2) + " finger).";
          case 4:
            return "The experiment will consist of " + numBlocks +" blocks of " + trialsPerBlock + " trials each. You will have a short rest break between each block, and you will receive feedback about your performance during these breaks.";
          case 5:
            iterateAgain = true;
            $( getImageText(instructionImages[2]) ).insertAfter( "#instructions" + slideNum);
            return "Please place your right hand on the 'N' and 'M' keys and left hand on the 'Z' and 'X' keys as shown.";
          case 6:
            changeTextFormat('#instructions' + slideNum,'font-weight','bold');
            return "Press any button begin."
      }
  }
}

function runInstructions(){
  // main instruction function (come here at start of instruction block)
  sectionStart = new Date().getTime() - runStart;
  sectionType = "instructions";

  // hide/clear everything, just in case
  hideInstructions();

  // hide canvas if visible
  canvas.style.display = "none";

  // if need to repeat instructions (e.g., participant failed to meet accuracy requirement), then reshow all instructions
  if (instructions["iterator"][expStage] >= instructions["max"][expStage]){

    // loop through instructions and show
    for (var i = 1; i <= instructions["max"][expStage]; i++) {
      $('#instructions' + i).text( getNextInstructions( i, expStage ));
    }

    // reset iterateAgain incase looping turned it on by accident
    iterateAgain = false;

    // display instructions and prepare exit response mapping
    $('.instructions').show();
    exitResponse();

  } else {

    // remove any previous click listeners, if any
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");
    $(document).off("click","#nextSectionButton");

    // clear all previous instructions, reset styles, and remove pictures
    for (let i = 1; i <= 8; i++) {
      $('#instructions' + i).text("");
      resetDefaultStyles('#instructions' + i);
      $('.insertedImage').remove();
    }

    // display proper instruction components, in case they are hidden
    $('.instructions').show();
    $('#nextInstrButton').show();
    $('#nextSectionButton').hide();
    $('#startExpButton').hide();
    displayDefaults(expStage);
  }

  /* code for "Next" button click during instruction display
        if running from Atom, need to use $(document).on, if through Duke Public Home Directory, either works.
        https://stackoverflow.com/questions/19237235/jquery-button-click-event-not-firing
  */
  $(document).on("click", "#nextInstrButton", function(){
  // $("#nextInstrButton").on('click', function(){
    iterateInstruction();
  });

  // code for click startExperiment button
  $(document).on('click', '#startExpButton', function(){
    $('.instructions').hide();
    $('#startExpButton').hide();
    $('.insertedImage').remove();

    // log data for time spent on this section
    sectionEnd = new Date().getTime() - runStart;
    data.push([expStage, sectionType, block, blockType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
    console.log(data);

    // clear all button press listeners
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");
    $(document).off("click","#nextSectionButton");
    runTasks();
  });

  $(document).on('click', '#nextSectionButton', function(){
    // log data for time spent on this section
    sectionEnd = new Date().getTime() - runStart;
    data.push([expStage, sectionType, block, blockType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
    console.log(data);

    // clear all button press listeners
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");
    $(document).off("click","#nextSectionButton");
    navigateInstructionPath();
  });
};

function iterateInstruction(){
  let instrNum = instructions["iterator"][expStage];
  $('#instructions' + instrNum).text( getNextInstructions( instrNum, expStage));

  // iterate as appropriate or allow next phase
  if (instrNum < instructions["max"][expStage]){
    instructions["iterator"][expStage]++;
  } else{
    exitResponse();
  }

  if (iterateAgain == true) {
    iterateAgain = false;
    iterateInstruction();
  }
}

function exitResponse(){
  $('#nextInstrButton').hide();
  if (instructions["exitResponse"][expStage] == "#startExpButton"){
    $('#startExpButton').show();
  } else if (instructions["exitResponse"][expStage] == "#nextSectionButton") {
    $('#nextSectionButton').show();
  } else if (instructions["exitResponse"][expStage] == "buttonPressStartTask"){
    expType = 8;
  } else if (instructions["exitResponse"][expStage] == "buttonPressNextSection"){
    expType = 9;
  }
}

function displayDefaults(stage){
  // default values of instruction blocks. add any special cases
  switch(stage){
    case "prac1-2":
    case "prac1-3":
      showFirst();
    case "prac1-1":
      $('.instruction-header').show();
      break;
    default:
      showFirst();
      $('.instruction-header').hide();
      break;
  }
}

function getImageText(imageURL){
  return "<img src='" + imageURL + "' class='insertedImage'>";
}

function showFirst() {
  iterateInstruction();
}

function changeTextFormat(elementName, property ,changeTo){
  $(elementName).css( property , changeTo );
}

function hideInstructions(){
  // remove any previous click listeners, if any
  $(document).off("click","#nextInstrButton");
  $(document).off("click","#startExpButton");
  $(document).off("click","#nextSectionButton");

  // hide instruction DOMs
  $('.instructions').hide();
  $('#startExpButton').hide();
  $('#nextSectionButton').hide();

  // clear text from instruction DOMs
  for (let i = 1; i <= 8; i++) {
    $('#instructions' + i).text("");
    resetDefaultStyles('#instructions' + i);
    $('.insertedImage').remove();
  }
}

function resetDefaultStyles(domObject){
  $(domObject).css('font-weight','');
  $(domObject).css('font-size','');
  $(domObject).css('color','');
  $(domObject).css('margin-top','');
  $(domObject).css('margin-bottom','');
}
