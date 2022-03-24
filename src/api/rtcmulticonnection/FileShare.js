import connection from './RTCMultiConnection';

// eslint-disable-next-line import/no-mutable-exports
export let fileData = {
  index: 0,
  files: [],
  users: []
};

/**
 * 방에 참가한 유저 수 만큼의 파일 배열, 사용자 배열, 사용자 수 만큼의 인덱스값을 저장한 뒤
 * 순차적으로 각 사용자에게 파일을 하나씩 전송(다수의 데이터 채널 생성으로 병렬처리가 가능한지 연구 필요)
 */
export function sendFilesToMultipleUser() {
  if (fileData.index === -1) {
    fileData = {};
    return;
  }
  if (!fileData.files[fileData.index]) {
    fileData.index = -1;
    return;
  }
  connection.send(fileData.files[fileData.index], fileData.users[fileData.index]);
}

// 파일 데이터 순차 인덱스 체크해서 보낼 데이터 남아있을 경우 전송
export function reSendFileByCheckIndex() {
  if (fileData.files) {
    fileData.index -= 1;
    sendFilesToMultipleUser();
  }
}

// 파일전송 순차처리를 위해 참가자 수 * 파일 수 만큼의 userid 배열 생성
export function getUserListByFileCount(files) {
  const users = [];
  connection.getAllParticipants().forEach((userid) => {
    Array.from(files).forEach(() => {
      users.push(userid);
    });
  });
  return users;
}

// 파일전송 순차처리를 위해 참가자 수 * 파일 수 만큼의 파일 배열 생성
export function getFileListByUserCount(files) {
  let fileList = [];
  connection.getAllParticipants().forEach(() => {
    const cloneFiles = Array.from(files);
    fileList = fileList.concat(cloneFiles);
  });
  return fileList;
}
