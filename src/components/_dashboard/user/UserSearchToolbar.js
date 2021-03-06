import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
// import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  // Tooltip,
  // IconButton,
  Button,
  // Typography,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core';
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 1)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: '100%',
  height: 36,
  margin: theme.spacing(0, 1, 0, 0)
}));

// ----------------------------------------------------------------------

UserSearchToolbar.propTypes = {
  onSearchUser: PropTypes.func
};

export default function UserSearchToolbar({ onSearchUser }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    onSearchUser(searchValue);
  };

  return (
    <RootStyle>
      <SearchStyle
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="이메일 또는 닉네임을 입력하세요"
        startAdornment={
          <InputAdornment position="start">
            <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
      />
      <Button variant="contained" onClick={handleSearch}>
        검색
      </Button>
    </RootStyle>
  );
}
