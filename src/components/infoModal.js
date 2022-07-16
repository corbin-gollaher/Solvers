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
            If the resulting possible words is greater than 200 items, the
            solver will calculate a weight for each word based on uniqueness of
            characters, and answers eliminated from the possible word set if
            guessed. If the possible words are less than 200, the solver will
            brute force the best word, while giving precedence to a list of more
            common words as a tie breaker.
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
          <Typography gutterBottom variant="h6" sx={{ mt: 2 }}>
            Why not just brute force the answer everytime?
          </Typography>
          <Typography gutterBottom>
            In order to brute force an answer from a large list of possible
            words, the calculations required grow exponentially. It would take
            years to brute force the entire 12,000 word dictionary.
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
