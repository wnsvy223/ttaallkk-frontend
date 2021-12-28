import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';

// material
import { Stack, Button, Container, Typography, Tabs, Tab, Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

// components
import Page from '../components/Page';
import { FriendList, FriendListForIdleStatus } from '../components/_dashboard/friend';

// ----------------------------------------------------------------------
TabPanel.propTypes = {
  children: PropTypes.object,
  value: PropTypes.number,
  index: PropTypes.number
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { md: 2 } }} minHeight="500px">
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

const StyledTabs = styled((props) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7'
  }
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(12),
  marginRight: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#fff'
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)'
  }
}));

const SearchFriendButton = styled(Button)(() => ({
  backgroundColor: 'rgb(5, 30, 52)',
  '&:hover': {
    background: 'rgb(5, 30, 92)'
  }
}));

export default function Friend() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Page title="Friend | TTAALLKK">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Friend
          </Typography>
          <SearchFriendButton
            variant="contained"
            component={RouterLink}
            to="/dashboard/search"
            startIcon={<Icon icon={plusFill} />}
          >
            친구 추가
          </SearchFriendButton>
        </Stack>
        <Box sx={{ bgcolor: '#2e1534', borderRadius: 2 }}>
          <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
            <StyledTab label="현재 친구" />
            <StyledTab label="대기중" />
            <StyledTab label="최근 대화한 친구" />
          </StyledTabs>
          <Box sx={{ p: 1, borderRadius: '50%' }}>
            <TabPanel value={value} index={0}>
              <FriendList />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <FriendListForIdleStatus />
            </TabPanel>
          </Box>
        </Box>
      </Container>
    </Page>
  );
}
