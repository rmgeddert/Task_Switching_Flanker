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
        fl_con: 0.25,
        fl_inc: 0.75
      };
    case "B":
      return {
        switch: 0.75,
        repeat: 0.25,
        fl_con: 0.25,
        fl_inc: 0.75
      };
    case "C":
      return {
        switch: 0.25,
        repeat: 0.75,
        fl_con: 0.75,
        fl_inc: 0.25
      };
    case "D":
      return {
        switch: 0.75,
        repeat: 0.25,
        fl_con: 0.75,
        fl_inc: 0.25
      };
  }
}

function getTaskInstruction(hand, identifier){
  if (hand == "right") {
    switch (taskMapping){
      case 1:
      case 3:
        return (identifier == 1) ? "greater than 5" : "less than 5";
      case 2:
      case 4:
        return (identifier == 1) ? "less than 5" : "greater than 5";
      case 5:
      case 7:
        return (identifier == 1) ? "odd" : "even";
      case 6:
      case 8:
        return (identifier == 1) ? "even" : "odd";
    }
  } else {
    switch (taskMapping){
      case 1:
      case 2:
        return (identifier == 1) ? "odd" : "even";
      case 3:
      case 4:
        return (identifier == 1) ? "even" : "odd";
      case 5:
      case 6:
        return (identifier == 1) ? "less than 5" : "greater than 5";
      case 7:
      case 8:
        return (identifier == 1) ? "greater than 5" : "less than 5";
    }
  }
}

function getHand(identifier){
  if (pracOrder == 1){ //if mag task first
    if (identifier == 1) { //first hand
      return (taskMapping <= 4) ? "right" : "left"; //is mag right or left
    } else if (identifier == 2){ //second hand
      return (taskMapping <= 4) ? "left" : "right";
    }
  } else { //if par task first
    if (identifier == 1) { //first hand
      return (taskMapping <= 4) ? "left" : "right"; //is par right or left
    } else if (identifier == 2){ //second hand
      return (taskMapping <= 4) ? "right" : "left";
    }
  }
}

function getLetter(hand, identifier){
  if (hand == "right") { //first hand
    return (identifier == 1) ? "N" : "M";
  } else {
    return (identifier == 1) ? "Z" : "X";
  }
}

function getFinger(hand, identifier){
  if (hand == "right") { //first hand
    return (identifier == 1) ? "index" : "middle";
  } else {
    return (identifier == 1) ? "middle" : "index";
  }
}

function getHandImageNum(identifier){
  if (pracOrder == 1){ //if mag task first
    if (identifier == 1) { //first hand
      return (taskMapping <= 4) ? 3 : 4; //is mag right or left
    } else if (identifier == 2){ //second hand
      return (taskMapping <= 4) ? 4 : 3;
    }
  } else { //if par task first
    if (identifier == 1) { //first hand
      return (taskMapping <= 4) ? 4 : 3; //is par right or left
    } else if (identifier == 2){ //second hand
      return (taskMapping <= 4) ? 3 : 4;
    }
  }
}

function colorFirstTask(){
  if (pracOrder == 1){ //mag first
    return magColor();
  } else { // par first
    return parColor();
  }
}

function colorSecondTask(){
  if (pracOrder == 1){ //mag first
    return parColor();
  } else { // par first
    return magColor();
  }
}

function magColor(){
  return (colorMapping == 1) ? "red" : "blue";
}

function parColor(){
  return (colorMapping == 1) ? "blue" : "red";
}

function getFirstPracticeTask(){
  return (pracOrder == 1) ? "m" : "p";
}

function getSecondPracticeTask(){
  return (pracOrder == 1) ? "p" : "m";
}
