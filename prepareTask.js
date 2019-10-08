let stimArray = createStimArray();
let actionArray = createActionArray();

function createStimArray(){
  //makes a set of 64 randomized stimuli using 1-9 exclude 5
  let stimChoices = ['1','2','3','4','6','7','8','9'];
  let distractorChoices = ['1','2','3','4','6','7','8','9'];
  let stimArray = [];
  stimChoices.forEach(function (stim,index) {
    distractorChoices.forEach(function (distractor, index){
      stimArray.push(distractor + distractor + stim + distractor + distractor);
    });
  });
  return shuffle(stimArray);
}

function createActionArray(){
  let actionSet = [];
  do { actionSet = createRandomkArray();} while (countRepeats(actionSet) < 30 || countRepeats(actionSet) > 34);
  console.log(actionSet);
  // return actionSet;

  function createRandomkArray(){
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

// Fisher-Yates shuffle
function shuffle(array){
  for(let j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
  return array;
}
