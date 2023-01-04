import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BoggleSolver from "./components/BoggleSolver";
import { Home } from "./components/Home";
import WsordleSolver from "./components/solver";

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
            <Route path="*" element={<Home />}></Route>
          </Routes>
          <BottomFooter />
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
