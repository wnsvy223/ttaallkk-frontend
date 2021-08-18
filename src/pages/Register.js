import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Card, Link, Container, Typography } from '@material-ui/core';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { RegisterForm } from '../components/authentication/register';
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

export default function Register() {
  return (
    <RootStyle title="Register | TTAALLKK">
      <AuthLayout>
        이미 회원이신가요? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/login">
          로그인
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <CardTypography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Communication more effectively with TTAALLKK
          </CardTypography>
        </SectionStyle>
      </MHidden>

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              SIGNUP
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              회원가입하고 다양한 서비스를 이용해보세요
            </Typography>
          </Box>

          <AuthSocial />

          <RegisterForm />

          <Typography
            variant="body2"
            fontSize={12}
            align="center"
            sx={{ color: 'text.secondary', mt: 3 }}
          >
            회원가입 시 TTAALLKK의&nbsp;
            <Link href="#" underline="hover" sx={{ color: '#00AB55', fontWeight: 'bold' }}>
              서비스 이용 약관
            </Link>
            과&nbsp;
            <Link href="#" underline="hover" sx={{ color: '#00AB55', fontWeight: 'bold' }}>
              개인정보 보호정책
            </Link>
            에 동의하게 됩니다.
          </Typography>

          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              이미 회원이신가요? &nbsp;
              <Link underline="none" component={RouterLink} to="/login">
                로그인
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
