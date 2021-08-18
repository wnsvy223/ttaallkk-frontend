import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Card, Stack, Link, Container, Typography } from '@material-ui/core';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { LoginForm } from '../components/authentication/login';
import AuthSocial from '../components/authentication/AuthSocial';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
  backgroundImage: 'url(https://source.unsplash.com/random)',
  backgroundRepeat: 'no-repeat',
  backgroundColor:
    theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

const CardTypography = styled(Typography)(() => ({
  color: '#FFFFFF',
  textAlign: 'center'
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <RootStyle title="Login | TTAALLKK">
      <AuthLayout>
        아직 회원이 아닌가요? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
          회원가입
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <CardTypography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Community With Talk
          </CardTypography>
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              LOGIN
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>로그인이 필요한 서비스입니다</Typography>
          </Stack>
          <AuthSocial />

          <LoginForm />

          <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              아직 계정이 없나요? &nbsp;
              <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
                회원가입
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
