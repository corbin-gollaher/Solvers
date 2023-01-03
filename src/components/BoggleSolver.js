import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, TextField, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Pagination from "@mui/material/Pagination";
import React, { useState } from "react";
import scrabbleWords from "../scrabbleWords";
import usePagination from "./pagination";

const M = 4;
const N = 4;

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
  const [loading, setLoading] = useState(false);
  const [validWords, setValidWords] = useState([]);
  let [page, setPage] = useState(1);
  const PER_PAGE = 24;

  const count = Math.ceil(validWords.length / PER_PAGE);
  const _DATA = usePagination(validWords, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const editBoard = (rowIndex, colIndex, letter) => {
    let boardCopy = JSON.parse(JSON.stringify(board));
    boardCopy[rowIndex][colIndex].letter = letter;
    setBoard(boardCopy);
  };

  const dfs = (i, j, str, validWords, currBoard) => {
    currBoard[i][j].visited = true;
    str = str + currBoard[i][j].letter;

    if (isWord(str) && str.length >= 3) {
      validWords.push(str);
    }

    for (var row = i - 1; row <= i + 1 && row < M; row++)
      for (var col = j - 1; col <= j + 1 && col < N; col++)
        if (row >= 0 && col >= 0 && !currBoard[row][col].visited)
          dfs(row, col, str, validWords, currBoard);

    str = "" + str[str.length - 1];
    currBoard[i][j].visited = false;
    return validWords;
  };

  const isWord = (word) => {
    return scrabbleWords.has(word);
  };

  const startDFS = () => {
    let str = "";
    let validWords = new Set();
    let boardCopy = JSON.parse(JSON.stringify(board));
    setLoading(true);
    for (let row = 0; row < boardCopy.length; row++) {
      for (let col = 0; col < boardCopy[row].length; col++) {
        dfs(row, col, "", [], boardCopy).forEach((word) =>
          validWords.add(word)
        );
      }
    }
    setLoading(false);
    setValidWords(Array.from(validWords));
  };

  return (
    <Box
      sx={{
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
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
          }}
        >
          {M && N && (
            <>
              {Array.from({ length: M }, (v, i) => i).map((row, rowIndex) => {
                return Array.from({ length: N }, (v, i) => i).map(
                  (obj, colIndex) => {
                    return (
                      <TextField
                        inputProps={{
                          style: {
                            fontSize: 40,
                            textAlign: "center",
                            padding: 0,
                          },
                          maxLength: 1,
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
        {validWords.length > 0 ? (
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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Valid Words: {validWords.length}</Typography>
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
                        <ListItem key={word} style={{ cursor: "pointer" }}>
                          <Typography>{word.toUpperCase()}</Typography>
                        </ListItem>
                      );
                    })}
                  </Box>
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        ) : (
          <Box>No Valid Words</Box>
        )}
        <Button
          variant="contained"
          color="info"
          onClick={startDFS}
          sx={{ mt: 3 }}
        >
          Solve with DFS
        </Button>
      </Box>
    </Box>
  );
}
