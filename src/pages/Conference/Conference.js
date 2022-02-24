import { useNavigate } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
// material ui
import {
  Container,
  Stack,
  Card,
  CardMedia,
  CardActionArea,
  Typography,
  Box,
  Grid
} from '@material-ui/core';

// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------
const publicRoomImage = 'https://cdn-icons-png.flaticon.com/512/1484/1484798.png';
const privateRoomImage = 'https://cdn-icons-png.flaticon.com/512/4175/4175866.png';
const storedRoomImage = 'https://cdn-icons-png.flaticon.com/512/4107/4107780.png';

const CardMediaStyle = styled(CardMedia)({
  width: 200,
  height: 'auto',
  margin: '0 auto',
  padding: 20
});

export default function Conference() {
  const navigate = useNavigate();

  const handleClickCard = (index) => {
    switch (index) {
      case 0:
        navigate(`/dashboard/conference/public`);
        break;
      case 1:
        navigate(`/dashboard/conference/private`);
        break;
      case 2:
        break;
      default:
    }
  };

  return (
    <Page title="Dashboard: Conference | TTAALLKK">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Conference
        </Typography>
        <Stack direction="column" spacing={4}>
          <Typography variant="subtitle1" sx={{ pl: 1 }}>
            대화방 종류
          </Typography>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={4}>
                <Card>
                  <CardActionArea onClick={() => handleClickCard(0)}>
                    <CardMediaStyle component="img" image={publicRoomImage} alt="room image" />
                    <Stack
                      spacing={2}
                      sx={{ p: 3 }}
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="subtitle1">공개 대화방</Typography>
                    </Stack>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <Card>
                  <CardActionArea onClick={() => handleClickCard(1)}>
                    <CardMediaStyle component="img" image={privateRoomImage} alt="room image" />
                    <Stack
                      spacing={2}
                      sx={{ p: 3 }}
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="subtitle1">비밀 대화방</Typography>
                    </Stack>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <Card>
                  <CardActionArea onClick={() => handleClickCard(2)}>
                    <CardMediaStyle component="img" image={storedRoomImage} alt="room image" />
                    <Stack
                      spacing={2}
                      sx={{ p: 3 }}
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="subtitle1">전용 대화방</Typography>
                    </Stack>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Page>
  );
}
