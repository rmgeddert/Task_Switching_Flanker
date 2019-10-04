function prepare(){
  loadImages();
};

function loadImages(){
  var imgFile = listImageNames;
  var imgArr = new Array(imgFile.length);
  var imgCount = 0;

  // load images from images.js into local array imgArr
  while (imgCount < imgFile.length){
    imgArr[imgCount] = new Image();
    imgArr[imgCount].src = imgFile[imgCount];
    imgCount++;
  }

  // randomizes image array
  // NTS: this could probably be done by just randomizing imgArr without creating an entire new function.... will see what happens as code gets written.
  imgArr.forEach((item,index) => random_img.push(item));
  shuffle(random_img);
};

function make_stim_array(){
  stimChoices = [1,2,3,4,6,7,8,9];
  stimArray = [];
  stimChoices.forEach(function (item,index) {

  });

};


// Fisher-Yates shuffle
function shuffle(array){
  for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
  return array;
}
