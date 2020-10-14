// practice task arrays
// vvvvvvvvvvvvvvvv
function createPracticeStimPairs(nTrials, task){
  let targetArr = createTargetsArr(nTrials);
  let flankerCongruenciesArr = createPracticeCongruenciesArr(nTrials);
  let taskArr = createPracTaskArray(nTrials, task);
  let stimArr = createStimArray(taskArr, flankerCongruenciesArr, targetArr);
  return stimTaskPairArr = stimArr.map((s, i) => [s, taskArr[i]]);
}

function createPracticeCongruenciesArr(nTrials){
  // calc how mnay congruent/incongruent trials are needed
  let nConTrials = Math.ceil(nTrials * 0.5);
  let nIncTrials = nTrials - nConTrials;

  // array of congruent and incongruent trials
  let congruenciesArr = new Array(nConTrials).fill("c").concat(new Array(nIncTrials).fill("i"));

  // return shuffled array
  return shuffle(congruenciesArr);
}

function createPracTaskArray(nTrials, task){
  if (task == "") {
    let taskA = "g", taskB = "l";

    // calc how many switch and repeat trials needed
    let nSwitchTrials = Math.ceil(nTrials * 0.5);
    let nRepeatTrials = nTrials - nSwitchTrials;

    // choose which task is first
    let task1 = (Math.random() > 0.5) ? taskA : taskB;
    let task2 = (task1 == taskA) ? taskB : taskA;

    //build array with switch trial pairs ("A", "B") x ###
    let switchArr = [];
    for (let i = 0; i < Math.ceil((nTrials * 0.5) / 2); i++) {
      switchArr.push(task1);
      switchArr.push(task2);
    }

    // get number of switches
    nSwitches = switchArr.length;

    //function to get all indices of a certain value(val) in an array (arr)
    function getAllIndexes(arr, val) {
      var indexes = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {indexes.push(i);}
      }
      return indexes;
    }

    // insert repeat trials into switchArr
    for (let i = 0; i < Math.ceil((nTrials - nSwitches) / 2); i++) {
      // insert an A task
      let a_indexes = getAllIndexes(switchArr,taskA);
      let repeatloc_a = a_indexes[Math.floor(Math.random()*a_indexes.length)];
      switchArr.splice(repeatloc_a, 0, taskA);

      // insert task B
      let b_indexes = getAllIndexes(switchArr,taskB);
      let repeatloc_b = b_indexes[Math.floor(Math.random()*b_indexes.length)];
      switchArr.splice(repeatloc_b, 0, taskB);
    }

    return switchArr;
  } else {
    return new Array(nTrials).fill(task);
  }
}

// main task arrays
// vvvvvvvvvvvvvvvv
// creates what stimuli and task are on each trial
function createStimuliAndTaskSets(nTrials, blockLetter){
  let targetsArr, congruenciesArr, taskArr, stimArr;
  let iterationCount = 1;
  do {
    targetsArr = createTargetsArr(nTrials);
    taskArr = createTaskArray(nTrials, blockLetter);
    congruenciesArr = createCongruencyArray(nTrials, blockLetter);
    stimArr = createStimArray(taskArr, congruenciesArr, targetsArr);
    iterationCount++;
  } while (stimArr == undefined && iterationCount < 100)

  // return zipped task and stim arr into one variable
  return stimTaskPairArr = stimArr.map((s, i) => [s, taskArr[i]]);
}

// create what correct answer on each trial is
function createTargetsArr(nTrials){
  let targetsArr = [], newBatch;
  let batchesNeeded = Math.ceil(nTrials/16);
  for (let i = 0; i < batchesNeeded; i++) {
    newBatch = createTargetBatch();
    targetsArr = targetsArr.concat(newBatch);
  }
  return targetsArr;
}

// create set of 16 trials (S vs H as correct answer)
function createTargetBatch(){
  let targets = new Array(8).fill("H").concat(new Array(8).fill("S"));

  // shuffle targets
  do {
    shuffle(targets);
  } while (targetArrNotOk(targets));

  return targets;

  // check shuffled target array for repeats
  function targetArrNotOk(arr){
    let nTargetRepeats = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == arr[i+1]) {
        nTargetRepeats++;
      }
    }
    return (nTargetRepeats < 7 || nTargetRepeats > 9);
  }
}

