// create global curStage variable
let curStage = 0;

// creates popup window
function basicPopup(url) {
  // opens popup with certain settings
  popupWindow = window.open(url,'popUpWindow','height=' + screen.height + ',width=' + screen.width + ',left=0,top=0,resizable=yes,scrollbars=yes,toolbar=no, menubar=no,location=no,directories=no,status=yes');
}

// this function allows Mturkers to get paid with their id
function gup(name, tmpURL){
  let regexS = "[\\?&]"+name+"=([^&#]*)";
  let results = new RegExp(regexS).exec(tmpURL);
  return (results == null) ? "" : results[1];
}

// function for navigating experiment stages
function updateMainMenu(expStage){
  // update global curstage variable
  curStage = expStage;

  // display text based on experiment stage
  switch(expStage){
    case 0: // demographics
      $("#myButton").show();
      $("#submit").hide();
      $("#instruction").text("Click button to fill out demographic survey. PLEASE DO NOT CLOSE THIS SCREEN.");
      break;
    case 1: //main task
      $("#myButton").show();
      $("#instruction").text("Click 'Continue' button to start the main task. PLEASE DO NOT CLOSE THIS SCREEN.");
      break;
    case 2: //debriefing
      $("#instruction").hide();
      $("#myButton").hide();
      $("#redo").hide();
      $("#mturk_form").show();
      break;
  }
}

// prevent duplicate workers from completing task
let worker_array = ['testing','testing2'];

// checks if workerID exists in workerid array
function checkWorkerID(workedID){
  workerId = gup('workerId', document.referrer);
  if (jQuery.inArray(workerId, worker_array)!=-1 && workerId != "") {
    // if found will return the index in the array
    duplicateWorker=1;
  } else {
    duplicateWorker=0;
  }

  return duplicateWorker;
}

$(document).ready(function(){
  // initial hide all DOM elements
  $("#mturk_form").hide();
  $("#instructions").hide();
  $("#myButton").hide();

  // gets MTurk Worker Information and assign to HTML elements
  document.getElementById('assignmentId').value = gup('assignmentId', document.referrer);
  document.getElementById('hitId').value = gup('hitId', document.referrer);
  document.getElementById('workerId').value = gup('workerId', document.referrer);

  // check worker ID
  if (document.getElementById("assignmentId").value == "" || document.getElementById("assignmentId").value == "ASSIGNMENT_ID_NOT_AVAILABLE"){

    // display text for accepting HIT
    $("#instruction").text("Accept HIT first");
    $("#instruction").show();
    $("#myButton").hide();
    $("#redo").hide();

  } else {

    // update menu to first value
    updateMainMenu(0);

    // create button press code for switching between sections
    $("#myButton").click(function(){
      switch(curStage){
        case 0:
          basicPopup("demographics.html");
          break;
        case 1:
          basicPopup("main.html");
          break;
      }
    });
  }

  // //removes manually excluded participants, else continues to consent.
  // if (checkWorkerId(workerId) == 1) {
  // 	// show text to participants that have already compeleted the task
  // } else {
  // 	updateMainMenu(0); // need this, otherwise it's a blank screen
  // }

  // //http://stackoverflow.com/questions/8595909/how-to-completley-disable-any-mouse-click
 //  //disable right click
 //  $(document).bind('contextmenu', function(e) {
 //      e.stopPropagation();
 //      e.preventDefault();
 //      e.stopImmediatePropagation();
 //      return false;
 // });

  // //Stops backspace presses (8) and spaces (32);
  // //http://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back
  // $(function(){
  //   let rx = /INPUT|SELECT|TEXTAREA/i;
  // 	$(document).bind("keydown keypress", function(e){
  // 		if( e.which == 32 ||e.which == 8 ){ // 8 == backspace
  // 			if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
  // 				e.preventDefault();
  // 			}
  // 		}
  // 	});
  // });
});
