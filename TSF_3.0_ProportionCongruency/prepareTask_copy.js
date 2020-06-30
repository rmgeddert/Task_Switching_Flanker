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
  let dict = {}, target;
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

// create look up dictionary for each full stimulus "33233" that describes its components and characteristics
function defineStimuli(stimDict){
  let dict = {
    target: {},
    p: {},
    m: {},
    distractor: {},
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
    dict['congruency'][stimulus] = congruency;
  }
}

// ------------------------------------- //
//         Create arrays for task        //
// ------------------------------------- //
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

function createTaskSwitchArray(batchSize, blockLetter){
  let taskA = "p", taskB = "m";

  // calc how many switch and repeat trials needed
  let nSwitchTrials = Math.ceil(getBlockCongruencies(blockLetter).switch * batchSize);
  let nRepeatTrials = batchSize - nSwitchTrials;

  // choose which task is first
  let task1 = (Math.random() > 0.5) ? taskA : taskB;
  let task2 = (task1 == taskA) ? taskB : taskA;

  //build array with switch trials
  let switchArr = [];
  for (let i = 0; i < Math.ceil(batchSize * getBlockCongruencies(blockLetter).switch); i++) {
    if (i%2 == 0) {
      switchArr.push(task1);
    } else {
      switchArr.push(task2);
    }
  }

  // if switchArr has odd number of items, add one more of the second item to ensure 50/50 tasks
  // A B A B A B A => add a B to make it 50/50 A and B
  if (switchArr.length%2 == 1) {
    switchArr.push(switchArr[1]);
  }

  // get final number of switch trials
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
  for (let i = 0; i < (batchSize - nSwitches) / 2; i++) {
    // insert an A task
    let a_indexes = getAllIndexes(switchArr,taskA);
    let repeatloc_a = a_indexes[Math.floor(Math.random()*a_indexes.length)];
    switchArr.splice(repeatloc_a, 0, taskA);

    // insert task B
    let b_indexes = getAllIndexes(switchArr,taskB);
    let repeatloc_b = b_indexes[Math.floor(Math.random()*b_indexes.length)];
    switchArr.splice(repeatloc_b, 0, taskB);
  }

  return switchArr
}

// creates stimuli/task set to specified size for practice
function createStimuliAndTaskSets(numTrials = 16, tasks = "both"){
  let blocksNeeded = Math.ceil(numTrials/16);
  let arr = [], newBatch;
  for (var i = 0; i < blocksNeeded; i++) {
    do {
      newBatch = createStimTaskBatch(tasks);
    } while (newBatch == undefined);
    arr = arr.concat(newBatch);
  }
  return arr.slice(0,numTrials);
}

// creates single size 16 batch of stimuli/task
function createStimTaskBatch(tasks){
  // GET TARGET NUMBER
  // fill size 16 array with targets
  let targets = ["1","2","3","4","6","7","8","9"];
  let targetArr = targets.concat(targets);
  do {
    shuffle(targetArr);
  } while (targetRepeats(targetArr));

  // check shuffled target array for repeats
  function targetRepeats(arr){
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == arr[i+1]) {
        return true;
      }
    }
    return false;
  }

  // GET TASK ARRAY
  /* create task arrays in batch size 16
    - no more than 3 switch/repeats in a row
    - min 7 max 8 switches over the 15 transitions
  */
  let task1 = (tasks == "m") ? "m" : "p";
  let task2 = (tasks == "p") ? "p" : "m";
  let taskArr = new Array(8).fill(task1).concat(new Array(8).fill(task2));
  if (!(tasks == "p" | tasks == "m")){
    do {
      shuffle(taskArr);
    } while (!orderIsOk(taskArr));
  }

  // FINAL STIMULI AND TASK ARRAY
  /* Assign flanker stimuli to target number, depending
  on task ("p" or "m"), flanker congruency ("i" or "c"),
  using selected stimuli for this experiment run */
  let stimulusTaskPair = [];
  let flanker, prevFlanker, prevTarget;
  for (var i = 0; i < targetArr.length; i++) {
    let target = targetArr[i];
    // determine flanker
    if (congruenciesArr[i] == "i") {
      if (taskArr[i] == "p") {
        flanker = selectedStimDict[target]["parityInc"];
      } else {
        flanker = selectedStimDict[target]["magnitudeInc"];
      }
    } else {
      flanker = target;
    }

    // add flanker and target to stimulus set along with the task
    if (i != 0) {
      if (flanker == prevFlanker | flanker == prevTarget){
        return undefined;
      }
    }
    stimulusTaskPair.push([flanker + flanker + target + flanker + flanker,taskArr[i]]);
    prevFlanker = flanker;
    prevTarget = target;
  }
  return stimulusTaskPair;
}

/* check order for batch size 16 trials:
- no more than 2 repeats/switches in a row
- min 7 max 8 switches in set of 15 transitions*/
function orderIsOk(arr){
  let prevItem, overallSwitchCount = 0;
  let repeatCount = 0,switchCount = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == prevItem) {
      repeatCount++;
      switchCount = 0;
      if (repeatCount > 2) {
        return false;
      }
    } else {
      overallSwitchCount++;
      switchCount++;
      repeatCount = 0;
      if (switchCount > 2) {
        return false;
      }
    }
    prevItem = arr[i];
  }
  return overallSwitchCount >= 7 && overallSwitchCount <= 8;
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

// define correct responses for given task based on task mapping counterbalancing
// see taskMapping var in main.js and countarbalancing.js
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
    actionArr.push(responseMappings[taskMapping][expStimDict[task][taskStim]]);
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
