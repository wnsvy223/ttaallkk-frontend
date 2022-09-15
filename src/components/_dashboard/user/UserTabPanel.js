import { useState } from 'react';
import { Box, Tabs, Tab } from '@material-ui/core';
import PropTypes from 'prop-types';
import UserMyPost from './UserMyPost';
import UserMyComment from './UserMyComment';
import UserMyLike from './UserMyLike';

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
        <Box sx={{ p: 3 }} minHeight="500px">
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function UserTabPanel() {
  const [value, setValue] = useState(0);

  const handleChange = (event, tabIndex) => {
    setValue(tabIndex);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic-tabs">
          <Tab label="작성한 게시물" {...a11yProps(0)} />
          <Tab label="작성한 댓글" {...a11yProps(1)} />
          <Tab label="좋아요 누른 글" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <UserMyPost />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserMyComment />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UserMyLike />
      </TabPanel>
    </Box>
  );
}
