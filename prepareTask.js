function prepare(){
  //loadImages();
  makeStimArray();
  makeActionArray();
  console.log()
};

function loadImages(){
  let imgFile = listImageNames;
  let imgArr = new Array(imgFile.length);
  let imgCount = 0;

  // load images from images.js into local array imgArr
  while (imgCount < imgFile.length){
    imgArr[imgCount] = new Image();
    imgArr[imgCount].src = imgFile[imgCount];
    imgCount++;
  }

  // randomizes image array
  // NTS: this could probably be done by just randomizing imgArr without creating an entire new variable.... we'll see
  let random_img = [];
  imgArr.forEach((item,index) => random_img.push(item));
  shuffle(random_img);
};

function makeStimArray(){
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
};

function makeActionArray(){
  // makes a set of 64 actions (0 or 1) with a range of repeats.
  let actionSet = [];
  while (countRepeats(actionSet) < 30 || countRepeats(actionSet) > 34) {
    actionSet = makeCuedTaskArray();
  };

  function makeCuedTaskArray(){
    let a1 = Array(32); a2 = Array(32); a1.fill(0); a2.fill(1);
    return shuffle(a1.concat(a2));
  }

  function countRepeats(taskArr){
    let prevItem = 2, repeatCount = 0 // 2 != 1 or 0 for first check
    taskArr.forEach(function (item) {
      if(item == prevItem){repeatCount++};
      prevItem = item;
    });
    return repeatCount;
  };
}


// Fisher-Yates shuffle
function shuffle(array){
  for(let j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
  return array;
};
