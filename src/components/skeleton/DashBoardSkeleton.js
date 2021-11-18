// Material UI
import {
  Skeleton,
  Grid,
  Box,
  Link,
  Drawer,
  Stack,
  List,
  ListItemButton,
  AppBar,
  Toolbar,
  Container
} from '@material-ui/core';
import { alpha, styled } from '@material-ui/core/styles';

// component
import { MHidden } from '../@material-extend';
import Scrollbar from '../Scrollbar';

const DRAWER_WIDTH = 280;
const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

const NavbarStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

const DrawerStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(2.5),
    color: theme.palette.text.secondary,
    '&:before': {
      top: 0,
      right: 0,
      width: 3,
      bottom: 0,
      content: "''",
      display: 'none',
      position: 'absolute',
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      backgroundColor: theme.palette.primary.main
    }
  })
);

function DashBoardSkeleton() {
  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        backgroundColor: 'rgb(5, 30, 52)',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Skeleton
          variant="circular"
          width={45}
          height={45}
          animation="wave"
          sx={{ bgcolor: '#DFE3E8' }}
        />
      </Box>

      <Box sx={{ mb: 3, mx: 2.5, mt: 1 }}>
        <Link underline="none">
          <AccountStyle>
            <Skeleton variant="circular" width={45} height={45} animation="wave" />
            <Box sx={{ ml: 2 }}>
              <Skeleton variant="text" width={130} height={20} animation="wave" />
              <Skeleton variant="text" width={130} height={20} animation="wave" />
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <List>
        <ListItemStyle>
          <Skeleton variant="text" animation="wave" width="100%" />
        </ListItemStyle>
        <ListItemStyle>
          <Skeleton variant="text" animation="wave" width="100%" />
        </ListItemStyle>
        <ListItemStyle>
          <Skeleton variant="text" animation="wave" width="100%" />
        </ListItemStyle>
        <ListItemStyle>
          <Skeleton variant="text" animation="wave" width="100%" />
        </ListItemStyle>
        <ListItemStyle>
          <Skeleton variant="text" animation="wave" width="100%" />
        </ListItemStyle>
      </List>
      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          alignItems="center"
          spacing={1}
          sx={{
            p: 2.5,
            pt: 5,
            borderRadius: 2,
            position: 'relative',
            bgcolor: 'grey.200',
            height: 220
          }}
        >
          <Skeleton variant="h3" width="60%" />
          <Skeleton variant="body1" width="80%" />
          <Skeleton variant="body1" width="80%" />
          <Skeleton variant="text" width="80%" height={60} />
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      <NavbarStyle>
        <ToolbarStyle>
          <Skeleton variant="circular" width={30} height={30} animation="wave" />

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            <Skeleton variant="circular" width={45} height={45} animation="wave" />
            <Skeleton variant="circular" width={45} height={45} animation="wave" />
            <Skeleton variant="circular" width={45} height={45} animation="wave" />
          </Stack>
        </ToolbarStyle>
      </NavbarStyle>
      <DrawerStyle>
        <MHidden width="lgUp">
          <Drawer
            open={false}
            PaperProps={{
              sx: { width: DRAWER_WIDTH }
            }}
          >
            {renderContent}
          </Drawer>
        </MHidden>

        <MHidden width="lgDown">
          <Drawer
            open
            variant="persistent"
            PaperProps={{
              sx: {
                width: DRAWER_WIDTH,
                bgcolor: 'background.default'
              }
            }}
          >
            {renderContent}
          </Drawer>
        </MHidden>
      </DrawerStyle>
      <MainStyle>
        <Container maxWidth="xl">
          <Box sx={{ pb: 5 }}>
            <Skeleton variant="text" sx={{ width: 100, height: 50 }} />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={6} md={3}>
              <Skeleton variant="h3" sx={{ height: 130 }} />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Skeleton variant="h3" sx={{ height: 130 }} />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Skeleton variant="h3" sx={{ height: 130 }} />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Skeleton variant="h3" sx={{ height: 130 }} />
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Skeleton variant="h3" sx={{ height: 450 }} />
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Skeleton variant="h3" sx={{ height: 450 }} />
            </Grid>

            <Grid item xs={12} md={6} lg={6} container direction="column" rowSpacing={2}>
              <Grid item sx={{ height: '50%' }}>
                <Skeleton variant="h3" sx={{ height: 130 }} />
              </Grid>
              <Grid item sx={{ height: '50%' }}>
                <Skeleton variant="h3" sx={{ height: 130 }} />
              </Grid>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Skeleton variant="h3" sx={{ height: 280 }} />
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <Skeleton variant="h3" sx={{ height: 400 }} />
            </Grid>
          </Grid>
        </Container>
      </MainStyle>
    </RootStyle>
  );
}

export default DashBoardSkeleton;
