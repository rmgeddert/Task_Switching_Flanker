function prepare(){

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
  random_img = []
  for (var g=0;g < imgFile.length;g++) {
    random_img.push(g);
  }

  shuffle(random_img);
}

function make_stim_array{

}


// Fisher-Yates shuffle
function shuffle(array){
  for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
  return array;
}
