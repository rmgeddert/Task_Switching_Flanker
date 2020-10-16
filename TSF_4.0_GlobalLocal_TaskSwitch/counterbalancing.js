function getBlockOrder(blockOrderNum){
  switch (blockOrderNum) {
    case 1:
      return ["A", "B", "D", "C"];
    case 2:
      return ["B", "C", "A", "D"];
    case 3:
      return ["C", "D", "B", "A"];
    case 4:
      return ["D", "A", "C", "B"];
  }
}

function getBlockCongruencies(blockLetter) {
  switch (blockLetter){
    case "A":
      return {
        switch: 0.25,
        repeat: 0.75,
        gl_con: 0.25,
        gl_inc: 0.75
      };
    case "B":
      return {
        switch: 0.75,
        repeat: 0.25,
        gl_con: 0.25,
        gl_inc: 0.75
      };
    case "C":
      return {
        switch: 0.25,
        repeat: 0.75,
        gl_con: 0.75,
        gl_inc: 0.25
      };
    case "D":
      return {
        switch: 0.75,
        repeat: 0.25,
        gl_con: 0.75,
        gl_inc: 0.25
      };
  }
}

function first_task_target(){
  if (pracOrder == 1) {
    return "large shape of the letters is";
  } else {
    return "small letters are";
  }
}

function second_task_target(){
  if (pracOrder == 1) {
    return "small letters are";
  } else {
    return "large shape of the letters is";
  }
}

function colorFirstTask(){
  if (pracOrder == 1){ //global first
    return globalColor;
  } else { // local first
    return localColor;
  }
}

function colorSecondTask(){
  if (pracOrder == 1){ //local second
    return localColor;
  } else { // global second
    return globalColor;
  }
}

function get_task_image(num){
  if (num == 1) {
    if (pracOrder == 1) { //task is global
      if (colorMapping == 1) {
        return 5; //global red
      } else {
        return 3; //global blue
      }
    } else { //task is local
      if (colorMapping == 1) {
        return 6; //local blue
      } else {
        return 4; //local red
      }
    }
  } else {
    if (pracOrder == 1) { //task is local
      if (colorMapping == 1) {
        return 6; //local blue
      } else {
        return 4; //local red
      }
    } else { //task is global
      if (colorMapping == 1) {
        return 5; //global red
      } else {
        return 3; //global blue
      }
    }
  }
}

function get_task_color(num){
  if (true) {

  }
}

function getFirstPracticeTask(){
  return (pracOrder == 1) ? "g" : "l";
}

function getSecondPracticeTask(){
  return (pracOrder == 1) ? "l" : "g";
}
