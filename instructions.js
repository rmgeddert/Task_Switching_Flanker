// see function navigateInstructionPath() in tasks.js for naviagtion code

// global instruction iterator information. Change as needed
let instructions = {
  iterator: {
    prac1: 1, prac2: 1, prac3: 1, main1: 1, main2: 1, main3: 1
  },
  max: {
    prac1: 8, prac2: 5, prac3: 7, main1: 6, main2: 4, main3: 6
  },
  exitResponse: {
    prac1: '#startExpButton', prac2: '#startExpButton', prac3: '#startExpButton',
    main1: 'buttonPress', main2: 'buttonPress', main3: '#startExpButton'
  }
};
let iterateAgain = false;

function displayDefaults(stage){
  switch(stage){
    case "prac1":
    case "prac2":
    case "prac3":
      $('#instructionHeader').show();
      $('#instructions0').show();
      break;
    case "main1":
    case "main2":
    case "main3":
    default:
      showFirst();
      $('#instructionHeader').hide();
      $('#instructions0').hide();
      break;
  }
}

// main instruction function (come here at start of practice block)
function runInstructions(){

  // hide canvas
  canvas.style.display = "none";

  if (instructions["iterator"][expStage] == instructions["max"][expStage]){
    // if we've already been through all this before for this practice run but need to repeat (participant failed to meet accuracy requirement), then reshow all instructions
    for (var i = 1; i <= instructions["max"][expStage]; i++) {
      $('#instructions' + i).text( getNextInstructions( i, expStage ));
    }

    $('#instructions').show();
    $('#nextInstrButton').hide();
    $('#startExpButton').show();
  } else{

    // remove any previous click listeners, if any
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");

    // clear all previous instructions, if any, and reset formats
    for (let i = 1; i <= 8; i++) {
      $('#instructions' + i).text("");
      // $('#instructions' + i).css("font-weight","normal");
      // $('#instructions' + i).css("font-size","22px");
      // $('#instructions' + i).css("color","black");
    }

    // show instructions and next button, in case they are hidden
    $('#instructions').show();
    $('#nextInstrButton').show();
    $('#startExpButton').hide();
    displayDefaults(expStage);

    // change default format for this for this instruction segment
    formatInstructions(expStage);

    // code for "Next" button click during instruction display
    // if running from Atom, need to use $(document).on, if through Duke Public Home Directory, either works.
    // https://stackoverflow.com/questions/19237235/jquery-button-click-event-not-firing
    $(document).on("click", "#nextInstrButton", function(){
    // $("#nextInstrButton").on('click', function(){
      iterateInstruction();
    });

    // code for click startExperiment button
    $(document).on('click', '#startExpButton', function(){
      $('#instructions').hide();
      $('#startExpButton').hide();
      runTasks();
    });
  };
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
    case "prac1":
      switch (slideNum){
        case 1:
          return "In this task, you will see a number (1-9 excluding 5) appear in the middle of the screen.";
        case 2:
          return "Press 'N' with your right hand index finger if the number is GREATER than 5.";
        case 3:
          return "Press 'M' with your right hand middle finger if the number is LESS than 5.";
        case 4:
          return "Additionally, there will be 2 numbers on either side of the center number. These numbers will either be the same or different than the middle number.";
        case 5:
          return "Do not respond to these numbers. You should only respond with respect to the middle number.";
        case 6:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "It is important that you respond as quickly and as accurately as possible.";
        case 7:
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen. You must get at least " + practiceAccCutoff + "% correct in order to move onto the next task.";
        case 8:
          $("<img src='"+instructionImages[4]+"'>").insertAfter( "#instructions" + slideNum);
          return "This block contains 12 trials. Press 'Start Experiment' to begin, then place your right hand on the 'N' and 'M' keys.";
      }
    case "prac2":
      switch (slideNum){
        case 1:
          return "In this block, you will again see a number (1-9 excluding 5), but now you will indicate if the number is ODD or EVEN.";
        case 2:
          return "Press 'Z' with your left hand middle finger if the number is ODD.";
        case 3:
          return "Press 'X' with your left hand index finger if the number is EVEN.";
        case 4:
          return "Remember to only respond to the center number, not the numbers on either side of it, and to respond as quickly and as accurately as possible. You must get at least " + practiceAccCutoff + "% correct in order to move onto the next task.";
        case 5:
          return "This block contains 12 trials. Press 'Start Experiment' to begin, then place your left hand on the 'Z' and 'X' keys.";
      }
    case "prac3":
      switch (slideNum){
        case 1:
          return "In the final practice block, you will again see a number (1-9 excluding 5), but now you will either make a GREATER/LESS THAN or a ODD/EVEN decision, depending on the color of the text.";
        case 2:
          iterateAgain = true;
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          changeTextFormat('#instructions' + slideNum,'color','red');
          changeTextFormat('#instructions' + slideNum,'margin-top', '20px');
          changeTextFormat('#instructions' + slideNum,'margin-bottom', '20px');
          changeTextFormat('#instructions' + slideNum,'font-size','60px');
          return "33633";
        case 3:
          return "If the numbers are RED, indicate if the number is GREATER ('N' with right index finger) or LESS ('M' with right middle finger) than 5.";
        case 4:
          iterateAgain = true;
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          changeTextFormat('#instructions' + slideNum,'color','blue');
          changeTextFormat('#instructions' + slideNum,'margin-top', '20px');
          changeTextFormat('#instructions' + slideNum,'margin-bottom', '20px');
          changeTextFormat('#instructions' + slideNum,'font-size','60px');
          return "88388";
        case 5:
          return "If the numbers are BLUE, indicate if the number is ODD ('Z' with left middle finger) or EVEN ('X' with left index finger).";
        case 6:
          return "Remember to only respond to the center number, not the numbers on either side of it, and to respond as quickly and as accurately as possible. You must get at least " + practiceAccCutoff + "% correct in order to move onto the next task.";
        case 7:
          $("<img src='" + instructionImages[1] + "' width='500px'>").insertAfter( "#instructions" + slideNum);
          return "This block contains 24 trials. Press 'Start Experiment' to begin, then place your right hand on the 'N' and 'M' keys and left hand on the 'Z' and 'X' keys.";
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
          iterateAgain = true;
          return "As you complete the experiment, try your best to avoid distraction from the side numbers and switch well between the two tasks. We will let you know how you are doing compared to previous participants.";
        case 6:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to continue";
        }
      case "main2":
        switch (slideNum){
          case 1:
            return "This feedback is based on both your accuracy and reaction time during the task. Remember to respond as quickly and as accuractely as possible.";
          case 2:
            return "Please note that you are not required to perform as well as or better than previous participants, and you will be compensated no matter how well you perform relative to other participants.";
          case 3:
            iterateAgain = true;
            return "However, we do ask that you get > 75% correct over the course of the experiment. Performing worse may impact whether you are compensated.";
          case 4:
            changeTextFormat('#instructions' + slideNum,'font-weight','bold');
            return "Press any button to continue";
        }
      case "main3":
        switch (slideNum){
          case 1:
            return "Remember, respond greater/less than 5 or odd/even based on the color of the stimuli."
          case 2:
            iterateAgain = true;
            changeTextFormat('#instructions' + slideNum,'font-weight','bold');
            changeTextFormat('#instructions' + slideNum,'color','red');
            changeTextFormat('#instructions' + slideNum,'margin-top', '20px');
            changeTextFormat('#instructions' + slideNum,'margin-bottom', '20px');
            changeTextFormat('#instructions' + slideNum,'font-size','60px');
            return "33633";
          case 3:
            return "If the number is red, indicate if it is greater or less than 5 using the 'N' and 'M' keys.";
            break;
          case 4:
            iterateAgain = true;
            changeTextFormat('#instructions' + slideNum,'font-weight','bold');
            changeTextFormat('#instructions' + slideNum,'color','blue');
            changeTextFormat('#instructions' + slideNum,'margin-top', '20px');
            changeTextFormat('#instructions' + slideNum,'margin-bottom', '20px');
            changeTextFormat('#instructions' + slideNum,'font-size','60px');
            return "88388";
          case 5:
            return "If the number is blue, indicate if it is odd or even using the 'Z' and 'X' keys.";
          case 6:
            return "The experiment will consist of " + numBlocks +" blocks of " + trialsPerBlock + " trials each. You will have a short rest break between each block, and you will receive feedback about your performance during these breaks.";
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
    $('#nextInstrButton').hide();
    if (instructions["exitResponse"][expStage] == "#startExpButton"){
      $('#startExpButton').show();
    } else {
      expType = 8;
    }
  }

  if (iterateAgain == true) {
    iterateAgain = false;
    iterateInstruction();
  }
}

function showFirst() {
  iterateInstruction();
}

function clearInstructions(){
  $('#instructions').hide();
  $('#startExpButton').hide();
  for (let i = 1; i <= 8; i++) {
    $('#instructions' + i).text("");
  }
}

function changeTextFormat(elementName, property ,changeTo){
  $(elementName).css( property , changeTo );
}

function formatInstructions(){
  switch (expStage){
    case 'main1':
    case 'main2':
    case 'main3':
      $('.instructions').css('text-align','center');
      break;
    default:
      $('.instructions').css('text-align','center');
      break;
  }
}
