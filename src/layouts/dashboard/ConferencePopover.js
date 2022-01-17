import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import HeadphoneFill from '@iconify/icons-eva/headphones-fill';

// material
import { styled } from '@material-ui/core/styles';
import { IconButton, Badge } from '@material-ui/core';

// context
import { MessageContext } from '../../api/context/MessageContext';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  }
}));

ConferencePopover.propTypes = {
  onPopoverClick: PropTypes.func
};

export default function ConferencePopover({ onPopoverClick }) {
  const { speak } = useContext(MessageContext);

  return (
    <IconButton onClick={onPopoverClick}>
      {speak?.isSpeak ? (
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          variant="dot"
        >
          <Icon icon={HeadphoneFill} />
        </StyledBadge>
      ) : (
        <Icon icon={HeadphoneFill} />
      )}
    </IconButton>
  );
}
