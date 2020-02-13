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
      $("#instruction").show();
      break;
    case 1: //main task
      $("#myButton").show();
      $("#instruction").text("Click 'Continue' button to start the main task. PLEASE DO NOT CLOSE THIS SCREEN.");
      $("#instruction").show();
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
let workerArr = ['A3PK3QF2HEYZ0N','A141QUHWYCE2E','A25PFSORDO3SWQ','A1AJ2G7JXXJ8UJ',
  'A2FL477TMKC91L','A22DVMN2Y3XHWA','A1GLY95E6HRTCD','A1ROEDVMTO9Y3X','A37OUZOGQKGMW0',
'A3S0CAN1GKD8I4','A3VP27UUQ34OXK','A37L7WFHSC4RNF','A3R168GJZRF7KU','AROZ6EDDUGTLP','AKFJYQX7VPPW','AMPMTF5IAAMK8','A2FWZR12905V6J','A2NAKIXS3DVGAA','AUFUUD4WG9CVO','A2O2Y99RA9GFUJ','AQWH9UY6FVU21','A2QBFXY9UQMJTT','A3NUUMHNIE3XHA','A1MMLN9XGYXF7M','A1JKHGRDXU18PM','A2MOC4PTJYY15B','A21OKN7OJOFG2P','A10JXOU89D5RXR','A1198W1SPF1R4','A2LVCS009DMEAT','A19S4W3QLLQJ0T','A2BBDH8DZD77AU','A1RV2LERVS0A4H','AMV1E7FFPVAW4'];

// checks if workerID exists in workerid array
function duplicateWorker(workedID){
  workerId = gup('workerId', document.referrer);
  return jQuery.inArray(workerId, workerArr)!=-1 && workerId != "";
}

$(document).ready(function(){
  // initial hide all DOM elements
  $("#mturk_form").hide();
  $("#instructions").hide();
  $("#myButton").hide();
  $("#NoGo").hide();

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

    // prevents previous participants from participating again. See var workerArr above
    if (duplicateWorker(workerId)) {

  		$("#NoGo").html("You have performed our task before. Unfortunately, we are <br/> unable to allow duplicate entries. Please return this HIT. Thanks!")
  		$("#NoGo").show();
    } else {
    	prepareMenu();
    }

  }

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

function prepareMenu(){
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
