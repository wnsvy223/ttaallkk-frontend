import { useContext } from 'react';

// material
import { Container, Typography, Card, Box } from '@material-ui/core';

// components
import Page from '../../components/Page';
import ConferenceForm from '../../components/conference/ConferenceForm';

// context
import { ConnectionContext } from '../../api/context/ConnectionContext';

// ----------------------------------------------------------------------
export default function ConferencePrivate() {
  const { isConversation } = useContext(ConnectionContext);

  return (
    <Page title="Dashboard: Conference | TTAALLKK">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          비밀 대화방
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {!isConversation && (
            <Card sx={{ p: 3 }}>
              <ConferenceForm isPublicRoom={false} />
            </Card>
          )}
        </Box>
      </Container>
    </Page>
  );
}
