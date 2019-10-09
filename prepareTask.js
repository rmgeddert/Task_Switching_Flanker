let myArray = createStimArray();
let cuedTaskArray = createCuedTaskArray();

// ------------- Stimulus ------------- //
function createStimArray(){
  let targetChoices = [1,2,3,4,6,7,8,9];
  let distractorChoices = [1,2,3,4,6,7,8,9];
  let stimCategories = {}; stimArray = [];

  /* create all possible target/distractor combinations and store
  their ActionClass in object variable for later reference */
  targetChoices.forEach(function(target){
    distractorChoices.forEach(function(distractor) {
      stimCategories[createStimulus(target,distractor)] = checkActionClass(target,distractor);
      stimArray.push(createStimulus(target,distractor));
    });
  });

  /* shuffle stimuli, making sure there are enough switches
  between congruency types */
  do {shuffle(stimArray);} while (countSwitches(stimArray) < 45)
  return stimArray;

  // creates five item stimulus given center and outer inputs
  function createStimulus(center,outer) {
    return String(outer) + String(outer) + String(center) + String(outer) + String(outer);
  }

  // checks item parities and magnitudes and returns class
  function checkActionClass(item1, item2){
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

  // make sure there are enough enough switches and repeats between congruency types.
  function countSwitches(inputArr) {
    let prevItem, switchCount = 0
    inputArr.forEach(function(item) {
      if (stimCategories[item] != prevItem) {switchCount++;}
      prevItem = stimCategories[item];
    });
    return switchCount
  }
}

// ------------- Cued Task ------------- //
function createCuedTaskArray(){
  let actionSet = [];
  do { actionSet = createRandomArray();} while (countRepeats(actionSet) < 30 || countRepeats(actionSet) > 34);
  return actionSet;

  function createRandomArray(){
    let a1 = Array(32); a2 = Array(32);
    a1.fill(0); a2.fill(1);
    return shuffle(a1.concat(a2));
  }

  function countRepeats(taskArr){
    let prevItem = 2, repeatCount = 0 // 2 != 1 or 0 for first check
    taskArr.forEach(function (item) {
      if (item == prevItem) repeatCount++;
      prevItem = item;
    });
    return repeatCount;
  }
}

// ------------- Action (based on stimulus and task) ------------- //



// Fisher-Yates shuffle
function shuffle(array){
  for(let j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
  return array;
}

// isEven Function for stimulus categorization
function isEven(n) {return n % 2 == 0;}