// creates task array (responding globally or locally)
function createTaskArray(batchSize, blockLetter){
  let taskA = "g", taskB = "l";

  // calc how many switch and repeat trials needed
  let nSwitchTrials = Math.ceil(getBlockCongruencies(blockLetter).switch * batchSize);
  let nRepeatTrials = batchSize - nSwitchTrials;

  // choose which task is first
  let task1 = (Math.random() > 0.5) ? taskA : taskB;
  let task2 = (task1 == taskA) ? taskB : taskA;

  //build array with switch trial pairs ("A", "B") x ###
  let switchArr = [];
  for (let i = 0; i < Math.ceil(batchSize * getBlockCongruencies(blockLetter).switch / 2); i++) {
    switchArr.push(task1);
    switchArr.push(task2);
  }

  // get number of switches
  nSwitches = switchArr.length;

  //function to get all indices of a certain value(val) in an array (arr)
  function getAllIndexes(arr, val) {
    var indexes = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {indexes.push(i);}
    }
    return indexes;
  }

  // insert repeat trials into switchArr
  for (let i = 0; i < Math.ceil((batchSize - nSwitches) / 2); i++) {
    // insert an A task
    let a_indexes = getAllIndexes(switchArr,taskA);
    let repeatloc_a = a_indexes[Math.floor(Math.random()*a_indexes.length)];
    switchArr.splice(repeatloc_a, 0, taskA);

    // insert task B
    let b_indexes = getAllIndexes(switchArr,taskB);
    let repeatloc_b = b_indexes[Math.floor(Math.random()*b_indexes.length)];
    switchArr.splice(repeatloc_b, 0, taskB);
  }

  return switchArr;
}

// create congruency array (is each trial congruent or incongruent)
function createCongruencyArray(batchSize, blockLetter){
  // calc how mnay congruent/incongruent trials are needed
  let nConTrials = Math.ceil(getBlockCongruencies(blockLetter).gl_con * batchSize);
  let nIncTrials = batchSize - nConTrials;
  // nIncTrials = Math.ceil(getBlockCongruencies(blockLetter).fl_inc * batchSize);

  // array of congruent and incongruent trials
  let congruenciesArr = new Array(nConTrials).fill("c").concat(new Array(nIncTrials).fill("i"));

  // return shuffled array
  return shuffle(congruenciesArr);
}

// determine each stimulus on each trial
function createStimArray(taskArr, congruencies, targetArr){
  let stimulusArr = [], task_stimulus = {};
  for (let i = 0; i < taskArr.length; i++) {
    // what is correct answer
    let target = targetArr[i];

    // determine stimulus based on congruency and task (and what correct answer is)
    if (congruencies[i] == "c") {
      task_stimulus = {
        g: target,
        l: target
      }
    } else {
      if (taskArr == "g") {
        task_stimulus = {
          g: target,
          l: oppositeOfTarget(target)
        }
      } else {
        task_stimulus = {
          g: oppositeOfTarget(target),
          l: target
        }
      }
    }
    // add stimulus to stim array
    stimulusArr.push(task_stimulus);
  }
  return stimulusArr;
}

// figure out opposite lettter in case of incongruent stimulus
function oppositeOfTarget(target){
  if (target == "S") {
    return "H";
  } else {
    return "S";
  }
}

// determine if trial is switch or repeat (first trials in blocks are "n")
function getSwitchRepeatList(taskArr){
  let switchRepeatArr = [], prevTask;
  for (let i = 0; i < taskArr.length; i++){
    // check if task switch/repeat and increment
    if ((i % trialsPerBlock != 0) && (i % miniBlockLength != 0)) {
      //if not first trial of block
      if (taskArr[i] == prevTask) { //trial is repeat
        switchRepeatArr.push("r");
      } else { //trial is switch
        switchRepeatArr.push("s");
      }
    } else {
      //first trial so not switch or repeat, classify as "n"
      switchRepeatArr.push("n");
    }

    //prepare prevTask for next loop iteration
    prevTask = taskArr[i];
  }
  return switchRepeatArr;
}

// extracts just stimulus from stim/task array
function getStimSet(arr){
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
   newArr = newArr.concat(arr[i][0]); //0 b/c stim are 1st in stimTaskPair arr
  }
  return newArr;
}

// extracts just task from stim/task array
function getTaskSet(arr){
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
   newArr = newArr.concat(arr[i][1]); //1 b/c task is 2nd in stimTaskPair arr
  }
  return newArr;
}

function createActionArray(){
  let responseMappings = {
    1: {
      S : 49,
      H : 48
    },
    2: {
      S : 48,
      H : 49
    }
  };

  // for each stimulus and associated task, identify required action for correct response
  let actionArr = [];
  taskStimuliSet.forEach(function(taskStim, index){
    let task = cuedTaskSet[index];
    actionArr.push(responseMappings[taskMapping][taskStimuliSet[index][task]]);
  })
  return actionArr;
}


// ------------- Misc Functions ------------- //
// Fisher-Yates shuffle
function shuffle(array){
  for(let j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
  return array;
}

// isEven Function for stimulus categorization
function isEven(n) {return n % 2 == 0;}
// let isEven = (n) => n % 2 == 0;

function getRandomInt(max){
  return Math.floor(Math.random() * Math.floor(max));
}
