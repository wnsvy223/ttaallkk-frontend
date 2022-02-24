// material
import { Container, Card, Typography, Grid } from '@material-ui/core';

// components
import Page from '../../components/Page';
import ConferencePublicRoomList from '../../components/conference/ConferencePublicRoomList';
import ConferenceForm from '../../components/conference/ConferenceForm';

// ----------------------------------------------------------------------
export default function ConferencePublic() {
  return (
    <Page title="Dashboard: Conference | TTAALLKK">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          공개 대화방
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <ConferenceForm isPublicRoom />
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100vh' }}>
              <ConferencePublicRoomList />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
