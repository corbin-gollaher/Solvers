import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import BoggleSolver from "./components/BoggleSolver";
import WsordleSolver from "./components/solver";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Box, Typography } from "@mui/material";

import BottomFooter from "./components/BottomFooter";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(0 0 0)",
    },
    secondary: {
      main: "rgb(120,124,126)",
    },
    success: {
      main: "rgb(106,170,100)",
    },
    warning: {
      main: "rgb(208, 180, 88)",
    },
    info: {
      main: "rgb(211 214 218)",
    },
  },
  components: {
    TextArea: {
      styleOverrides: {},
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <BottomFooter />,
  },
  {
    path: "/WordleSolver",
    element: (
      <ThemeProvider theme={theme}>
        <WsordleSolver></WsordleSolver>
      </ThemeProvider>
    ),
  },
  {
    path: "/",
    element: (
      <ThemeProvider theme={theme}>
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
            <Typography variant="h6">BurntToast05 Solvers</Typography>
            <Link to={"/WordleSolver"}>Wordle Solver Here</Link>
            <Link to={"/BoggleSolver"}>Boggle Solver Here</Link>
          </Box>
        </Box>
      </ThemeProvider>
    ),
  },
  {
    path: "/BoggleSolver",
    element: (
      <ThemeProvider theme={theme}>
        <BoggleSolver></BoggleSolver>
      </ThemeProvider>
    ),
  },
]);

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/WordleSolver"
              element={<WsordleSolver></WsordleSolver>}
            ></Route>
            <Route
              path="/BoggleSolver"
              element={<BoggleSolver></BoggleSolver>}
            ></Route>
            <Route
              path="/"
              element={
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
                    <Typography variant="h6">BurntToast05 Solvers</Typography>
                    <Link to={"/WordleSolver"}>Wordle Solver Here</Link>
                    <Link to={"/BoggleSolver"}>Boggle Solver Here</Link>
                  </Box>
                </Box>
              }
            ></Route>
          </Routes>
          <BottomFooter />
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
