// global instruction iterator information. Change as needed
let instructions = {
  iterator: {
    prac1: 1,
    prac2: 1,
    prac3: 1,
    main: 1
  },
  max: {
    prac1: 8,
    prac2: 5,
    prac3: 5,
    main: 5
  }
};

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

    // clear all previous instructions, if any
    for (let i = 1; i <= 8; i++) {
      $('#instructions' + i).text("");
    }

    // show instructions and next button, in case they are hidden
    $('#instructions').show();
    $('#nextInstrButton').show();

    // remove any previous event listeners
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");

    // code for "Next" button click during instruction display
    // if running from Atom, need to use $(document).on, if through Duke Public Home Directory, either works.
    // https://stackoverflow.com/questions/19237235/jquery-button-click-event-not-firing
    $(document).on("click", "#nextInstrButton", function(){
    // $("#nextInstrButton").on('click', function(){
      let instrNum = instructions["iterator"][expStage];
      if (instrNum < instructions["max"][expStage]){
        $('#instructions' + instrNum).text( getNextInstructions( instrNum, expStage));
        instructions["iterator"][expStage]++;
      } else{
        $('#instructions' + instrNum).text( getNextInstructions(instrNum, expStage));
        $('#nextInstrButton').hide();
        $('#startExpButton').show();
      };
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
  switch (expStage){
    case "prac1":
      switch (slideNum){
        case 1:
          return "In this task, you will see a number (1-9 excluding 5) appear in the middle of the screen.";
          break;
        case 2:
          return "Press 'N' with your right hand index finger if the number is GREATER than 5.";
          break;
        case 3:
          return "Press 'M' with your right hand middle finger if the number is LESS than 5.";
          break;
        case 4:
          return "Additionally, there will be 2 numbers on either side of the center number. These numbers will either be the same or different than the middle number.";
          break;
        case 5:
          return "Do not respond to these numbers. You should only respond with respect to the middle number.";
          break;
        case 6:
          return "It is important that you respond as quickly and as accurately as possible.";
          break;
        case 7:
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen. You must get above " + practiceAccCutoff + "% on the practice task in order to move onto the next task.";
          break;
        case 8:
          return "This block contains 10 trials. Press 'Start Experiment' to begin, then place your right hand on the 'N' and 'M' keys.";
          break;
      }
    case "prac2":
      switch (slideNum){
        case 1:
          return "In this block, you will again see a number (1-9 excluding 5), but now you will indicate if the number is ODD or EVEN.";
          break;
        case 2:
          return "Press 'Z' with your left hand middle finger if the number is ODD.";
          break;
        case 3:
          return "Press 'X' with your left hand index finger if the number is EVEN.";
          break;
        case 4:
          return "Remember to only respond to the center number, not the numbers on either side of it, and to respond as quickly and as accurately as possible. You must get above " + practiceAccCutoff + "% on the practice task in order to move onto the next task.";
          break;
        case 5:
          return "This block contains 12 trials. Press 'Start Experiment' to begin, then place your left hand on the 'Z' and 'X' keys.";
          break;
        default:
          return "";
          break;
      }
    case "prac3":
      switch (slideNum){
        case 1:
          return "In the final block, you will again see a number (1-9 excluding 5), but now you will either make a GREATER/LESS THAN or a ODD/EVEN decision, depending on the color of the text.";
          break;
        case 2:
          return "If the numbers are RED, indicate if the number is GREATER ('N' with right index finger) or LESS ('M' with right middle finger) than 5.";
          break;
        case 3:
          return "If the numbers are BLUE, indicate if the number is ODD ('Z' with left middle finger) or EVEN ('X' with left index finger).";
          break;
        case 4:
          return "Remember to only respond to the center number, not the numbers on either side of it, and to respond as quickly and as accurately as possible. You must get above " + practiceAccCutoff + "% on the practice task in order to move onto the next task.";
          break;
        case 5:
          return "This block contains 24 trials. Press 'Start Experiment' to begin, then place your right hand on the 'N' and 'M' keys and left hand on the 'Z' and 'X' keys.";
          break;
        default:
          return "";
          break;
      }
      case "main":
        switch (slideNum){
          case 1:
            return "Great job! You are now ready to begin the main experiment.";
            break;
          case 2:
            return "Remember, if the numbers are red, indicate if the center number is greater or less than 5 using the 'N' and 'M' keys with your right hand.";
            break;
          case 3:
            return "If the numbers are blue, indicate if the center number is odd or even using the 'Z' and 'X' keys with your left hand.";
            break;
          case 4:
            return "As always, remember to only respond to the center number, not the numbers on either side of it, and to respond as quickly and as accurately as possible.";
            break;
          case 5:
            return "The experiment will consist of " + numBlocks +" blocks of " + trialsPerBlock + " trials each. You will have a short rest break between each block, and you will receive feedback about your performance during these breaks.";
            break;
          case 6:
            return "You must receive get at least 80% of trials correctly in order to be compensated.";
            break;
          case 7:
            return "";
            break;
          case 8:
            return "";
            break;
        }
  }
};

function clearInstructions(){
  $('#instructions').hide();
  $('#startExpButton').hide();
  for (let i = 1; i <= 8; i++) {
    $('#instructions' + i).text("");
  }
}
