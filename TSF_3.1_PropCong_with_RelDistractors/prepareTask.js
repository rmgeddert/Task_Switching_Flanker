// ------------------------------------- //
//  Choose which stimuli are in the task //
// ------------------------------------- //
let parityIncStim = {
  "1": ["2","4"],
  "2": ["1","3"],
  "3": ["2","4"],
  "4": ["1","3"],
  "6": ["7","9"],
  "7": ["6","8"],
  "8": ["7","9"],
  "9": ["6","8"]
}
let magnitudeIncStim = {
  "1": ["7","9"],
  "2": ["6","8"],
  "3": ["7","9"],
  "4": ["6","8"],
  "6": ["2","4"],
  "7": ["1","3"],
  "8": ["2","4"],
  "9": ["1","3"]
}

function selectStimuli(){
  let dict = {};
  let targets = ["1","2","3","4","6","7","8","9"];

  // create dictionary for target characteristics
  targets.forEach((target) => {
    dict[target] = {};
    dict[target]["p"] = isEven(target) ? 'even' : 'odd';
    dict[target]["m"] = (target > 5) ? 'larger' : 'smaller';
    dict[target]["congruent"] = target;
    // choose parity incongruent number to be flanker
    dict[target]["parityInc"] = parityIncStim[target][getRandomInt(2)];
    // choose magnitude incongruent number to be flanker
    dict[target]["magnitudeInc"] = magnitudeIncStim[target][getRandomInt(2)];
  });
  return dict;
}

// create look up dictionary for each full stimulus (e.g. "33233") that describes its components and characteristics
function defineStimuli(stimDict){
  let dict = {
    target: {},
    p: {},
    m: {},
    distractor: {},
    dist_p: {},
    dist_m:{},
    congruency: {}
  };

  Object.keys(stimDict).forEach(
    function(target){
      addStimToDict(target,"congruent");
      addStimToDict(target,"parityInc");
      addStimToDict(target,"magnitudeInc");
    }
  );

  return dict;

  function addStimToDict(target, congruency){
    // get flanker and build stimulus
    let flanker = stimDict[target][congruency];
    let stimulus = flanker+flanker+target+flanker+flanker;
    // build dictionary entry
    dict['target'][stimulus] = target;
    dict['distractor'][stimulus] = flanker;
    dict['p'][stimulus] = stimDict[target]["p"];
    dict['m'][stimulus] = stimDict[target]["m"];
    dict['dist_p'][stimulus] = stimDict[flanker]["p"];
    dict['dist_m'][stimulus] = stimDict[flanker]["m"];
    dict['congruency'][stimulus] = congruency;
  }
}

// ------------------------------------- //
//      Create arrays for prac task      //
// ------------------------------------- //
// uses some prac specific functions and the rest are from main task functions below

function createPracticeTaskPairs(nTrials, task){
  let targetArr = createTargetArr(nTrials);
  let flankerCongruenciesArr = createPracticeFlankersArr(nTrials);
  let taskArr = createPracTaskArray(nTrials, task);
  let stimArr = createStimArray(taskArr, flankerCongruenciesArr, targetArr);
  return stimTaskPairArr = stimArr.map((s, i) => [s, taskArr[i]]);
}

function createPracticeFlankersArr(nTrials){
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
    let taskA = "p", taskB = "m";

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

// ------------------------------------- //
//      Create arrays for main task      //
// ------------------------------------- //
function createStimuliAndTaskSets(nTrials, blockLetter){
  let targetArr, flankerCongruenciesArr, taskArr, stimArr;
  let iterationCount = 1;
  do {
    targetArr = createTargetArr(nTrials);
    flankerCongruenciesArr = createFlankersArray(nTrials, blockLetter);
    taskArr = createTaskArray(nTrials, blockLetter);
    stimArr = createStimArray(taskArr, flankerCongruenciesArr, targetArr);
    iterationCount++;
  } while (stimArr == undefined && iterationCount < 100)

  // return zipped task and stim arr into one variable
  return stimTaskPairArr = stimArr.map((s, i) => [s, taskArr[i]]);
}

function createTargetArr(nTrials){
  let targetsArr = [], newBatch;
  let batchesNeeded = Math.ceil(nTrials/16);
  for (let i = 0; i < batchesNeeded; i++) {
    do {
      newBatch = createTargetBatch();
    } while (newBatch[0] == targetsArr[targetsArr.length - 1]);
    targetsArr = targetsArr.concat(newBatch);
  }
  return targetsArr;
}

function createTargetBatch(){
  let targets = ["1","2","3","4","6","7","8","9"];
  let targetArr = targets.concat(targets); //one batch has 2 sets of targets

  // shuffle targets
  do {
    shuffle(targetArr);
  } while (targetRepeats(targetArr));
  return targetArr;

  // check shuffled target array for repeats
  function targetRepeats(arr){
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == arr[i+1]) {
        return true;
      }
    }
    return false;
  }
}

function createFlankersArray(batchSize, blockLetter){
  // calc how mnay congruent/incongruent trials are needed
  let nConTrials = Math.ceil(getBlockCongruencies(blockLetter).fl_con * batchSize);
  let nIncTrials = batchSize - nConTrials;
  // nIncTrials = Math.ceil(getBlockCongruencies(blockLetter).fl_inc * batchSize);

  // array of congruent and incongruent trials
  let congruenciesArr = new Array(nConTrials).fill("c").concat(new Array(nIncTrials).fill("i"));

  // return shuffled array
  return shuffle(congruenciesArr);
}

