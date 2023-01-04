import { Box, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export function Home({}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        mt: 5,
      }}
    >
      <Box
        sx={{
          display: "grid",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h6">Corbin Gollaher Game Solvers</Typography>
        <Link to={"/WordleSolver"}>Wordle Solver Here</Link>
        <Link to={"/BoggleSolver"}>Boggle Solver Here</Link>
        <Typography>More to come maybe?</Typography>
      </Box>
    </Box>
  );
}
