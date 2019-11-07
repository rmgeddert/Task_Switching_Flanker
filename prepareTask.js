// Creates Stimulus Array, Cued Task Array, and related action array

/* ##################################################
   ------------- Stimulus Set Creation  -------------
   ##################################################
   - defines which stimuli are part of the overall experiment
     and classifies them in dictionary */

// possible stimuli
let congruentStim = ['11111' , '22222' , '33333' , '44444' , '66666' , '77777' , '88888' , '99999'];
let parityIncStim = [ ['22122','44144'] , ['11211','33233'] , ['22322','44344'] , ['11411','33433'] , ['77677','99699'] , ['66766','88788'] , ['77877','99899'] , ['66966','88988'] ];
let magnitudeIncStim = [ ['77177','99199'] , ['66266','88288'] , ['77377','99399'] , ['66466','88488'] , ['22622','44644'] , ['11711','33733'] , ['22822','44844'] , ['11911','33933'] ];

function selectExperimentStimuli(){
  let stimArray = [];

  //each congruent stim goes into main stim array
  congruentStim.forEach( function(stim){
    stimArray.push( [stim, "congruent"] );
  })

  // randomly pick from each pair of incongruent stimuli to add to main stim arr
  randStimPick(parityIncStim, "parityInc");
  randStimPick(magnitudeIncStim, "magnitudeInc");

  return stimArray;

  function randStimPick(arr, designation){
    arr.forEach(function(stimPair){
      stimArray.push( [stimPair[getRandomInt(2)], designation] );
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
   guaranteeing 50/50 task and task responses. */

function createStimuliTaskPairings(numTrials, tasks = "both"){
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
    let stimMag = stimClassification["m"][stim];
    let stimPar = stimClassification["p"][stim];
    // add stim to taskStim
    taskStim[stimCongruency][stimMag][stimPar].push(stim);
  })

  // ----- create stimulus-task pairings ----- //
  let stimTaskPairs = [];

  // the below code is a VERY concise object looping method to iterate over the taskStim object.
  // see https://stackoverflow.com/questions/8312459/iterate-through-object-properties
  Object.keys(taskStim).forEach(e => Object.keys(taskStim[e]).forEach( f => Object.keys(taskStim[e][f]).forEach(function(g){
    let pairShuffle = shuffle(taskStim[e][f][g]);
    stimTaskPairs.push( [pairShuffle[0], (tasks == "p") ? "p" : "m"] );
    stimTaskPairs.push( [pairShuffle[1], (tasks == "m") ? "m" : "p"] );
  })));

  return stimTaskPairs;
}

/*##################################################
  --------------  Randomize Tasks   ---------------
  ##################################################
    - Shuffles task pairings array (stimTaskPairs),
    ensuring that the following conditions are met:
      - < 4 congruency repeats in a row
      - < 4 task repetition/switch in a row
      - < 6 trials in a row w/out 3rd congruency*/
  function shuffleTaskSet(stimTaskPairs){
    //shuffle array
    do {
      stimTaskPairs = shuffle(stimTaskPairs);
    } while (!taskOrderIsOk(stimTaskPairs));
    console.log(stimTaskPairs);
  }

  function taskOrderIsOk(taskArr){
    //checks task switches and repeats to ensure enough variety.

    //define start vars
    let countTaskRepeats = 0, countTaskSwitches = 0, prevTask;

    //loop through array and count task switch/repeats
    for (let i = 0; i < taskArr.length; i++){
      if (i == 0) {  //skip the first trial
        prevTask = taskArr[i][1];
        continue;
      }

      // check if task switch/repeat and increment
      if (taskArr[i][1] == prevTask) {
        countTaskSwitches = 0;
        countTaskRepeats++;
      } else {
        countTaskRepeats = 0;
        countTaskSwitches++;
      }

      // if more than 3 switch/repeat in a row, return false
      if (countTaskSwitches > 3 || countTaskRepeats > 3){
        return false;
      }

      //prepare prevTask for next trial
      prevTask = taskArr[i][1];
    }

    //if made it this far, return true
    return true;
  }

  function taskOrderIsOk(taskArr){
    let taskString = "";

    //loop through array and count task switch/repeats
    for (let i = 0; i < taskArr.length; i++){
      taskString = taskString + taskArr[i][1]
    }

    return !( taskString.includes("mmmmm") || taskString.includes("ppppp") || taskString.includes("mpmpm") || taskString.includes("pmpmp") )
  }


/* ##################################################
   ------------ Cued Task Set Creation  -------------
   ##################################################
   - Creates Task Set Matrix for which task is done
   on each trial. */

function createCuedTaskArray(trialCount, taskInvolved = "both"){
  if (taskInvolved == "magnitude"){

    return Array(trialCount).fill("magnitude");

  } else if (taskInvolved == "parity") {

    return Array(trialCount).fill("parity");

  } else {

    // create random task orders with both tasks, making sure enough switch/repeats
    let taskSet;
    do { taskSet = createRandomArray(); }
    while (countRepeats(taskSet) < (trialCount/2 - 2) || countRepeats(taskSet) > (trialCount/2 + 2) );
    return taskSet;

  }

  function createRandomArray(){
    let a1 = Array(trialCount/2), a2 = Array(trialCount/2);
    a1.fill("magnitude"); a2.fill("parity");
    return shuffle( a1.concat(a2) );
  }

  function countRepeats(taskArr){
    let prevItem, repeatCount = 0;
    taskArr.forEach(function (item) {
      if (item == prevItem) repeatCount++;
      prevItem = item;
    });
    return repeatCount;
  }
}

// ################################################## //
// -------------- Action Set Creation --------------- //
// ################################################## //
// - based on stimulus set and cued task, what is correct response?

function createActionArray(taskStimSet, cuedTaskSet){
  let actionArr = [];
  let responseMappings = {
    odd : 122,
    even : 120,
    larger : 110,
    smaller : 109
  };

  // for each stimulus and associated task, identify required action for correct response
  taskStimSet.forEach(function(taskStim, index){
    let task = cuedTaskSet[index]
    actionArr.push(responseMappings[ stimClassification[task][taskStim] ]);
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
