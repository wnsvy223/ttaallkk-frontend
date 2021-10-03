import { Icon } from '@iconify/react';
import { useState } from 'react';
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
// material
import { Menu, Button, MenuItem, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'timestmap', label: '최신순' },
  { value: 'comments', label: '댓글순' },
  { value: 'likes', label: '추천순' },
  { value: 'views', label: '조회순' }
];

export default function ShopProductSort() {
  const [open, setOpen] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState(SORT_BY_OPTIONS[0].label);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLabel = (label) => {
    setSelectedLabel(label);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    handleLabel(SORT_BY_OPTIONS[index].label);
    handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Icon icon={open ? chevronUpFill : chevronDownFill} />}
      >
        정렬&nbsp;:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {selectedLabel}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option, index) => (
          <MenuItem
            key={option.value}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
