// define possivle stimuli
let congruentStim = ['11111' , '22222' , '33333' , '44444' , '666666' , '77777' , '88888' , '99999'];
let parityIncStim = [ ['22122','44144'] , ['11211','33233'] , ['22322','44344'] , ['11411','33433'] , ['77677','99699'] , ['66766','88788'] , ['77877','99899'] , ['66966','88988'] ];
let magnitudeIncStim = [ ['77177','99199'] , ['66266','88288'] , ['77377','99399'] , ['66466','88488'] , ['22622','44644'] , ['11711','33733'] , ['22822','44844'] , ['11911','33933'] ];

/* Define each stimulus in an stimulus classification objects
This stores distractor number, stim number, stim magnitude, stim parity,
and stim congruency to prevent repeats in task set.*/

let stimArray = createStimArray();
let stimTypes = {
  target: {},
  targetPar: {},
  targetMag: {},
  distractor: {},
  congruency: {}
};
defineStimulusTypes(stimArray, incongruency);

function defineStimulusTypes(inputArr){
  inputArr.forEach(function(newStim){
    // pull out target and distractor from stimulus string
    let stimTarget = newStim.slice(2,3); // target = 3rd number in string
    let stimDistractor = newStim.slice(0,1); // distractor = 1st number in string

    // add stimulus variables to stimTypes variable
    stimTypes['target'][newStim] = stimTarget;
    stimTypes['distractor'][newStim] = stimDistractor;
    stimTypes['targetPar'][newStim] = (isEven(stimTarget)) ? 'even' : 'odd';
    stimTypes['targetMag'][newStim] = (stimTarget > 5) ? 'larger' : 'smaller';
    stimTypes['congruency'][newStim] = function(incongruency){
      if incongruency = ""
    }
  })
  console.log(stimTypes);
}

function createStimArray() {
  let stimArray = [];
  
  //select stim from congruent and incongruent stim arrays and add to main stim array
  congruentStim.forEach(function(stim){stimArray.push(stim);})
  parityIncStim.forEach(function(stimPair,"parity"){
    stimArray.push(stimPair[getRandomInt(2)]);
  })
  magnitudeIncStim.forEach(function(stimPair,"parity"){
    stimArray.push(stimPair[getRandomInt(2)]);
  })

  return stimArray;
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
