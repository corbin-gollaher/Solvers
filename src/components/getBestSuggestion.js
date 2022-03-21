export default function getBestSuggestion(possibleWords, invalidChar, allAvailableChars, commonWords) {
  let best = new Map();
  possibleWords.forEach((possibleWord) => {
    let getArray = [];
    possibleWords.forEach((wordToCheck) => {
      let invalidCharsAdded = invalidChar;
      for (let i = 0; i < wordToCheck.length; ++i) {
        if (!allAvailableChars.has(possibleWord.at(i).toLowerCase())) {
          invalidCharsAdded = invalidCharsAdded.concat(wordToCheck.at(i));
        }
      }
      for (let i = 0; i < 5; ++i) {
        //filter already guessed characters
        getArray = possibleWords.filter(function (str) {
          let valid = true;
          for (let i = 0; i < invalidCharsAdded.length; ++i) {
            if (str.indexOf(invalidCharsAdded.at(i)) !== -1) {
              valid = false;
            }
          }
          return valid;
        });
      }
      best.set(wordToCheck, getArray.length);
    });
  });

  let smallestSize = 15000;
  let suggestion = "";
  let second = "";
  let third = "";
  best.forEach((value, key) => {
    if (value < smallestSize || third === "" || second === "" || suggestion === "") {
      third = second;
      second = suggestion;
      suggestion = key;
      smallestSize = value;
    } else if (value === smallestSize) {
      let keyBoolean = false;
      let suggestionBoolean = false;
      commonWords.forEach((item) => {
        if (item === key) {
          keyBoolean = true;
        }
        if (item === suggestion) {
          suggestionBoolean = true;
        }
      });

      if (keyBoolean && !suggestionBoolean) {
        third = second;
        second = suggestion;
        suggestion = key;
      }
      smallestSize = value;
    }
  });
  console.log(best);
  return {suggestion, second, third}
}
