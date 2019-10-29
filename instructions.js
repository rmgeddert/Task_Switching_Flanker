// declare global variables
let instrNum = {
  "1": 1,
  "2": 1,
  "3": 1
};
let instrNumMax = 8;

// main instruction function (come here at start of practice block)
function runInstructions(practiceBlockNum){
  if (instrNum[practiceBlockNum] == instrNumMax){
    // if we've already been through all this before for this practice run but need to repeat (participant failed to meet accuracy requirement), then reshow all instructions (should still be correct from last time).
    $('#instructions').show();
    $('#nextInstrButton').hide();
    $('#startExpButton').show();

  } else{

    // clear all previous instructions, if any
    let i;
    for (i = 1; i <= instrNumMax; i++) {
      $('#instructions' + i).text("");
    }

    // show instructions and next button, in case they are hidden
    $('#instructions').show();
    $('#nextInstrButton').show();

    // code for "Next" button click during instruction display
    // if running from Atom, need to use $(document).on, if through Duke Public Home Directory, either works.
    // https://stackoverflow.com/questions/19237235/jquery-button-click-event-not-firing
    $(document).on("click", "#nextInstrButton", function(){
      // $("#nextInstrButton").on('click', function(){
      if (instrNum[practiceBlockNum] < instrNumMax){
        $('#instructions' + instrNum[practiceBlockNum]).text( getNextInstructions( instrNum[practiceBlockNum], practiceBlockNum));
        instrNum[practiceBlockNum]++;
      } else{
        $('#instructions' + instrNum[practiceBlockNum]).text(  getNextInstructions(instrNum[practiceBlockNum], practiceBlockNum));
        $('#nextInstrButton').hide();
        $('#startExpButton').show();
      };
    });

    // code for click startExperiment button
    $(document).on('click', '#startExpButton', function(){
      $('#instructions').hide();
      $('#startExpButton').hide();
      $(document).off("click","#nextInstrButton");
      $(document).off("click","#startExpButton");
      runPractice(practiceBlockNum);
    });
  };
};

function getNextInstructions(slideNum, practiceBlockNum){
  switch (practiceBlockNum){
    case "1":
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
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen. You must get above 80% on the practice task in order to move onto the next task.";
          break;
        case 8:
          return "This block contains 10 trials. Press 'Start Experiment' to begin, then place your right hand on the 'N' and 'M' keys.";
          break;
      }
    case "2":
      switch (slideNum){
        case 1:
          return "Great job! In this block, you will again see a number (1-9 excluding 5), but now you will indicate if the number is ODD or EVEN.";
          break;
        case 2:
          return "Press 'Z' with your left hand middle finger if the number is ODD.";
          break;
        case 3:
          return "Press 'X' with your left hand index finger if the number is EVEN.";
          break;
        case 4:
          return "Additionally, there will be 2 numbers on either side of the center number. These numbers will either be the same or different than the middle number.";
          break;
        case 5:
          return "Do not respond to these numbers. You should only respond with respect to the middle number.";
          break;
        case 6:
          return "Again, it is important that you respond as quickly and as accurately as possible.";
          break;
        case 7:
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen. You must get above 80% on the practice task in order to move onto the next task.";
          break;
        case 8:
          return "This block contains 10 trials. Press 'Start Experiment' to begin, then place your left hand on the 'Z' and 'X' keys.";
          break;
      }
    case "3":
      switch (slideNum){
        case 1:
          return "Great job! In the final block, you will again see a number (1-9 excluding 5), but now you will either make a GREATER/LESS THAN or a ODD/EVEN decision, depending on the color of the box.";
          break;
        case 2:
          return "If the border is RED, indicate if the number is GREATER ('N' with right index finger) or LESS ('M' with right middle finger) than 5.";
          break;
        case 3:
          return "If the border is BLUE, indicate if the number is ODD ('Z' with left middle finger) or EVEN ('X' with left index finger).";
          break;
        case 4:
          return "There will again be 2 numbers on either side of the center number. These numbers will either be the same or different than the middle number.";
          break;
        case 5:
          return "Do not respond to these numbers. You should only respond with respect to the middle number, based on if the border is RED (greater/less than 5) or BLUE (odd/even).";
          break;
        case 6:
          return "It is important that you respond as quickly and as accurately as possible.";
          break;
        case 7:
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen. You must get above 80% on the practice task in order to move onto the next task.";
          break;
        case 8:
          return "You will start with a practice block of 20 trials. Press 'Start Experiment' to begin, then place your right hand on the 'N' and 'M' keys and left hand on the 'Z' and 'X' keys.";
          break;
      }
  }
};
