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
    content: PropTypes.string
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  onDialogSubmit: PropTypes.func.isRequired,
  children: PropTypes.element, //  DialogContent 컴포넌트의 자식 요소에 커스텀 엘리먼트 추가를 위한 props
  dialogContentStyle: PropTypes.object // 자식 컴포넌트가 위치한 DialogContent 컴포넌트의 스타일링 커스터마이징을 위한 props
};

export default function AlertDialog({
  element,
  open,
  onDialogClose,
  onDialogSubmit,
  children,
  dialogContentStyle
}) {
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
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
          {element.title}
        </DialogTitle>
        <DialogContent sx={dialogContentStyle}>
          <DialogContentText id="alert-dialog-description">{element.content}</DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} autoFocus color="ultramarine">
            확인
          </Button>
          <Button onClick={handleClose} color="ultramarine">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