function createTaskArray(batchSize, blockLetter){
  let taskA = "p", taskB = "m";

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

function createStimArray(taskArr, flankerCongruencies, targetArr){
  let stimulusArr = [], flanker;
  for (let i = 0; i < taskArr.length; i++) {
    let target = targetArr[i];
    // determine flanker based on task and congruency
    if (flankerCongruencies[i] == "i") {
      if (taskArr[i] == "p") {
        flanker = selectedStimDict[target]["parityInc"];
      } else {
        flanker = selectedStimDict[target]["magnitudeInc"];
      }
    } else {
      flanker = target;
    }

    // // check if flankers repeat from previous trial
    // if (i != 0) {
    //   if (flanker == prevFlanker | flanker == prevTarget){
    //     return undefined;
    //   }
    // }

    // add stimulus to arr
    stimulusArr.push(flanker + flanker + target + flanker + flanker);

    // remember what previous flanker was
    prevFlanker = flanker;
    prevTarget = target;
  }

  return stimulusArr;
}

function getRelevancyArray(nTrials, propCenterTrials){
  let relevancyArr = [], newBatch;
  let batchesNeeded = Math.ceil(nTrials/16);
  for (let i = 0; i < batchesNeeded; i++) {
    if ((expStage.indexOf("prac") != -1 && expStage.indexOf("prac4") == -1)) {
      newBatch = new Array(16).fill("t");
      relevancyArr = relevancyArr.concat(newBatch);
    } else {
      newBatch = createRelevancyBatch(16, propCenterTrials);
      relevancyArr = relevancyArr.concat(newBatch);
    }
  }
  return relevancyArr;
}

function createRelevancyBatch(batchSize, propCenterTrials){
  let nTaskRelTrials = Math.floor(batchSize * propCenterTrials)
  let nDistRelTrials = batchSize - nTaskRelTrials

  let relevancyArr = new Array(nTaskRelTrials).fill("t").concat(new Array(nDistRelTrials).fill("d"));

  do {
    shuffle(relevancyArr)
  } while (!relOrderOk(relevancyArr))

  return relevancyArr;

  function relOrderOk(arr){
    // check if "d" indices repeat, or are in index positions 0 or 1
    let d_indices = getAllIndexes(arr, "d")

    for (var i = 0; i < d_indices.length; i++) {
      if (d_indices[i] == d_indices[i+1] - 1 || d_indices.indexOf(0) != -1 || d_indices.indexOf(1) != -1) {
        return false;
      } else {
        return true;
      }
    }
  }

  //function to get all indices of a certain value(val) in an array (arr)
  function getAllIndexes(arr, val) {
    var indexes = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {indexes.push(i);}
    }
    return indexes;
  }
}

function createPracticeFlankersArr(nTrials){
  // calc how mnay congruent/incongruent trials are needed
  let nConTrials = Math.ceil(nTrials * 0.5);
  let nIncTrials = nTrials - nConTrials;

  // array of congruent and incongruent trials
  let congruenciesArr = new Array(nConTrials).fill("c").concat(new Array(nIncTrials).fill("i"));

  // return shuffled array
  return shuffle(congruenciesArr);
}

// determine if trial is switch or repeat (first trials in blocks are "n")
function getSwitchRepeatList(taskArr, blockTrialLength){
  let switchRepeatArr = [], prevTask;
  for (let i = 0; i < taskArr.length; i++){
    // check if task switch/repeat and increment
    if ((i % trialsPerBlock != 0) && (i % miniBlockLength != 0) && (i % blockTrialLength != 0)) {
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
      odd : [90,122],
      even : [88,120],
      larger : [78,110],
      smaller : [77,109]
    },
    2: {
      odd : [90,122],
      even : [88,120],
      larger : [77,109],
      smaller : [78,110]
    },
    3: {
      odd : [88,120],
      even : [90,122],
      larger : [78,110],
      smaller : [77,109]
    },
    4: {
      odd : [88,120],
      even : [90,122],
      larger : [77,109],
      smaller : [78,110]
    },
    5: {
      odd : [78,110],
      even : [77,109],
      larger : [88,120],
      smaller : [90,122]
    },
    6: {
      odd : [77,109],
      even : [78,110],
      larger : [88,120],
      smaller : [90,122]
    },
    7: {
      odd : [78,110],
      even : [77,109],
      larger : [90,122],
      smaller : [88,120]
    },
    8: {
      odd : [77,109],
      even : [78,110],
      larger : [90,122],
      smaller : [88,120]
    }
  };

  // for each stimulus and associated task, identify required action for correct response
  let actionArr = [];
  taskStimuliSet.forEach(function(taskStim, index){
    let task = cuedTaskSet[index];
    if (relevancyArr[index] == "t" || (expStage.indexOf("prac") != -1 && expStage.indexOf("prac4") == -1)) { //if trial is target trial
      actionArr.push(responseMappings[taskMapping][expStimDict[task][taskStim]]);
    } else { //if trial is distractor trial
      actionArr.push(responseMappings[taskMapping][expStimDict["dist_" + task][taskStim]])
    }
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
