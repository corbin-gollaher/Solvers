import React from "react";
import { useState, useEffect } from "react";
import { TextField, Typography } from "@mui/material";
import { Button, Stack, Grid, Box } from "@mui/material";
import words from "./words";
import commonWords from "./commonWords";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoModal from "./infoModal";

export default function WsordleSolver(props) {
  const [word, setWord] = useState("");
  const [possibleCharacters, setPossibleCharacters] = useState("");
  const [alreadyGuessed, setAlreadyGuessed] = useState("");
  const [availableWords, setAvailableWords] = useState(null);
  const [suggestionWord, setSuggestionWord] = useState("");
  const [secondBestSuggestion, setSecondBestSuggestion] = useState("");
  const [thirdBestSuggestion, setThirdBestSuggestion] = useState("");
  const [possibleCharacterHistory, setPossibleCharacterHistory] = useState([]);

  const [invalidCharacters, setInvalidCharacters] = useState("");
  const [firstGuess, setFirstGuess] = useState("");
  const [secondGuess, setSecondGuess] = useState("");
  const [thirdGuess, setThirdGuess] = useState("");
  const [fourthGuess, setFourthGuess] = useState("");
  const [fifthGuess, setFifthGuess] = useState("");
  const [firstFocused, setFirstFocused] = useState(false);
  const [secondFocused, setSecondFocused] = useState(false);
  const [thirdFocused, setThirdFocused] = useState(false);
  const [fourthFocused, setFourthFocused] = useState(false);
  const [fifthFocused, setFifthFocused] = useState(false);

  const [firstColor, setFirstColor] = useState("");
  const [secondColor, setSecondColor] = useState("");
  const [thirdColor, setThirdColor] = useState("");
  const [fourthColor, setFourthColor] = useState("");
  const [fifthColor, setFifthColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [pastGuesses, setPastGuesses] = useState([]);
  const [pastColors, setPastColors] = useState([]);

  const [allAvailableChars, setAllAvailableChars] = useState(new Set());

  const clearStates = () => {
    setWord("");
    setPossibleCharacters("");
    setAlreadyGuessed("");
    setAvailableWords(null);
    setSuggestionWord("");
    setSecondBestSuggestion("");
    setThirdBestSuggestion("");
    setPossibleCharacterHistory([]);
    setAllAvailableChars(new Set());

    setFirstColor("");
    setSecondColor("");
    setThirdColor("");
    setFourthColor("");
    setFifthColor("");

    setFirstGuess("");
    setSecondGuess("");
    setThirdGuess("");
    setFourthGuess("");
    setFifthGuess("");
    setPastGuesses([]);
    setPastColors([]);
  };

  const clearColors = () => {
    setFirstColor("");
    setSecondColor("");
    setThirdColor("");
    setFourthColor("");
    setFifthColor("");

    setFirstGuess("");
    setSecondGuess("");
    setThirdGuess("");
    setFourthGuess("");
    setFifthGuess("");
  };

  const handleSubmitFunc = async () => {
    console.log("loading");
    await handleSubmit();
    console.log("done loading");
  };

  const GetBestSuggestion = (
    possibleWords,
    invalidChar,
    AvailableChars,
    commonWords
  ) => {
    let best = new Map();
    possibleWords.forEach((possibleWord) => {
      let getArray = [];
      possibleWords.forEach((wordToCheck) => {
        let invalidCharsAdded = invalidChar;
        for (let i = 0; i < wordToCheck.length; ++i) {
          if (!AvailableChars.has(possibleWord.at(i).toLowerCase())) {
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
      if (
        value < smallestSize ||
        third === "" ||
        second === "" ||
        suggestion === ""
      ) {
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
    return { suggestion, second, third };
  };

  const handleSubmit = async (e) => {
    try {
      let wordString = "";
      let colorArray = [
        firstColor,
        secondColor,
        thirdColor,
        fourthColor,
        fifthColor,
      ];
      let guessArray = [
        firstGuess,
        secondGuess,
        thirdGuess,
        fourthGuess,
        fifthGuess,
      ];

      let newPastGuesses = [...pastGuesses];
      newPastGuesses.push(guessArray);
      setPastGuesses(newPastGuesses);
      let newPastColors = [...pastColors];
      newPastColors.push(colorArray);
      setPastColors(newPastColors);

      let posChar = "";
      for (let i = 0; i < 5; ++i) {
        if (colorArray[i] === "yellow") {
          posChar = posChar + guessArray[i].toLowerCase();
          let addThese = allAvailableChars;
          addThese = addThese.add(guessArray[i].toLowerCase());
          setAllAvailableChars(addThese);
        } else {
          posChar = posChar + "-";
        }
      }
      setPossibleCharacters(posChar);

      for (let i = 0; i < 5; ++i) {
        if (colorArray[i] === "green") {
          wordString = wordString + guessArray[i].toLowerCase();
          let addThese = allAvailableChars;
          addThese = addThese.add(guessArray[i].toLowerCase());
          setAllAvailableChars(addThese);
        } else {
          wordString = wordString + "-";
        }
      }
      setWord(wordString);

      let invalidChar = alreadyGuessed;
      for (let i = 0; i < 5; ++i) {
        if (colorArray[i] === "input") {
          let possibleChars = [];
          if (
            (alreadyGuessed.indexOf(guessArray[i]) === -1 ||
              alreadyGuessed === "") &&
            posChar.indexOf(guessArray[i]) === -1 &&
            wordString.indexOf(guessArray[i] === -1)
          )
            invalidChar = invalidChar + guessArray[i].toLowerCase();
        }
      }
      setAlreadyGuessed(invalidChar);

      let possibleWords = words;
      let array = possibleCharacterHistory;
      array.push(posChar);
      setPossibleCharacterHistory(array);

      for (let i = 0; i < 5; ++i) {
        //filter already guessed characters
        let newArray = possibleWords.filter(function (str) {
          let valid = true;
          for (let i = 0; i < invalidChar.length; ++i) {
            if (str.indexOf(invalidChar.at(i)) !== -1) {
              valid = false;
            }
          }
          return valid;
        });
        possibleWords = newArray;
      }

      for (let i = 0; i < 5; ++i) {
        //make sure possible words only includes words with possible characters
        let newArray = possibleWords.filter(function (str) {
          let valid = true;
          for (let j = 0; j < array.length; ++j) {
            let value = array[j];
            for (let i = 0; i < value.length; ++i) {
              if (value.at(i) !== "-") {
                if (str.indexOf(value.at(i)) === -1) {
                  valid = false;
                }
                if (str.at(i) === value.at(i)) {
                  valid = false;
                }
              }
            }
          }
          return valid;
        });
        possibleWords = newArray;
        newArray = [];
      }

      //Rule out words without all of the words in the word, or possible characters

      let newArray = [];
      newArray = possibleWords.filter(function (str) {
        let valid = true;
        for (let i = 0; i < 5; ++i) {
          if (wordString.at(i) !== "-") {
            if (str.at(i) !== wordString.at(i)) {
              valid = false;
            }
          }
        }
        return valid;
      });
      possibleWords = newArray;
      newArray = [];

      setAvailableWords(possibleWords);

      try {
        if (possibleWords.length < 250) {
          let data = await GetBestSuggestion(
            possibleWords,
            invalidChar,
            allAvailableChars,
            commonWords
          );
          setSuggestionWord(data.suggestion);
          setSecondBestSuggestion(data.second);
          setThirdBestSuggestion(data.third);
        } else {
          let data = "";
          for (let i = 0; i < commonWords.length; ++i) {
            if (possibleWords.indexOf(commonWords[i]) !== -1) {
              data = commonWords[i];
              setSuggestionWord(data);
            }
          }
          if (data === "") {
            let first = "";
            let second = "";
            let third = "";
            for (let i = 0; i < commonWords.length; ++i) {
              if (first === "") {
                if (isUnique(possibleWords[i])) {
                  first = possibleWords[i];
                  setSuggestionWord(possibleWords[i]);
                }
              } else if (second === "") {
                if (isUnique(possibleWords[i])) {
                  second = possibleWords[i];
                  setSecondBestSuggestion(possibleWords[i]);
                }
              } else if (third === "") {
                if (isUnique(possibleWords[i])) {
                  third = possibleWords[i];
                  setThirdBestSuggestion(possibleWords[i]);
                }
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
        console.log("mapping");
      }
    } catch (err) {
      console.log(err);
      console.log("setting available words");
    }
    clearColors();
  };

  function handleKeyPress(e) {
    var key = e.keyCode;

    if (key === 8) {
      if (e.target.id === "box1") {
        setFirstGuess("");
        setFirstColor("");
        document.getElementById("box1").focus();
      }
      if (e.target.id === "box2") {
        setSecondGuess("");
        setSecondColor("");
        document.getElementById("box1").focus();
      }
      if (e.target.id === "box3") {
        setThirdGuess("");
        setThirdColor("");
        document.getElementById("box2").focus();
      }
      if (e.target.id === "box4") {
        setFourthGuess("");
        setFourthColor("");
        document.getElementById("box3").focus();
      }
      if (e.target.id === "box5") {
        setFifthGuess("");
        setFifthColor("");
        document.getElementById("box4").focus();
      }
    }
  }

  const isUnique = (str) => {
    return new Set(str).size == str.length;
  };

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 3 }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent="center"
          sx={{ width: 0.5, marginBottom: 2 }}
          textAlign="center"
        >
          <h3>Hard Mode Wordle Helper</h3>
          <InfoModal></InfoModal>
        </Stack>
        {!loading
          ? pastGuesses.map((guessArray, arrayIndex) => {
              return (
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: 0.5, marginBottom: 2 }}
                  textAlign="center"
                >
                  {guessArray.map((guessNum, index) => {
                    return (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            p: 0,
                            m: 0,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            justifyContent: "center",
                            boxShadow: 3,
                          }}
                        >
                          {pastColors[arrayIndex].at(index) === "green" ? (
                            <TextField
                              sx={{
                                width: 60,
                                "& .MuiFilledInput-root": {
                                  bgcolor: "success.main",
                                },
                              }}
                              inputProps={{
                                style: {
                                  fontSize: 40,
                                  textAlign: "center",
                                  padding: 0,
                                },
                                maxLength: 1,
                              }}
                              autoComplete="off"
                              variant="filled"
                              value={guessNum.toUpperCase()}
                              disabled
                            />
                          ) : pastColors[arrayIndex].at(index) === "input" ? (
                            <TextField
                              sx={{
                                width: 60,
                                "& .MuiFilledInput-root": {
                                  bgcolor: "secondary.main",
                                },
                              }}
                              inputProps={{
                                style: {
                                  fontSize: 40,
                                  textAlign: "center",
                                  padding: 0,
                                },
                                maxLength: 1,
                              }}
                              autoComplete="off"
                              variant="filled"
                              value={guessNum.toUpperCase()}
                              disabled
                            />
                          ) : pastColors[arrayIndex].at(index) === "yellow" ? (
                            <TextField
                              sx={{
                                width: 60,
                                "& .MuiFilledInput-root": {
                                  bgcolor: "warning.main",
                                },
                              }}
                              inputProps={{
                                style: {
                                  fontSize: 40,
                                  textAlign: "center",
                                  padding: 0,
                                },
                                maxLength: 1,
                              }}
                              autoComplete="off"
                              variant="filled"
                              value={guessNum.toUpperCase()}
                              disabled
                            />
                          ) : (
                            ""
                          )}
                        </Box>
                      </>
                    );
                  })}
                </Stack>
              );
            })
          : ""}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ width: 0.5, marginBottom: 2 }}
          textAlign="center"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: 0,
              m: 0,
              bgcolor: "background.paper",
              borderRadius: 1,
              justifyContent: "center",
            }}
          >
            {firstColor === "green" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "success.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box1"
                autoComplete="off"
                variant="filled"
                value={firstGuess.toUpperCase()}
                onChange={(e) => {
                  setFirstGuess(e.target.value);
                  setSecondFocused(true);
                  setFirstFocused(false);
                  if (e.target.value !== "") {
                    document.getElementById("box2").focus();
                  }
                  setFirstColor("input");
                }}
                autoFocus={true}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : firstColor === "input" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "secondary.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box1"
                autoComplete="off"
                variant="filled"
                value={firstGuess.toUpperCase()}
                onChange={(e) => {
                  setFirstGuess(e.target.value);
                  setSecondFocused(true);
                  setFirstFocused(false);
                  if (e.target.value !== "") {
                    document.getElementById("box2").focus();
                  }
                  setFirstColor("input");
                }}
                autoFocus={true}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : firstColor === "yellow" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "warning.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box1"
                autoComplete="off"
                variant="filled"
                value={firstGuess.toUpperCase()}
                onChange={(e) => {
                  setFirstGuess(e.target.value);
                  setSecondFocused(true);
                  setFirstFocused(false);
                  if (e.target.value !== "") {
                    document.getElementById("box2").focus();
                  }
                  setFirstColor("input");
                }}
                autoFocus={true}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : (
              <TextField
                sx={{ width: 60 }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box1"
                autoComplete="off"
                variant="filled"
                value={firstGuess.toUpperCase()}
                onChange={(e) => {
                  setFirstGuess(e.target.value);
                  setSecondFocused(true);
                  setFirstFocused(false);
                  if (e.target.value !== "") {
                    document.getElementById("box2").focus();
                  }
                  setFirstColor("input");
                }}
                autoFocus={true}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            )}
            <Button
              onClick={() => {
                if (firstColor === "input") {
                  setFirstColor("green");
                } else if (firstColor === "green") {
                  setFirstColor("yellow");
                } else {
                  setFirstColor("input");
                }
              }}
              variant="text"
              sx={{ margin: 0, padding: 0 }}
            >
              TOGGLE
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: 0,
              m: 0,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            {secondColor === "input" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "secondary.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box2"
                autoComplete="off"
                variant="filled"
                value={secondGuess.toUpperCase()}
                onChange={(e) => {
                  setSecondFocused(false);
                  setThirdFocused(true);
                  setSecondGuess(e.target.value);
                  if (e.target.value !== "") {
                    document.getElementById("box3").focus();
                  }
                  setSecondColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : secondColor === "green" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "success.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box2"
                autoComplete="off"
                variant="filled"
                value={secondGuess.toUpperCase()}
                onChange={(e) => {
                  setSecondFocused(false);
                  setThirdFocused(true);
                  setSecondGuess(e.target.value);
                  if (e.target.value !== "") {
                    document.getElementById("box3").focus();
                  }
                  setSecondColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : secondColor === "yellow" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "warning.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box2"
                autoComplete="off"
                variant="filled"
                value={secondGuess.toUpperCase()}
                onChange={(e) => {
                  setSecondFocused(false);
                  setThirdFocused(true);
                  setSecondGuess(e.target.value);
                  if (e.target.value !== "") {
                    document.getElementById("box3").focus();
                  }
                  setSecondColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : (
              <TextField
                sx={{ width: 60 }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box2"
                autoComplete="off"
                variant="filled"
                value={secondGuess.toUpperCase()}
                onChange={(e) => {
                  setSecondFocused(false);
                  setThirdFocused(true);
                  setSecondGuess(e.target.value);
                  if (e.target.value !== "") {
                    document.getElementById("box3").focus();
                  }
                  setSecondColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            )}
            <Button
              onClick={() => {
                if (secondColor === "input") {
                  setSecondColor("green");
                } else if (secondColor === "green") {
                  setSecondColor("yellow");
                } else {
                  setSecondColor("input");
                }
              }}
              variant="text"
              sx={{ margin: 0, padding: 0 }}
            >
              TOGGLE
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: 0,
              m: 0,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            {thirdColor === "input" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "secondary.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box3"
                autoComplete="off"
                variant="filled"
                value={thirdGuess.toUpperCase()}
                onChange={(e) => {
                  setThirdGuess(e.target.value);
                  setThirdFocused(false);
                  setFourthFocused(true);
                  if (e.target.value !== "") {
                    document.getElementById("box4").focus();
                  }
                  setThirdColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : thirdColor === "green" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "success.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box3"
                autoComplete="off"
                variant="filled"
                value={thirdGuess.toUpperCase()}
                onChange={(e) => {
                  setThirdGuess(e.target.value);
                  setThirdFocused(false);
                  setFourthFocused(true);
                  if (e.target.value !== "") {
                    document.getElementById("box4").focus();
                  }
                  setThirdColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : thirdColor === "yellow" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "warning.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box3"
                autoComplete="off"
                variant="filled"
                value={thirdGuess.toUpperCase()}
                onChange={(e) => {
                  setThirdGuess(e.target.value);
                  setThirdFocused(false);
                  setFourthFocused(true);
                  if (e.target.value !== "") {
                    document.getElementById("box4").focus();
                  }
                  setThirdColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : (
              <TextField
                sx={{ width: 60 }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box3"
                autoComplete="off"
                variant="filled"
                value={thirdGuess.toUpperCase()}
                onChange={(e) => {
                  setThirdGuess(e.target.value);
                  setThirdFocused(false);
                  setFourthFocused(true);
                  if (e.target.value !== "") {
                    document.getElementById("box4").focus();
                  }
                  setThirdColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            )}
            <Button
              onClick={() => {
                if (thirdColor === "input") {
                  setThirdColor("green");
                } else if (thirdColor === "green") {
                  setThirdColor("yellow");
                } else {
                  setThirdColor("input");
                }
              }}
              variant="text"
              sx={{ margin: 0, padding: 0 }}
            >
              TOGGLE
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: 0,
              m: 0,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            {fourthColor === "input" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "secondary.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box4"
                autoComplete="off"
                variant="filled"
                value={fourthGuess.toUpperCase()}
                onChange={(e) => {
                  setFourthGuess(e.target.value);
                  setFourthFocused(false);
                  setFifthFocused(true);
                  if (e.target.value !== "") {
                    document.getElementById("box5").focus();
                  }
                  setFourthColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : fourthColor === "green" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "success.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box4"
                autoComplete="off"
                variant="filled"
                value={fourthGuess.toUpperCase()}
                onChange={(e) => {
                  setFourthGuess(e.target.value);
                  setFourthFocused(false);
                  setFifthFocused(true);
                  if (e.target.value !== "") {
                    document.getElementById("box5").focus();
                  }
                  setFourthColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : fourthColor === "yellow" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "warning.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box4"
                autoComplete="off"
                variant="filled"
                value={fourthGuess.toUpperCase()}
                onChange={(e) => {
                  setFourthGuess(e.target.value);
                  setFourthFocused(false);
                  setFifthFocused(true);
                  if (e.target.value !== "") {
                    document.getElementById("box5").focus();
                  }
                  setFourthColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : (
              <TextField
                sx={{ width: 60 }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box4"
                autoComplete="off"
                variant="filled"
                value={fourthGuess.toUpperCase()}
                onChange={(e) => {
                  setFourthGuess(e.target.value);
                  setFourthFocused(false);
                  setFifthFocused(true);
                  if (e.target.value !== "") {
                    document.getElementById("box5").focus();
                  }
                  setFourthColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            )}
            <Button
              onClick={() => {
                if (fourthColor === "input") {
                  setFourthColor("green");
                } else if (fourthColor === "green") {
                  setFourthColor("yellow");
                } else {
                  setFourthColor("input");
                }
              }}
              variant="text"
              sx={{ margin: 0, padding: 0 }}
            >
              TOGGLE
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: 0,
              m: 0,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            {fifthColor === "input" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "secondary.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box5"
                autoComplete="off"
                variant="filled"
                value={fifthGuess.toUpperCase()}
                onChange={(e) => {
                  setFifthGuess(e.target.value);
                  setFirstFocused(true);
                  setFifthFocused(false);
                  setFifthColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : fifthColor === "green" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "success.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box5"
                autoComplete="off"
                variant="filled"
                value={fifthGuess.toUpperCase()}
                onChange={(e) => {
                  setFifthGuess(e.target.value);
                  setFirstFocused(true);
                  setFifthFocused(false);
                  setFifthColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : fifthColor === "yellow" ? (
              <TextField
                sx={{
                  width: 60,
                  "& .MuiFilledInput-root": {
                    bgcolor: "warning.main",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box5"
                autoComplete="off"
                variant="filled"
                value={fifthGuess.toUpperCase()}
                onChange={(e) => {
                  setFifthGuess(e.target.value);
                  setFirstFocused(true);
                  setFifthFocused(false);
                  setFifthColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            ) : (
              <TextField
                sx={{ width: 60 }}
                inputProps={{
                  style: {
                    fontSize: 40,
                    textAlign: "center",
                    padding: 0,
                  },
                  maxLength: 1,
                }}
                id="box5"
                autoComplete="off"
                variant="filled"
                value={fifthGuess.toUpperCase()}
                onChange={(e) => {
                  setFifthGuess(e.target.value);
                  setFirstFocused(true);
                  setFifthFocused(false);
                  setFifthColor("input");
                }}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            )}
            <Button
              onClick={() => {
                if (fifthColor === "input") {
                  setFifthColor("green");
                } else if (fifthColor === "green") {
                  setFifthColor("yellow");
                } else {
                  setFifthColor("input");
                }
              }}
              variant="text"
              sx={{ margin: 0, padding: 0 }}
            >
              TOGGLE
            </Button>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            p: 0,
            m: 0,
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
        >
          <Button
            onClick={() => {
              handleSubmitFunc();
              document.getElementById("box1").focus();
            }}
            variant="contained"
            id="getSuggestion"
            sx={{ marginRight: 2 }}
            color="info"
          >
            Get Suggestion
          </Button>
          <Button
            onClick={() => {
              clearStates();
              document.getElementById("box1").focus();
            }}
            variant="contained"
            color="info"
          >
            I Got It!
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {suggestionWord !== "" ? (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  margin: 2,
                  boxShadow: 3,
                }}
              >
                <nav aria-label="secondary mailbox folders">
                  <List>
                    <ListItem disablePadding key={suggestionWord}>
                      <ListItemButton>
                        <ListItemText
                          primary={
                            suggestionWord !== ""
                              ? `Suggestion 1: ${suggestionWord.toUpperCase()}`
                              : ""
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding key={secondBestSuggestion}>
                      <ListItemButton component="a" href="#simple-list">
                        <ListItemText
                          primary={
                            secondBestSuggestion !== ""
                              ? `Suggestion 2: ${secondBestSuggestion.toUpperCase()}`
                              : ""
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding key={thirdBestSuggestion}>
                      <ListItemButton component="a" href="#simple-list">
                        <ListItemText
                          primary={
                            thirdBestSuggestion !== ""
                              ? `Suggestion 3: ${thirdBestSuggestion.toUpperCase()}`
                              : ""
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </nav>
              </Box>
            ) : (
              ""
            )}

            {availableWords ? (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  boxShadow: 3,
                }}
              >
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Available Words</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography paragraph>
                      {availableWords ? "Available Words: " : ""}
                      {availableWords?.map((word) => {
                        return word + " ";
                      })}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            ) : (
              ""
            )}
          </>
        )}
      </Grid>
    </>
  );
}
