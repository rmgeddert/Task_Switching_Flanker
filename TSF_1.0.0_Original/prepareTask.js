// Creates Stimulus Array, Cued Task Array, and related action array

/* ##################################################
   ------------- Stimulus Set Creation  -------------
   ##################################################
   - defines which stimuli are part of the overall experiment
     and classifies them in dictionary for later use */

// possible stimuli
let congruentStim = ['11111' , '22222' , '33333' , '44444' , '66666' , '77777' , '88888' , '99999'];
let parityIncStim = [ ['22122','44144'] , ['11211','33233'] , ['22322','44344'] , ['11411','33433'] , ['77677','99699'] , ['66766','88788'] , ['77877','99899'] , ['66966','88988'] ];
let magnitudeIncStim = [ ['77177','99199'] , ['66266','88288'] , ['77377','99399'] , ['66466','88488'] , ['22622','44644'] , ['11711','33733'] , ['22822','44844'] , ['11911','33933'] ];

function selectExperimentStimuli(){
  let selectedStim = [];

  //each congruent stim goes into main stim array
  congruentStim.forEach( function(stim){
    selectedStim.push( [stim, "congruent"] );
  })

  // randomly pick from each pair of incongruent stimuli to add to main stim arr
  randStimPick(parityIncStim, "parityInc");
  randStimPick(magnitudeIncStim, "magnitudeInc");

  return selectedStim;

  function randStimPick(arr, designation){
    arr.forEach(function(stimPair){
      selectedStim.push( [stimPair[getRandomInt(2)], designation] );
    })
  }
}

function defineStimuli(inputArr){
  // object var for storing stimulus information
  let stimDict = {
    target: {},
    p: {},
    m: {},
    distractor: {},
    congruency: {}
  };

  inputArr.forEach(function(newStim){
    let stimulus = newStim[0];

    // pull out target and distractor from stimulus string
    let stimTarget = stimulus.slice(2,3); // target = 3rd number in string
    let stimDistractor = stimulus.slice(0,1); // distractor = 1st number in string

    // add stimulus variables to stimDict variable
    stimDict['target'][stimulus] = stimTarget;
    stimDict['distractor'][stimulus] = stimDistractor;
    stimDict['p'][stimulus] = (isEven(stimTarget)) ? 'even' : 'odd';
    stimDict['m'][stimulus] = (stimTarget > 5) ? 'larger' : 'smaller';
    stimDict['congruency'][stimulus] = newStim[1];
  })

  return stimDict;
}

/* ##################################################
   ------------- Stimulus/Task Creation  ------------
   ##################################################
   - randomly assigns magnitude/parity task to each
   stimulus. It guarantees that each stimulus type
   (odd,<5),(even,<5),etc... is paired with each task once,
   guaranteeing 50/50 task and task responses. Shuffles task
   pairings array (stimTaskPairs), ensuring:
     - < 4 congruency repeats in a row
     - < 4 task repetition/switch in a row
     - < 3 congruency repetitions*/
function createStimuliAndTaskSets(numTrials = stimArray.length, tasks = "both"){
  let blocksNeeded = Math.ceil(numTrials/stimArray.length);
  let arr = [];
  for (var i = 0; i < blocksNeeded; i++) {
    arr = arr.concat(createPairSet(tasks));
  }
  return arr.slice(0,numTrials);
}

function createPairSet(tasks){
  let taskStim = {
    congruent: {
      larger: {
        even: [],
        odd: []
      },
      smaller: {
        even: [],
        odd: []
      }
    },
    parityInc: {
      larger: {
        even: [],
        odd: []
      },
      smaller: {
        even: [],
        odd: []
      }
    },
    magnitudeInc: {
      larger: {
        even: [],
        odd: []
      },
      smaller: {
        even: [],
        odd: []
      }
    }
  }

  // fill taskStim object variable with stimuli based on congruency, magnitude, and parity
  stimArray.forEach(function(stimPair){
    // variables defined for readability.
    let stim = stimPair[0];
    let stimCongruency = stimPair[1];
    let stimMag = expStimDict["m"][stim];
    let stimPar = expStimDict["p"][stim];
    // add stim to taskStim
    taskStim[stimCongruency][stimMag][stimPar].push(stim);
  })

  let shuffledStimArray = shuffle(stimArray);

  // ----- create stimulus-task pairings ----- //
  let stimTaskPairs = [];

  // the below code is a VERY concise object looping method to iterate over the taskStim object.
  // see https://stackoverflow.com/questions/8312459/iterate-through-object-properties
  Object.keys(taskStim).forEach(e => Object.keys(taskStim[e]).forEach( f => Object.keys(taskStim[e][f]).forEach(function(g){
    let pairShuffle = shuffle(taskStim[e][f][g]);
    stimTaskPairs.push( [pairShuffle[0], (tasks == "p") ? "p" : "m"] );
    stimTaskPairs.push( [pairShuffle[1], (tasks == "m") ? "m" : "p"] );
  })));

  //shuffle stimTaskPairs array until task and stim order criteria are met.
  do {
    stimTaskPairs = shuffle(stimTaskPairs);
  } while (!taskOrderIsOk(tasks, stimTaskPairs) || !stimOrderIsOk(stimTaskPairs) || !responseOrderIsOk(stimTaskPairs) );

  return stimTaskPairs;
}

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

