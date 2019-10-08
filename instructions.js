// initiate variables
let instrNum = 1; instrNumMax = 8

// show instructions to participant (one at a time)
function showInstructions(){
  if (instrNum == instrNumMax){
    $('#instructions').show();
    $('#nextInstrButton').hide();
    $('#startExpButton').show();
  };

  function addInstructions(slideNum){
    switch(slideNum){
      case 1:
        return "In this task, you will see a number (1-9 excluding 5) appear in the middle of the screen.";
        break;
      case 2:
        return "Before each trial, a cue will appear telling you what to do on the next task.";
        break;
      case 3:
        return "If you see 'Larger/Smaller', then when you see the number, indicate if it is larger or smaller than five (5) using the 'N' and 'M' keys. Use your RIGHT hand index and middle finger to respond.";
        break;
      case 4:
        return "If you see 'Odd/Even', then when you see the number, indicate if it is odd or even using the 'Z' and 'X' keys. Use your LEFT hand index and middle finger to respond.";
        break;
      case 5:
        return "Additionally, there will be two (2) numbers on the left and two (2) numbers on the right of the center number. Try to ignore these; you should only respond with respect to the middle number.";
        break;
      case 6:
        return "It is important that you respond as quickly and as accurately as possible.";
        break;
      case 7:
        return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen. You must get above 80% on the practice task in order to move onto the main task.";
        break;
      case 8:
        return "You will start with a practice block of 20 trials. Press 'Start Experiment' to begin.";
        break;
    };
  };

  // when running from Atom, need to use $(document).on, when running via the Duke Public Home Directory, either seems fine. See https://stackoverflow.com/questions/19237235/jquery-button-click-event-not-firing for details //
  $(document).on('click', "#nextInstrButton", function(){
  // $("#nextInstrButton").on('click', function(){
    if (instrNum < instrNumMax){
      $('#instructions' + instrNum).text(addInstructions(instrNum));
      instrNum++;
    } else{
      $('#instructions' + instrNum).text(addInstructions(instrNum));
      $('#nextInstrButton').hide();
      $('#startExpButton').show();
    };
  });
};
