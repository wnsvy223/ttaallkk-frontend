import PropTypes from 'prop-types';
import { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import { TextField, InputAdornment, IconButton, Box, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

BoardPostSearch.propTypes = {
  color: PropTypes.string.isRequired,
  onSearchPost: PropTypes.func.isRequired
};

const CancleIconButton = styled(IconButton)(() => ({
  padding: 5
}));

export default function BoardPostSearch({ color, onSearchPost }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    onSearchPost(searchValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        mb: 2,
        justifyContent: 'center'
      }}
    >
      <TextField
        sx={{ width: { md: '50%', xs: '100%' } }}
        placeholder="검색어"
        type="text"
        variant="outlined"
        fullWidth
        size="small"
        color={color}
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        InputProps={{
          style: { fontSize: '13px' },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),

          endAdornment: searchValue && (
            <CancleIconButton
              aria-label="toggle password visibility"
              onClick={() => setSearchValue('')}
            >
              <CancelRoundedIcon />
            </CancleIconButton>
          )
        }}
      />
      <Button sx={{ ml: 1 }} variant="contained" color={color} onClick={handleSearch}>
        검색
      </Button>
    </Box>
  );
}
