// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import {
  // AppTasks,
  // AppNewUsers,
  // AppBugReports,
  // AppItemOrders,
  // AppNewsUpdate,
  // AppWeeklySales,
  // AppOrderTimeline,
  // AppCurrentVisits,
  // AppWebsiteVisits,
  // AppTrafficBySite,
  // AppCurrentSubject,
  // AppConversionRates,
  AppMainCard,
  AppHotPost,
  AppNewPost,
  AppAdminNotice,
  AppAdminRecommend,
  AppTodayImgVideo,
  AppTechAndTip
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Home | TTAALLKK">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Home</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6} md={3}>
            <AppMainCard title="친구찾기" color="primary.light" />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <AppMainCard title="커뮤니티" color="info.light" />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <AppMainCard title="음성대화" color="warning.light" />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <AppMainCard title="질문/응답" color="error.light" />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppHotPost />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppNewPost />
          </Grid>

          <Grid item xs={12} md={6} lg={6} container direction="column" rowSpacing={2}>
            <Grid item sx={{ height: '50%' }}>
              <AppAdminNotice />
            </Grid>
            <Grid item sx={{ height: '50%' }}>
              <AppAdminRecommend />
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppTodayImgVideo />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppTechAndTip />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
