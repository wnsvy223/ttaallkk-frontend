import { useRef } from 'react';

// material ui
import { Box, IconButton } from '@material-ui/core';

import { Icon } from '@iconify/react';
import SharFileIcon from '@iconify/icons-fluent/image-multiple-16-regular';

// api
import connection from '../../api/rtcmulticonnection/RTCMultiConnection';
import {
  fileData,
  sendFilesToMultipleUser,
  getUserListByFileCount,
  getFileListByUserCount
} from '../../api/rtcmulticonnection/FileShare';
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
      fileData.index = connection.getAllParticipants().length * files.length - 1; // 참가자수 * 파일갯수 = 전체 보내야할 파일 갯수
      fileData.files = getFileListByUserCount(files);
      fileData.users = getUserListByFileCount(files);
      sendFilesToMultipleUser();
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
