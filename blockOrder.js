let blockOrder1 = ["F","C","S","C","F","C","S"];
let blockOrder1 = ["S","C","F","C","S","C","F"];

function displayFeedbackScreen(feedbackType){
  // code for displaying feedback here
  if (feedbackType == "F") {
    proFlexibilityFeedback();
  } else if (feedbackType == "S") {
    proStabilityFeedback();
  } else {
    controlFeedback();
  }
}

function proFlexibilityFeedback(){
  $(" <img src='' alt=''> ").insertAfter( "#instructions" + slideNum);
}

function proStabilityFeedback(){

}

function controlFeedback(){

}
