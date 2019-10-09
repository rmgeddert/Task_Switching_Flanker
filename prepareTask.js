/* These scripts create the randomized stimulus, cued Task,
and required action/correct response arrays, as well as creating
a stimCategories array that identifies flanker congruency types. */

// ------------- Stimulus ------------- //
function createStimArray(){
  let targetChoices = [1,2,3,4,6,7,8,9];
  let distractorChoices = [1,2,3,4,6,7,8,9];
  let stimArray = [];

  /* create all possible target/distractor combinations and store
  their congruency class in object variable for later reference */
  targetChoices.forEach( function(target){
    distractorChoices.forEach( function(distractor) {
      let newStim = createStimulus(target,distractor);
      stimCategories["Parity"][newStim] = (isEven(target)) ? "Even" : "Odd";
      stimCategories["Magnitude"][newStim] = (target > 5) ? "Larger" : "Smaller";
      stimCategories["CongruencyClass"][newStim] = checkCongruencyClass(target, distractor);
      stimArray.push(newStim);
    });
  });

  /* shuffle stimuli, making sure there are enough switches
  between congruency types, then return stimArray */
  do {shuffle(stimArray);} while (countSwitches(stimArray) < 45);
  return stimArray;

  // creates five item stimulus given center and outer inputs
  function createStimulus(center,outer) {
    return String(outer) + String(outer) + String(center) + String(outer) + String(outer);
  }

  function checkCongruencyClass(item1, item2){
    if (isEven(item1) == isEven(item2)){
      if ((item1 > 5) == (item2 > 5)) {
        return "Both Congruent";
      } else {
        return "Magnitude Incongruent";
      }
    } else {
      if ((item1 > 5) == (item2 > 5)) {
        return "Parity Incongruent";
      } else {
        return "Both Incongruent";
      }
    }
  }

  // count number of switches in stimulus array
  function countSwitches(inputArr) {
    let prevItem, currItem, switchCount = -1;
    /*prevItem is undefined during the first iteration, so currItem != prevItem
    is always true. switchCount starts at -1 to compensate for this "switch" */
    inputArr.forEach(function(item) {
      currItem = stimCategories["CongruencyClass"][item]
      if ( currItem != prevItem) switchCount++;
      prevItem = currItem;
    });
    return switchCount;
  }
}

// ------------- Cued Task ------------- //
function createCuedTaskArray(){
  let taskSet = [];

  // create random task orders, making sure enough switch/repeats
  do { taskSet = createRandomArray(); }
  while (countRepeats(taskSet) < 30 || countRepeats(taskSet) > 34);
  return taskSet;

  function createRandomArray(){
    let a1 = Array(32), a2 = Array(32);
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

// ------------- Action (based on stimulus and task) ------------- //
function createActionArray(){
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
