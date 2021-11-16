import PropTypes from 'prop-types';
// Material UI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';

AlertDialog.propTypes = {
  element: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  onDialogSubmit: PropTypes.func.isRequired
};

export default function AlertDialog({ element, open, onDialogClose, onDialogSubmit }) {
  const handleSubmit = () => {
    onDialogSubmit();
    onDialogClose(false);
  };

  const handleClose = () => {
    onDialogClose(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{element.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{element.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} autoFocus>
            확인
          </Button>
          <Button onClick={handleClose}>취소</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
