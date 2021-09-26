import PropTypes from 'prop-types';
// material
import { styled } from '@material-ui/core/styles';
import ArrowRightAltRounded from '@material-ui/icons/DoubleArrowOutlined';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  IconButton
} from '@material-ui/core';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.darker
}));

const CardBody = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2, 0)
}));

// ----------------------------------------------------------------------
AppMainCard.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};

export default function AppMainCard({ title, color }) {
  return (
    <RootStyle sx={{ minWidth: 200 }}>
      <CardHeader sx={{ height: 40, backgroundColor: color }} />
      <CardBody>
        <Typography variant="subtitle1" sx={{ fontSize: 16, textAlign: 'center' }}>
          {title}
        </Typography>
      </CardBody>
      <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
        <IconButton size="small" sx={{ backgroundColor: color, color: 'gray' }}>
          <ArrowRightAltRounded fontSize="inherit" />
        </IconButton>
      </CardActions>
    </RootStyle>
  );
}
