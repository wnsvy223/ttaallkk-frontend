import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
// material
import { Menu, Button, MenuItem, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'createdAt', label: '최신순' },
  { value: 'commentCnt', label: '댓글순' },
  { value: 'likeCnt', label: '추천순' },
  { value: 'views', label: '조회순' }
];

SortableMenu.propTypes = {
  onSortItem: PropTypes.func
};

export default function SortableMenu({ onSortItem }) {
  const location = useLocation();
  const query = queryString.parse(location.search);
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
    onSortItem(SORT_BY_OPTIONS[index].value);
    handleClose();
  };

  // 쿼리스트링에 따라 정렬 선택 메뉴 라벨 변경
  useEffect(() => {
    if (query?.sort) {
      SORT_BY_OPTIONS.forEach((item, index) => {
        if (item.value === query.sort) {
          setSelectedLabel(item.label);
          setSelectedIndex(index);
        }
      });
    } else {
      setSelectedLabel(SORT_BY_OPTIONS[0].label);
      setSelectedIndex(0);
    }
  }, [query?.sort]);

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