function responseOrderIsOk(stimPairArr){
  let responseCounter = 0;
  let stim, task, taskResponse;
  let prevResponse;

  for (var i = 0; i < stimPairArr.length; i++) {
    stim = stimPairArr[i][0];
    task = stimPairArr[i][1];
    taskResponse = expStimDict[task][stim];

    // check responses for repeats
    if (i != 0) {
      if (taskResponse == prevResponse){
        responseCounter++;
      } else {
        responseCounter = 0;
      }
    }

    // quit function early if more than 3 in a row of one type
    if (responseCounter > 2){
      return false;
    }

    // set prev for next loop iteration
    prevResponse = taskResponse;
  }
  //  if made to here, return response order is ok. return true.
  return true;
}

function taskOrderIsOk(tasks, stimPairArr){
  if (tasks == "m" || tasks == "p") {return true;} //quit if only one kind of task

  //define start vars
  let countTaskRepeats = 0, countTaskSwitches = 0, prevTask;
  let overallSwitchCount = 0

  //loop through array and count task switch/repeats
  for (let i = 0; i < stimPairArr.length; i++){

    // check if task switch/repeat and increment
    if (i != 0) {
      if (stimPairArr[i][1] == prevTask) { //trial is repeat
        countTaskSwitches = 0;
        countTaskRepeats++;
      } else { //trial is switch
        countTaskRepeats = 0;
        countTaskSwitches++;
        overallSwitchCount++;
      }
    }

    // if more than 3 switch/repeat in a row, return false
    if (countTaskSwitches > 3 || countTaskRepeats > 3){ return false;}

    //prepare prevTask for next loop iteration
    prevTask = stimPairArr[i][1];
  }

  //if enough switches in block of 24, then return true
  return overallSwitchCount >= 10 && overallSwitchCount <= 14
}

function stimOrderIsOk(stimPairArr){
  // makes sure there aren't 3 congruency types in a row
  let prevItem, stimCounter = 0;

  //loop through array and
  for (let i = 0; i < stimPairArr.length; i++){
    let stimCongruency = expStimDict["congruency"][stimPairArr[i][0]];
    if (i==0){
      prevItem = stimCongruency;
      continue;
    }

    //count repeats
    if (stimCongruency == prevItem){
      stimCounter++;
    } else {
      stimCounter = 0;
    }

    // check if more than 2 in a row of one congruency type
    if (stimCounter > 2) { return false; }
    prevItem = stimCongruency;
  }

  return true;
}

/* ################################################## //
   ------------ Stimulus/Task Splitting  ------------ //
   ################################################## //
   - createStimuliAndTaskSets() returns a 2d array. We
   need to split this into separate arrays for use by
   tasks.js during stimulus presentation
   NTS: Could probably also just have tasks.js split this
   on the fly... tbd. */

function getStimSet(arr){
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
   newArr = newArr.concat(arr[i][0]); //0 b/c stim are 1st in stimTaskPair arr
  }
  return newArr;
}

function getTaskSet(arr){
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
   newArr = newArr.concat(arr[i][1]); //1 b/c stim are 2nd in stimTaskPair arr
  }
  return newArr;
}

// ################################################## //
// -------------- Action Set Creation --------------- //
// ################################################## //
// - based on stimulus set and cued task, what is correct response?

function createActionArray(){
  let actionArr = [];
  let responseMappings = {
    // see taskMapping in main.js
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

//random integer function
function getRandomInt(max){
  return Math.floor(Math.random() * Math.floor(max));
}
