import { useRef } from 'react';

// material ui
import { Box, IconButton } from '@material-ui/core';

import { Icon } from '@iconify/react';
import SharFileIcon from '@iconify/icons-fluent/image-multiple-16-regular';

// api
import connection, { sendMultipleFile } from '../../api/rtcmulticonnection/RTCMultiConnection';

// ----------------------------------------------------------------------

export default function ConferenceShareFile() {
  const inputFile = useRef(null);

  const handleOpenFileSelector = (e) => {
    e.preventDefault();
    inputFile.current.click();
  };

  const handleChangeFile = (e) => {
    const { files } = e.target;
    if (files.length < 1) {
      return;
    }
    if (files.length === 1) {
      // 단일 파일 전송
      connection.send(files[0]);
    } else {
      // 다수 파일 전송
      sendMultipleFile(Array.from(files));
    }
    inputFile.current.value = null; // input 값 리셋
  };

  return (
    <Box>
      <input
        type="file"
        multiple="multiple"
        accept="*"
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={handleChangeFile}
      />
      <IconButton aria-label="share file" component="label" onClick={handleOpenFileSelector}>
        <Box component={Icon} icon={SharFileIcon} sx={{ width: 23, heigh: 23, color: '#F2F2F2' }} />
      </IconButton>
    </Box>
  );
}
