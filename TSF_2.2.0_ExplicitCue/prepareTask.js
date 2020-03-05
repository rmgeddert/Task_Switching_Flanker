// Creates task stimuli and cued task arrays

// target/flanker pairs for both incongruency types
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

// randomly picks one of two possible incongruent flankers from above
// and defines stim dictionary
function selectStimuli(){
  let dict = {}, target;
  let targets = ["1","2","3","4","6","7","8","9"];
  // create dictionary of stimuli
  targets.forEach((target) => {
    dict[target] = {};
    dict[target]["p"] = isEven(target) ? 'even' : 'odd';
    dict[target]["m"] = (target > 5) ? 'larger' : 'smaller';
    dict[target]["congruent"] = target;
    dict[target]["parityInc"] = parityIncStim[target][getRandomInt(2)];
    dict[target]["magnitudeInc"] = magnitudeIncStim[target][getRandomInt(2)];
  });
  return dict;
}

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
    let stimulus = flanker.repeat(distractorsPerSide)+target+flanker.repeat(distractorsPerSide);
    // build dictionary entry
    dict['target'][stimulus] = target;
    dict['distractor'][stimulus] = flanker;
    dict['p'][stimulus] = stimDict[target]["p"];
    dict['m'][stimulus] = stimDict[target]["m"];
    dict['congruency'][stimulus] = congruency;
  }
}

// creates stimuli/task set to specified size
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

  // GET FLANKER CONGRUENCY
  //fill size 16 array with incongruent (i) / congruents (c)
  let congruenciesArr = new Array(8).fill("c").concat(new Array(8).fill("i"));
  do {
    shuffle(congruenciesArr);
  } while (!orderIsOk(congruenciesArr));

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
  and selected stimuli for this experiment run */
  let stimulusTaskPair = [];
  let flanker, prevFlanker, prevTarget;
  for (var i = 0; i < targetArr.length; i++) {
    let target = targetArr[i];
    // determine flanker
    if (congruenciesArr[i] == "i") {
      flanker = (taskArr[i] == "p") ? selectedStimDict[target]["parityInc"] : selectedStimDict[target]["magnitudeInc"];
    } else {
      flanker = target;
    }
    // add flanker and target to stimulus set along with the task
    if (i != 0) {
      if (flanker == prevFlanker | flanker == prevTarget){
        return undefined;
      }
    }
    stimulusTaskPair.push([flanker.repeat(distractorsPerSide) + target + flanker.repeat(distractorsPerSide),taskArr[i]]);
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
   newArr = newArr.concat(arr[i][1]); //1 b/c stim are 2nd in stimTaskPair arr
  }
  return newArr;
}

// define correct responses for given task based on task mapping counterbalancing
// see taskMapping var in main.js and countarbalancing.js
function createActionArray(){
  let actionArr = [];
  let responseMappings = {
    1: {
      odd : 122,
      even : 120,
      larger : 110,
      smaller : 109
    },
    2: {
      odd : 122,
      even : 120,
      larger : 109,
      smaller : 110
    },
    3: {
      odd : 120,
      even : 122,
      larger : 110,
      smaller : 109
    },
    4: {
      odd : 120,
      even : 122,
      larger : 109,
      smaller : 110
    },
    5: {
      odd : 110,
      even : 109,
      larger : 120,
      smaller : 122
    },
    6: {
      odd : 109,
      even : 110,
      larger : 120,
      smaller : 122
    },
    7: {
      odd : 110,
      even : 109,
      larger : 122,
      smaller : 120
    },
    8: {
      odd : 109,
      even : 110,
      larger : 122,
      smaller : 120
    }
  };

  // for each stimulus and associated task, identify required action for correct response
  taskStimuliSet.forEach(function(taskStim, index){
    let task = cuedTaskSet[index]
    actionArr.push(responseMappings[taskMapping][ expStimDict[task][taskStim] ]);
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
