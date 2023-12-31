import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
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
  const location = useLocation();
  const query = queryString.parse(location.search);
  const [searchValue, setSearchValue] = useState('');
  const [placeholderValue, setPlaceholderValue] = useState('');

  const handleSearch = () => {
    onSearchPost(searchValue);
  };

  const handleInputValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (query?.search) {
      setSearchValue(query?.search);
    } else {
      setPlaceholderValue('검색어');
      setSearchValue('');
    }
    return () => {
      setPlaceholderValue('검색어');
      setSearchValue('');
    };
  }, [query?.search]);

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
        placeholder={placeholderValue}
        type="text"
        variant="outlined"
        fullWidth
        size="small"
        color={color}
        onChange={(e) => handleInputValueChange(e)}
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
