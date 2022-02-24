import { useState } from 'react';

import PropTypes from 'prop-types';

// material ui
import { Box, Grid, Slider, Input, Chip } from '@material-ui/core';

const maxValue = 30;

ConferenceParticipantsSlider.propTypes = {
  onSetSliderValue: PropTypes.func
};

export default function ConferenceParticipantsSlider({ onSetSliderValue }) {
  const [value, setValue] = useState(15);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    onSetSliderValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? 0 : Number(event.target.value));
    onSetSliderValue(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > maxValue) {
      setValue(maxValue);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
        <Chip label="참가자 수 제한" />
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            color="secondary"
            max={maxValue}
          />
        </Grid>
        <Grid item>
          <Input
            sx={{ width: '42px' }}
            value={value}
            size="small"
            color="secondary"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 5,
              min: 0,
              max: maxValue,
              type: 'number',
              'aria-labelledby': 'input-slider'
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
