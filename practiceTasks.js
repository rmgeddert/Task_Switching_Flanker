let stimCount = 0;

function runPractice(pracBlockNum){
  if (pracBlockNum = "1"){
    // create arrays for this practice block
    let taskStimuliSet = createTaskStimuliSet(24);
    console.log(taskStimuliSet);
    let cuedTaskSet = createCuedTaskArray(24);
    console.log(cuedTaskSet);
    let actionSet = createActionArray(taskStimuliSet, cuedTaskSet);
    console.log(actionSet);

    // go into block, including stimulus presentation and ITI's
    practice1(taskStimuliSet);
  } else if (pracBlockNum = "2"){




  } else if (pracBlockNum = "3") {
    let cuedTaskArray = createCuedTaskArray(stimArray.length);
    let actionArray = createActionArray();


  }
}

function practice1(taskStimuliSet){
  imageScreen(taskStimuliSet[stimCount]);

  $("body").keypress(function(event){
    console.log(event.which);
  })

  // setInterval(function(){
  //   stimCount++;
  //   console.log(stimCount);
  //   imageScreen(taskStimuliSet[stimCount]);
  // },1000);
}

function imageScreen(stimulus){
  // this also probably doesnt need to be rerun every time, move later
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  // text attributes (to be moved later so doesnt rerun every time)
  ctx.font = "bold 70px Arial";
  ctx.textBaseline= "middle";
  ctx.textAlign="center";

  // this needs to stay and is the gist of showing the image
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillText(stimulus,c.width/2,c.height/2);
}

// function itiScreen(taskStimuliSet){
//   stimCount++;
//   practice1(taskStimuliSet);
// }

// misc functions
function checkAccuracy(acc){
  return  acc > 90;
}

// stimCount++;
// imageScreen(taskStimuliSet[stimCount]);
