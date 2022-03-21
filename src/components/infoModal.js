import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { InfoOutlined } from "@mui/icons-material";
import Link from "@mui/material/Link";
import { Divider } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function InfoModal() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Information" onClick={handleClickOpen}>
        <IconButton>
          <InfoOutlined fontSize="medium" />
        </IconButton>
      </Tooltip>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Information{" "}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom variant="h6">
            How does it work?
          </Typography>
          <Typography gutterBottom>
            The solver will pull from available words from a 12,000 word bank.
            Common words take precedence over lesser known words, and the
            suggestions will create the smallest possible set of resulting
            words.
          </Typography>
          <Divider />
          <Typography sx={{ mt: 2 }} gutterBottom variant="h6">
            What limitations does it have?
          </Typography>
          <Typography gutterBottom>
            Since it is meant to be a 'Hard mode' solver, it only gives
            suggestions that are valid based on the hints you received. This
            makes it different than other solvers, who solely guess words that
            decrease the solution set the most.
          </Typography>
          <Divider />
          <Typography sx={{ mt: 2 }} gutterBottom variant="h6">
            What bugs does it have?
          </Typography>
          <Typography gutterBottom>
            Consider the word solution is "BLEAK", you guess "TEAMS" which gives
            you a yellow 'E' on the second letter. Then you guess "BLEED".
            Wordle will make the 'E' that matches with "BLEAK", but make the
            second 'E' gray. If you input the second 'E' as grey in the solver,
            it will break it. Change that 'E' to yellow in the solver, and the
            solver will work just fine.
          </Typography>
          <Divider />
          <Typography sx={{ mt: 2 }} gutterBottom variant="h6">
            Speed Issues?
          </Typography>
          <Typography gutterBottom>
            I have it limited to give the best solution with less than 250
            possible words. If the available words is over 250, it will return a
            valid solution with every letter being unique.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Link
            rel="noopener noreferrer"
            href="https://github.com/BurntToast05/WordleSolver"
            target="_blank"
            underline="none"
          >
            <Button onClick={handleClose}>GitHub Repo </Button>
          </Link>
          <Button autoFocus onClick={handleClose}>
            Back to wordling!{" "}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
