import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        검색 결과 없음
      </Typography>
      <Typography variant="body2" align="center">
        <strong>&quot;{searchQuery}&quot;</strong>의 검색 결과가 없습니다. &nbsp; 이메일 또는
        닉네임을 다시 확인해 주세요.
      </Typography>
    </Paper>
  );
}
