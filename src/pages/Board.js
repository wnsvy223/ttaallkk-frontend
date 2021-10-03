import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@material-ui/core';
import { Icon } from '@iconify/react';
import edit2Outline from '@iconify/icons-eva/edit-2-outline';

// components
import Page from '../components/Page';
import { ProductSort } from '../components/_dashboard/products';
import { BoardTable } from '../components/_dashboard/board';

// ----------------------------------------------------------------------

Board.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.number.isRequired
};

export default function Board({ title, category }) {
  return (
    <Page title={`Board: ${title} | TTAALLKK`}>
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', pb: 2 }}>
          <Button
            sx={{ flex: 'none', marginRight: 'auto' }}
            variant="contained"
            color="info"
            component={RouterLink}
            to="/dashboard/community/create"
            startIcon={<Icon icon={edit2Outline} />}
          >
            새 글 쓰기
          </Button>
          <ProductSort />
        </Box>
        <BoardTable category={category} />
      </Container>
    </Page>
  );
}
