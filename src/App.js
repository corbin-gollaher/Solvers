import { createTheme, ThemeProvider } from "@mui/material/styles";
import WsordleSolver from "./components/solver";

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
        <WsordleSolver></WsordleSolver>{" "}
        {/* <WordleSolverRework></WordleSolverRework> */}
      </ThemeProvider>
    </div>
  );
}

export default App;
