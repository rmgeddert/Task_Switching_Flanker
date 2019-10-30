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

  } else if (pracBlockNum = "2"){




  } else if (pracBlockNum = "3") {
    let cuedTaskArray = createCuedTaskArray(stimArray.length);
    let actionArray = createActionArray();


  }
}

// misc functions
function checkAccuracy(acc){
  return  acc > 90;
}
