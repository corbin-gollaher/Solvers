import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  CircularProgress,
  Link,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import List from "@mui/material/List";
import Pagination from "@mui/material/Pagination";
import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import { scrabbleWords } from "../scrabbleWords";
import usePagination from "./pagination";
import { Trie } from "./Trie";
const M = 4;
const N = 4;

const trie = new Trie();
scrabbleWords.forEach((word) => trie.insert(word));

export default function BoggleSolver() {
  const [board, setBoard] = useState([
    [
      { letter: "o", visited: false },
      { letter: "e", visited: false },
      { letter: "n", visited: false },
      { letter: "s", visited: false },
    ],
    [
      { letter: "o", visited: false },
      { letter: "r", visited: false },
      { letter: "t", visited: false },
      { letter: "m", visited: false },
    ],
    [
      { letter: "r", visited: false },
      { letter: "i", visited: false },
      { letter: "n", visited: false },
      { letter: "m", visited: false },
    ],
    [
      { letter: "l", visited: false },
      { letter: "e", visited: false },
      { letter: "n", visited: false },
      { letter: "a", visited: false },
    ],
  ]);
  const [smallestToLargest, setSmallestToLargest] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage64, setSelectedImage64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [validWords, setValidWords] = useState([]);
  const [currSelection, setCurrSelection] = useState(null);
  const [imageText, setImageText] = useState("");
  let [page, setPage] = useState(1);
  const PER_PAGE = 24;

  const count = Math.ceil(validWords.length / PER_PAGE);
  const _DATA = usePagination(validWords, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const editBoard = (rowIndex, colIndex, letter) => {
    letter = letter.toLowerCase();
    if (board[rowIndex][colIndex].letter === "qu" && letter === "q") {
      letter = "";
    } else if (letter === "q") {
      letter = "qu";
    }
    let boardCopy = JSON.parse(JSON.stringify(board));
    boardCopy[rowIndex][colIndex].letter = letter;
    setBoard(boardCopy);
  };

  const editBoardTess = (text) => {
    text = text.toLowerCase();
    let boardCopy = JSON.parse(JSON.stringify(board));
    let currIndex = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        text = text.toLowerCase();
        if (board[row][col].letter === "qu" && text === "q") {
          text = "";
        } else if (text === "q") {
          text = "qu";
        }
        boardCopy[row][col].letter = text[currIndex];
        if (col === 3) {
          currIndex += 2;
        } else {
          currIndex += 1;
        }
      }
    }
    setBoard(boardCopy);
  };

  const dfs = (i, j, store, validWords, currBoard) => {
    currBoard[i][j].visited = true;

    let str = store.str;

    store = {
      str: str + currBoard[i][j].letter,
      coordinates: [...store.coordinates, `${i}${j}`],
    };

    if (isWord(store.str) && store.str.length >= 3) {
      validWords.push(JSON.parse(JSON.stringify(store)));
    }

    if (trie.find(store.str).length > 0) {
      for (var row = i - 1; row <= i + 1 && row < M; row++)
        for (var col = j - 1; col <= j + 1 && col < N; col++)
          if (row >= 0 && col >= 0 && !currBoard[row][col].visited)
            dfs(row, col, store, validWords, currBoard);
    }

    if (store.str.length >= 2) {
      if (
        store.str[store.str.length - 1] === "u" &&
        store.str[store.str.length - 2] === "q"
      ) {
        store.str = "" + store.str[store.str.length - 2];
      } else {
        store.str = "" + store.str[store.str.length - 1];
      }
    } else {
      store.str = "" + store.str[store.str.length - 1];
    }

    store.coordinates.pop();
    currBoard[i][j].visited = false;
    return validWords;
  };

  const isWord = (word) => {
    return trie.contains(word).contained;
  };

  const sortResultsAndSave = (arr) => {
    setValidWords(
      arr.sort((a, b) => {
        if (smallestToLargest) {
          return a.str.length - b.str.length || a.str.localeCompare(b.str);
        } else {
          return b.str.length - a.str.length || a.str.localeCompare(b.str);
        }
      })
    );
    setSmallestToLargest(!smallestToLargest);
  };

  const startDFS = () => {
    setPage(1);
    setValidWords([]);
    setCurrSelection(null);
    let str = "";
    let validWords = [];
    let boardCopy = JSON.parse(JSON.stringify(board));
    setLoading(true);
    for (let row = 0; row < boardCopy.length; row++) {
      for (let col = 0; col < boardCopy[row].length; col++) {
        dfs(row, col, { str: "", coordinates: [] }, [], boardCopy).forEach(
          (word) => validWords.push(word)
        );
      }
    }
    validWords = validWords.reduce(function (p, c) {
      if (
        !p.some(function (el) {
          return el.str === c.str;
        })
      )
        p.push(c);
      return p;
    }, []);
    setLoading(false);
    sortResultsAndSave(Array.from(validWords));
    setTotalPoints(getTotalPoints(Array.from(validWords)));
  };

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const getTotalPoints = (arr) => {
    let total = 0;
    arr.forEach((x) => {
      if (x.str.length >= 8) {
        total += 11;
      } else if (x.str.length >= 7) {
        total += 4;
      } else if (x.str.length >= 6) {
        total += 3;
      } else if (x.str.length >= 5) {
        total += 2;
      } else if (x.str.length >= 3) {
        total += 1;
      }
    });
    return total;
  };

  const generateRandomBoard = () => {
    setValidWords([]);
    setCurrSelection(null);
    let distributions = shuffle([
      "aaafrs",
      "aaeeee",
      "aafirs",
      "adennn",
      "aeeeem",
      "aeegmu",
      "aegmnn",
      "afirsy",
      "bjkqxz",
      "ccenst",
      "ceiilt",
      "ceilpt",
      "ceipst",
      "ddhnot",
      "dhhlor",
      "dhlnor",
      "dhlnor",
      "eiiitt",
      "emottt",
      "ensssu",
      "fiprsy",
      "gorrvw",
      "iprrry",
      "nootuw",
      "ooottu",
    ]);
    let newBoard = Array.from({ length: M }, (v, i) => i).map((row, rowIndex) =>
      Array.from({ length: N }, (v, i) => {
        let currLetter =
          distributions[(rowIndex + 1) * 4 + i][
            Math.floor(
              Math.random() * distributions[(rowIndex + 1) * 4 + i].length
            )
          ];
        return {
          letter: currLetter === "q" ? currLetter + "u" : currLetter,
          visited: false,
        };
      })
    );
    setBoard(newBoard);
  };

  const tesseract = async () => {
    const worker = await createWorker({
      logger: (m) => console.log(m),
    });

    (async () => {
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      await worker.setParameters({
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        preserve_interword_spaces: "0",
      });
      const {
        data: { text },
      } = await worker.recognize(selectedImage64);

      setImageText(text);

      if (text.length === 20) {
        editBoardTess(text);
      }

      await worker.terminate();
    })();
  };

  function getBase64(file) {
    var reader = new FileReader();
    file.filter = "grayscale(100%)";

    reader.readAsDataURL(file);
    reader.onload = function () {
      setSelectedImage64(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  return (
    <Box
      sx={{
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
        }}
      >
        <Typography variant="h5" sx={{ m: 2 }}>
          DFS Boggle Solver
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            mb: 2,
          }}
        >
          {M && N && (
            <>
              {Array.from({ length: M }, (v, i) => i).map((row, rowIndex) => {
                return Array.from({ length: N }, (v, i) => i).map(
                  (obj, colIndex) => {
                    return (
                      <TextField
                        sx={{
                          cursor: "pointer",
                          "& .MuiFilledInput-root": {
                            bgcolor: !currSelection
                              ? ""
                              : currSelection.coordinates.includes(
                                  `${rowIndex}${colIndex}`
                                )
                              ? "success.main"
                              : "",
                          },
                          m: 0.5,
                        }}
                        variant="filled"
                        inputProps={{
                          style: {
                            fontSize: 40,
                            textAlign: "center",
                            padding: 0,
                          },
                          maxLength: 2,
                        }}
                        value={board[rowIndex][colIndex].letter}
                        onChange={(e) =>
                          editBoard(rowIndex, colIndex, e.target.value)
                        }
                      ></TextField>
                    );
                  }
                );
              })}
            </>
          )}
        </Box>
        {currSelection && (
          <Link
            href={`https://www.collinsdictionary.com/dictionary/english/${currSelection.str}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Click Here for Selected Word Definition
          </Link>
        )}
        {validWords.length > 0 ? (
          <Box
            sx={{
              bgcolor: "background.paper",
              boxShadow: 3,
              mt: 2,
              mb: 3,
            }}
          >
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Typography>
                  <strong>
                    Valid Words: {validWords.length} Total Points: {totalPoints}
                  </strong>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Pagination
                  count={count}
                  size="small"
                  page={page}
                  onChange={handleChange}
                  color="success"
                />

                <List p="15" pt="3" spacing={2}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                    }}
                  >
                    {_DATA.currentData().map((word) => {
                      return (
                        <ListItemButton
                          key={word.str}
                          style={{ cursor: "pointer" }}
                          onClick={() => setCurrSelection(word)}
                        >
                          <Typography>{word.str.toUpperCase()}</Typography>
                        </ListItemButton>
                      );
                    })}
                  </Box>
                </List>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    sortResultsAndSave(validWords);
                  }}
                >
                  Sort by
                  {smallestToLargest ? " increasing size" : " decreasing size"}
                </Button>
              </AccordionDetails>
            </Accordion>
          </Box>
        ) : (
          <Box>No Valid Words</Box>
        )}
        <Box
          sx={{
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 3,
            mt: 2,
            mb: 3,
          }}
        >
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Typography>
                <strong>Boggle Board Image Recognition</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ textAlign: "left" }}>
                <Typography sx={{ mb: 2 }} variant="body" textAlign={"left"}>
                  Upload an image to get started, currently, the only images
                  that work at all really are images of typed text with no skew,
                  no background, and no borders. The goal is to hopefully expand
                  functionality to take a picture of your boggle game, and have
                  it autopopulate the solver. If the picture works as expected
                  with the recognition, then it will autopopulate the board
                  above
                </Typography>
              </Box>
              <div style={{ marginTop: 20 }}>
                {selectedImage ? (
                  <div>
                    <img
                      alt="not fount"
                      width={"250px"}
                      src={URL.createObjectURL(selectedImage)}
                    />
                    <br />
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => {
                        setSelectedImage(null);
                        setSelectedImage64(null);
                        setImageText("");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <input
                    type="file"
                    name="myImage"
                    onChange={(event) => {
                      setSelectedImage(event.target.files[0]);
                      getBase64(event.target.files[0]);
                    }}
                  />
                )}
              </div>
              {selectedImage64 && imageText === "" ? (
                <Button
                  variant="contained"
                  color="info"
                  onClick={tesseract}
                  sx={{ m: 3 }}
                >
                  Analyze Image
                </Button>
              ) : (
                <Box>
                  {imageText !== "" && (
                    <Typography sx={{ mt: 3 }}>
                      Analyzed Text: {imageText}
                    </Typography>
                  )}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>

        <Button
          variant="contained"
          color="info"
          onClick={startDFS}
          sx={{ mt: 3, m: 1, mb: 5 }}
        >
          Solve with DFS
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={generateRandomBoard}
          sx={{ mt: 3, m: 1, mb: 5 }}
        >
          Random Board
        </Button>
        {loading && <CircularProgress fontSize="inherit" />}
      </Box>
    </Box>
  );
}
