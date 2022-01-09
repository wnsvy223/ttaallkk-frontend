import PropTypes from 'prop-types';
// material
import { Box } from '@material-ui/core';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return (
    <Box
      component="img"
      src="/favicon/apple-touch-icon.png"
      sx={{ width: 38, height: 38, ...sx }}
    />
  );
}
