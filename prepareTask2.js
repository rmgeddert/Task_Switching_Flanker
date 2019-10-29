// define possivle stimuli
let congruentStim = ['11111' , '22222' , '33333' , '44444' , '66666' , '77777' , '88888' , '99999'];
let parityIncStim = [ ['22122','44144'] , ['11211','33233'] , ['22322','44344'] , ['11411','33433'] , ['77677','99699'] , ['66766','88788'] , ['77877','99899'] , ['66966','88988'] ];
let magnitudeIncStim = [ ['77177','99199'] , ['66266','88288'] , ['77377','99399'] , ['66466','88488'] , ['22622','44644'] , ['11711','33733'] , ['22822','44844'] , ['11911','33933'] ];

function createStimArray() {
  let stimArray = [];

  //select stim from congruent and incongruent stim arrays and add to main stim array
  congruentStim.forEach( function(stim){
    stimArray.push( [stim, "congruent"] );
  })

  parityIncStim.forEach( function(stimPair){
    stimArray.push( [stimPair[getRandomInt(2)], "parityInc"] );
  })

  magnitudeIncStim.forEach( function(stimPair){
    stimArray.push( [stimPair[getRandomInt(2)], "magnitudeInc"] );
  })

  return stimArray;
}

function defineStimulusTypes(inputArr){
  // object var for storing stimulus information
  let stimTypes = {
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

    // add stimulus variables to stimTypes variable
    stimTypes['target'][stimulus] = stimTarget;
    stimTypes['distractor'][stimulus] = stimDistractor;
    stimTypes['targetPar'][stimulus] = (isEven(stimTarget)) ? 'even' : 'odd';
    stimTypes['targetMag'][stimulus] = (stimTarget > 5) ? 'larger' : 'smaller';
    stimTypes['congruency'][stimulus] = newStim[1];
  })

  return stimTypes;
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
