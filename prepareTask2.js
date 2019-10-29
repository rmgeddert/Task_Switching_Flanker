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

function createStimArray() {
  let stimArray = [];

  //each congruent stim goes into main stim array
  congruentStim.forEach( function(stim){
    stimArray.push( [stim, "congruent"] );
  })

  // randomly pick from each pair of incongruent stimuli to add to main stim arr
  loopAndAdd(parityIncStim, "parityInc");
  loopAndAdd(magnitudeIncStim, "magnitudeInc");

  return stimArray;

  function loopAndAdd(arr, designation){
    arr.forEach(function(stimPair){
      stimArray.push( [stimPair[getRandomInt(2)], designation] );
    })
  }
}

function defineStimuli(inputArr){
  // object var for storing stimulus information
  let stimDict = {
    target: {},
    targetPar: {},
    targetMag: {},
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
    stimDict['targetPar'][stimulus] = (isEven(stimTarget)) ? 'even' : 'odd';
    stimDict['targetMag'][stimulus] = (stimTarget > 5) ? 'larger' : 'smaller';
    stimDict['congruency'][stimulus] = newStim[1];
  })

  return stimDict;
}

/* ##################################################
   ---------------- Task Set Creation  --------------
   ##################################################
   - Creates trial matrix of stimuli, making sure that
   numbers aren't repeated from one trial to next and
   there aren't too many repeats of congruencies. */




/* ##################################################
   ------------ Cued Task Set Creation  -------------
   ##################################################
   - Creates Task Set Matrix for which task is done
   on each trial. */

function createCuedTaskArray(trialCount, taskInvolved = "Both"){
  if (taskInvolved == "Magnitude"){

    return Array(trialCount).fill("Magnitude");

  } else if (taskInvolved == "Parity") {

    return Array(trialCount).fill("Parity");

  } else {

    // create random task orders with both tasks, making sure enough switch/repeats
    do { let taskSet = createRandomArray(); }
    while (countRepeats(taskSet) < (trialCount/2 - 2) || countRepeats(taskSet) > (trialCount/2 + 2) );
    return taskSet;
  }

  function createRandomArray(){
    let a1 = Array(trialCount/2), a2 = Array(trialCount/2);
    a1.fill("Magnitude"); a2.fill("Parity");
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

function createActionArray(taskStim, cuedTasks){
  let actionArr = [];
  let responseMappings = {
    Parity: {
      Odd : 90,
      Even : 88
    },
    Magnitude: {
      Larger : 78,
      Smaller : 77
    }
  };

  // for each stimulus and associated task, identify required action for correct response
  stimulusArray.forEach(function(item, index) {
    let task = cuedTaskArray[index];
    actionArr.push( responseMappings[task][ stimCategories[task][item] ]);
  });

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

//random integer function
function getRandomInt(max){
  return Math.floor(Math.random() * Math.floor(max));
}
