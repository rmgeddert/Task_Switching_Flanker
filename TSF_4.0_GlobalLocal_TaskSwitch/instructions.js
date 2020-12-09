// see function navigateInstructionPath() in tasks.js for naviagtion code

// global instruction iterator information. Change as needed
let instructions = {
  // contains the interator for each instruction block
  iterator: {
    "prac1-1": 1, "prac1-2": 1, "prac2": 1, "prac3": 1, "main1": 1, "main2": 1
  },
  // contains the max value of each instruction iteration. iteration will STOP at max.
  max: {
    "prac1-1": 4, "prac1-2": 5, "prac2": 5, "prac3": 5, "main1": 4, "main2": 4
  },
  // what does instruction section end with?
  // #nextSectionButton, #startExpButton, buttonPressNextSection, buttonPressStartTask
  exitResponse: {
    "prac1-1": '#nextSectionButton',
    "prac1-2": 'buttonPressStartTask',
    "prac2": 'buttonPressStartTask',
    "prac3": 'buttonPressStartTask',
    "main1": '#nextSectionButton',
    "main2": 'buttonPressStartTask'
  }
};
let iterateAgain = false, task;

function navigateInstructionPath(repeat = false){
  if (repeat == true) {
    // if multi stage instructions, ensures it goes back to first not second
    switch (expStage){
      case "prac1-1":
      case "prac1-2":
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
    }
    runInstructions();
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

    console.log("button click");
    // log data for time spent on this section
    sectionEnd = new Date().getTime() - runStart;
    data.push([expStage, sectionType, block, blockType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
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
    data.push([expStage, sectionType, block, blockType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
    console.log(data);

    // clear all button press listeners
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");
    $(document).off("click","#nextSectionButton");
    navigateInstructionPath();
  });
};

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
          $( getImageText(instructionImages[2]) ).insertAfter( "#instructions" + slideNum);
          return "In this task, you will see many small 'S' or 'H' letters, arranged in the shape of either a large 'S' or a large 'H'.";
        case 2:
          return "Sometimes you will need to indicate whether the small letters are an 'S' or an 'H' and sometimes you will need to indicate whether the large shape is an 'S' or an 'H'.";
        case 3:
          return "On each trial, a colored rectangle surrounding the letters will tell you whether to classify the small letters or the large shape.";
        case 4:
          return "You will begin with a few practice sections to familiarize you with the task before beginning the main experiment. You will need to get at least " + practiceAccCutoff + "% correct on each practice section before you can move on to the next one.";
      }
    case "prac1-2":
      switch (slideNum){
        case 1:
          $( getImageText(instructionImages[get_task_image(1)]) ).insertAfter( "#instructions" + slideNum);
          return "In the first practice task, you will indicate whether the " + first_task_target() + " an 'S' or an 'H'.";
        case 2:
          return "Press " + key_S + " with your " + finger_S + " hand index finger if the " + first_task_target() + " an 'S'.";
        case 3:
          return "Press " + key_H + " with your " + finger_H + " hand index finger if the " + first_task_target() + " an 'H'.";
        case 4:
          $( getImageText(instructionImages[1]) ).insertAfter( "#instructions" + slideNum);
          iterateAgain = true;
          return "This block contains " + numPracticeTrials + " trials. Please place your hands on the '1' and '0' keys as shown.";
        case 5:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin.";
      }
    case "prac2":
      task = 2;
      switch (slideNum){
        case 1:
          $( getImageText(instructionImages[get_task_image(2)]) ).insertAfter( "#instructions" + slideNum);
          return "In the next practice task, you will indicate whether the " + second_task_target() + " an 'S' or an 'H'.";
        case 2:
          return "Press " + key_S + " with your " + finger_S + " hand index finger if the " + second_task_target() + " an 'S'.";
        case 3:
          return "Press " + key_H + " with your " + finger_H + " hand index finger if the " + second_task_target() + " an 'H'.";
        case 4:
          $( getImageText(instructionImages[1]) ).insertAfter( "#instructions" + slideNum);
          iterateAgain = true;
          return "This block contains " + numPracticeTrials + " trials. Please place your hands on the '1' and '0' keys as shown.";
        case 5:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin.";
      }
    case "prac3":
      switch (slideNum){
        case 1:
          return "In this last practice task, you will need to indicate whether the small letters or the big shape are an 'S' or an 'H', depending on the color of the rectangle around the letters.";
        case 2:
          $( getImageText(instructionImages[get_task_image(1)]) ).insertAfter( "#instructions" + slideNum);
          return "If the rectangle is " + colorFirstTask() + ", indicate if the " + first_task_target() + " an 'S' (" + key_S + " with " + finger_S + " hand index finger) or an 'H' (" + key_H + " with " + finger_H + " hand index finger).";
        case 3:
          $( getImageText(instructionImages[get_task_image(2)]) ).insertAfter( "#instructions" + slideNum);
          return "If the rectangle is " + colorSecondTask() + ", indicate if the " + second_task_target() + " an 'S' (" + key_S + " with " + finger_S + " hand index finger) or an 'H' (" + key_H + " with " + finger_H + " hand index finger).";
        case 4:
          iterateAgain = true;
          $( getImageText(instructionImages[1]) ).insertAfter( "#instructions" + slideNum);
          return "This block contains "+numPracticeTrials+" trials. Please place your hands on the '1' and '0' keys as shown.";
        case 5:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin.";
      }
    case "main1":
      switch (slideNum){
        case 1:
          return "Great job! You are now ready to begin the main experiment.";
        case 2:
          return "We ask that you get > 75% correct over the course of the experiment. Performing worse may impact whether you are compensated.";
        case 3:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Remember to respond as quickly and as accuractely as possible on each trial.";
        case 4:
          return "This experiment consists of 4 section, with each section lasting about 3 to 4 minutes.";
      }
    case "main2":
      switch (slideNum){
        case 1:
          $( getImageText(instructionImages[get_task_image(1)]) ).insertAfter( "#instructions" + slideNum);
          return "Remember, if the rectangle is " + colorFirstTask() + ", indicate if the " + first_task_target() + " an 'S' (" + key_S + " with " + finger_S + " hand index finger) or an 'H' (" + key_H + " with " + finger_H + " hand index finger).";
        case 2:
          $( getImageText(instructionImages[get_task_image(2)]) ).insertAfter( "#instructions" + slideNum);
          return "If the rectangle is " + colorSecondTask() + ", indicate if the " + second_task_target() + " an 'S' (" + key_S + " with " + finger_S + " hand index finger) or an 'H' (" + key_H + " with " + finger_H + " hand index finger).";
        case 3:
          iterateAgain = true;
          $( getImageText(instructionImages[1]) ).insertAfter( "#instructions" + slideNum);
          return "Please place your hands on the '1' and '0' keys as shown.";
        case 4:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin.";
      }
  }
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
    // case "prac1-2":
    // case "prac1-3":
    //   showFirst();
    default:
      showFirst();
      $('.instruction-header').show();
      break;
  }
}

function getImageText(imageURL){
  let fileName = getFileName(imageURL);
  return "<img src='" + imageURL + "' class='insertedImage' id='"+ fileName +"'>";
}

function getFileName(path){
  let n = path.lastIndexOf('/');
  return path.substring(n + 1);
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
