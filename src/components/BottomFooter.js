import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import LinkIcon from "@mui/icons-material/Link";
import { useNavigate } from "react-router-dom";

export default function BottomFooter() {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  let navigate = useNavigate();

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            if (newValue === 0) {
              navigate("/WordleSolver");
            }
            if (newValue === 1) {
              navigate("/BoggleSolver");
            }
          }}
        >
          <BottomNavigationAction label="Wordle" icon={<LinkIcon />} />
          <BottomNavigationAction label="Boggle" icon={<LinkIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
