import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import chevronRightFill from '@iconify/icons-eva/chevron-right-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
// material
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import {
  Box,
  List,
  Collapse,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Typography
} from '@material-ui/core';

// ----------------------------------------------------------------------

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: theme.palette.text.secondary,
    borderRadius: 15,
    margin: '5px 15px',
    '&:before': {
      top: 0,
      right: -8,
      width: 3,
      bottom: 0,
      marginTop: 3,
      marginBottom: 3,
      content: "''",
      display: 'none',
      position: 'absolute',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      backgroundColor: theme.palette.info.main
    }
  })
);

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

// ----------------------------------------------------------------------

NavTitle.propTypes = {
  item: PropTypes.object
};

function NavTitle({ item }) {
  return (
    <Box sx={{ height: 40, display: 'flex', alignItems: 'end', justifyContent: 'start' }}>
      <Typography variant="subtitle2" sx={{ color: '#ffffff', fontSize: 12, pl: 4 }}>
        {item.title}
      </Typography>
    </Box>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.func,
  isMiniDrawer: PropTypes.bool
};

function NavItem({ item, active, isMiniDrawer }) {
  const theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, info, children } = item;
  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const activeRootStyle = {
    color: 'background.paper',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.info.lighter, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' }
  };

  const activeSubStyle = {
    color: 'background.paper',
    fontWeight: 'fontWeightMedium'
  };

  const miniDrawerStyle = {
    display: 'flex',
    flexDirection: isMiniDrawer ? 'column' : 'row',
    fontSize: isMiniDrawer ? 10 : 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15px'
  };

  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle),
            ...(isMiniDrawer && miniDrawerStyle)
          }}
        >
          <ListItemIconStyle
            sx={{ ml: isMiniDrawer ? 2 : 0, mt: isMiniDrawer ? 1 : 0, mb: isMiniDrawer ? 0.5 : 0 }}
          >
            {icon && icon}
          </ListItemIconStyle>
          <ListItemText disableTypography primary={title} sx={{ mb: isMiniDrawer ? 1 : 0 }} />
          {info && info}
          <Box
            component={Icon}
            icon={open ? chevronDownFill : chevronRightFill}
            sx={{ width: 28, height: 28, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item) => {
              const { title, path } = item;
              const isActiveSub = active(path);

              return (
                <ListItemStyle
                  key={title}
                  component={RouterLink}
                  to={path}
                  sx={{
                    ...(isActiveSub && activeSubStyle),
                    ...(isMiniDrawer && miniDrawerStyle),
                    backgroundColor: 'rgba(71, 98, 130, 0.2)'
                  }}
                >
                  <ListItemIconStyle sx={{ ml: 3 }}>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'text.disabled',
                        mr: 1,
                        transition: (theme) => theme.transitions.create('transform'),
                        ...(isActiveSub && {
                          transform: 'scale(2)',
                          bgcolor: 'info.main'
                        })
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText disableTypography primary={title} />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{
        ...(isActiveRoot && activeRootStyle),
        ...(isMiniDrawer && miniDrawerStyle)
      }}
    >
      <ListItemIconStyle
        sx={{ ml: isMiniDrawer ? 2 : 0, mt: isMiniDrawer ? 1.5 : 0, mb: isMiniDrawer ? 0.5 : 0 }}
      >
        {icon && icon}
      </ListItemIconStyle>
      <ListItemText disableTypography primary={title} sx={{ mb: isMiniDrawer ? 1 : 0 }} />
      {info && info}
    </ListItemStyle>
  );
}

NavSection.propTypes = {
  navConfig: PropTypes.array,
  isMiniDrawer: PropTypes.bool
};

export default function NavSection({ navConfig, isMiniDrawer, ...other }) {
  const { pathname } = useLocation();
  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false); // 요청 경로와 현재 경로 일치할시 active

  return (
    <Box {...other}>
      <List disablePadding>
        {navConfig.map((item) =>
          item?.type === 'title' ? (
            !isMiniDrawer && <NavTitle key={item.title} item={item} />
          ) : (
            <NavItem key={item.title} item={item} active={match} isMiniDrawer={isMiniDrawer} />
          )
        )}
      </List>
    </Box>
  );
}
