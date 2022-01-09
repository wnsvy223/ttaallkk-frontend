/* eslint-disable jsx-a11y/media-has-caption */
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// material ui
import { styled } from '@material-ui/core/styles';
import { Grid, Stack, Typography, Slider, Box } from '@material-ui/core';
import { Icon } from '@iconify/react';
import volumUpOutline from '@iconify/icons-eva/volume-up-outline';

// api
import hark from 'hark';

// recoil
import { useRecoilValue } from 'recoil';
import { muteState } from '../../recoil/atom';

// component
import LetterAvatar from '../common/LetterAvatar';

const VolumeSlider = styled(Slider)({
  color: 'rgb(5, 60, 92)',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none'
  },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit'
    },
    '&:before': {
      display: 'none'
    }
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: 'rgb(5, 60, 92)',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
    },
    '& > *': {
      transform: 'rotate(45deg)'
    }
  }
});

ConferenceParticipantsItem.propTypes = {
  event: PropTypes.object.isRequired
};

export default function ConferenceParticipantsItem({ event }) {
  const videoRef = useRef(); // 비디오 엘리먼트 참조 값(useRef로 항상 같은값을 참조)

  const [localSpeak, setLocalSpeak] = useState(false); // 로컬 유저의 대화 상태값
  const [remoteSpeak, setRemoteSpeak] = useState(false); // 리모트 유저의 대화 상태값
  const isMute = useRecoilValue(muteState); // 음성대화 컨트롤러 컴포넌트에서 제어하는 로컬 유저 음소거 상태값

  const handleVolumeChange = (e) => {
    videoRef.current.volume = e.target.value / 10;
  };

  // 각 비디오 엘리먼트에 stream 리소스 설정
  useEffect(() => {
    if (videoRef && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = event?.stream;
    }
  }, [event?.stream]);

  // 로컬유저와 리모트유저의 볼륨 초기값 설정
  useEffect(() => {
    if (event?.type === 'local') {
      videoRef.current.volume = 0;
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
    } else {
      videoRef.current.volume = 0.5;
      videoRef.current.muted = false;
      videoRef.current.defaultMuted = false;
    }
  }, [event?.type]);

  // 로컬 유저의 대화상태 감지
  useEffect(() => {
    if (event?.stream && event?.type === 'local') {
      // eslint-disable-next-line new-cap
      const speechEvents = new hark(event?.stream, {});
      speechEvents.on('speaking', () => {
        if (!isMute) setLocalSpeak(true);
      });

      speechEvents.on('stopped_speaking', () => {
        if (!isMute) setLocalSpeak(false);
      });
    }
    return () => setLocalSpeak(false);
  }, [event?.stream, event?.type, isMute]);

  // 리모트 유저의 대화상태 감지
  useEffect(() => {
    if (event?.stream && event?.type === 'remote') {
      // eslint-disable-next-line new-cap
      const speechEvents = new hark(event?.stream, {});
      speechEvents.on('speaking', () => {
        if (!isMute) setRemoteSpeak(true);
      });

      speechEvents.on('stopped_speaking', () => {
        if (!isMute) setRemoteSpeak(false);
      });
    }
    return () => setRemoteSpeak(false);
  }, [event?.stream, event?.type, isMute]);

  return event?.type === 'local' ? (
    <Box sx={{ p: 0.5 }}>
      <Grid container direction="row" alignItems="center" justifyContent="center">
        <Grid item xs={2}>
          <LetterAvatar
            src={event?.extra?.profileUrl}
            sx={{
              width: 32,
              height: 32,
              name: event?.extra?.displayName,
              fontSize: 12,
              border: localSpeak ? '3px solid #fb0102' : 0
            }}
          />
        </Grid>
        <Grid item xs={10}>
          <Typography sx={{ fontSize: 12, minWidth: 30 }} noWrap>
            {event?.extra?.displayName}
          </Typography>
        </Grid>
      </Grid>
      <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
    </Box>
  ) : (
    <Box sx={{ p: 0.5 }}>
      <Grid container direction="row" alignItems="center" justifyContent="center">
        <Grid item xs={2}>
          <LetterAvatar
            src={event?.extra?.profileUrl}
            sx={{
              width: 32,
              height: 32,
              name: event?.extra?.displayName,
              fontSize: 12,
              border: remoteSpeak === true ? '3px solid #fb0102' : 0
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 12, minWidth: 30 }} noWrap>
            {event?.extra?.displayName}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ pr: 0.5 }}>
          <Stack alignItems="center">
            <Box component={Icon} icon={volumUpOutline} sx={{ width: 22, height: 22 }} />
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack alignItems="center">
            <VolumeSlider
              valueLabelDisplay="auto"
              aria-label="volume"
              defaultValue={5}
              max={10}
              onChange={handleVolumeChange}
            />
          </Stack>
        </Grid>
      </Grid>
      <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
    </Box>
  );
}
