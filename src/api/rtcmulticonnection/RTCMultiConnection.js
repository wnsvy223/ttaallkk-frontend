import RTCMultiConnection from '../../lib/RTCMultiConnection'; // 기존 RTCMultiConnection 오픈 소스 코드 개선 및 커스터마이징(ES6 이전의 모듈이기 때문에 eslintignore파일에 추가하여 사용)
import { defaultMaxParticipantsAllowed, maxBufferedAmountLowThreshold } from '../../utils/constant';

const connection = new RTCMultiConnection();

console.log(`브라우저 :${connection.DetectRTC.browser.name}`);
if (connection.DetectRTC.browser.name === 'IE') {
  alert('이 사이트는 인터넷 익스플로러를 지원하지 않습니다. 크롬 브라우저를 이용하세요.');
}

connection.socketURL = process.env.REACT_APP_SIGNAL_SERVER_URL;
connection.autoCreateMediaElement = false; // 미디어 엘리먼트 자동생성 X(default media element의 경우 unmute시 echo 이슈)
connection.enableFileSharing = true; // 파일 공유 세팅
connection.chunkSize = 60 * 1000; // ChunkSize
connection.autoSaveToDisk = false; // to make sure file-saver dialog is not invoked.
connection.maxParticipantsAllowed = defaultMaxParticipantsAllowed; // limit participants allowed

// Set video directions and media types
connection.session = {
  video: false,
  audio: true,
  data: true
};

// Choose front or back camera, set resolutions, choose camera/microphone by device-id etc.
connection.mediaConstraints = {
  video: false,
  audio: {
    echoCancellation: true
  }
};

connection.bandwidth = {
  audio: 50, // 50 kbps
  video: 256, // 256 kbps
  screen: 300 // 300 kbps
  // audio : audio bitrates. Minimum 6 kbps and maximum 510 kbps
  // video : video framerates. Minimum 100 kbps; maximum 2000 kbps
  // screen : screen framerates. Minimum 300 kbps; maximum 4000 kbps
};

connection.optionalArgument = {};

// eslint-disable-next-line func-names
connection.processSdp = (sdp) => sdp; // return unchanged SDP

connection.sdpConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true,
    IceRestart: true
  },
  optional: []
};

// set ice server (ignore default STUN+TURN servers)
connection.iceServers = [];

// stun server
connection.iceServers.push({
  urls: [
    'stun:stun.l.google.com:19302',
    'stun:stun.l.google.com:19302?transport=udp',
    'stun:stun1.l.google.com:19302',
    'stun:stun2.l.google.com:19302'
  ]
});

// turn server
connection.iceServers.push({
  // own viagenie turn server
  urls: 'turn:numb.viagenie.ca',
  username: 'wnsvy223@naver.com',
  credential: 'dlsvygud223@'
});

connection.iceServers.push({
  // muazkh viagenie turn server
  urls: 'turn:numb.viagenie.ca',
  username: 'webrtc@live.com',
  credential: 'muazkh'
});

export const sendMultipleFile = (files) => {
  connection.getAllParticipants().forEach((remoteUserId) => {
    files.forEach((file) => {
      // 참가자 수 * 파일 수 만큼 데이터 채널 생성
      const channel = connection.peers[remoteUserId].createDataChannel(`Parallel`, {});
      channel.bufferedAmountLowThreshold = maxBufferedAmountLowThreshold;
      const uuid = (Math.random() * 100).toString().replace(/\./g, '');

      channel.addEventListener('open', () => {
        const reader = new FileReader();
        const maxChunks = Math.ceil(file.size / connection.chunkSize);
        const lastModifiedDate = (file.lastModifiedDate || new Date()).toString();
        const data = {
          offset: 0,
          currentPosition: 0,
          channel,
          file,
          connection,
          reader,
          uuid,
          remoteUserId,
          maxChunks,
          lastModifiedDate
        };

        reader.onload = (e) => {
          const buffer = e.target.result;
          if (channel.bufferedAmount > channel.bufferedAmountLowThreshold) {
            // 버퍼가 너무 차면 대기. 4MB 이상 쌓이면 멈춤
            channel.onbufferedamountlow = () => {
              // 버퍼에 여유가 생기면 다시 전송
              channel.onbufferedamountlow = null;
              sendChunk(buffer, data);
            };
          } else {
            if (data.offset === 0) {
              sendFileStart(channel, uuid, remoteUserId, file, maxChunks, lastModifiedDate);
            }
            sendChunk(buffer, data);
          }
        };
        readNextChunk(file, data.offset, connection.chunkSize, reader);
      });
    });
  });
};

// 파일 버퍼에서 다음 청크데이터 읽어들임
const readNextChunk = (file, offset, chunkSize, reader) => {
  const slice = file.slice(offset, offset + chunkSize);
  reader.readAsArrayBuffer(slice);
};

// 파일 청크 데이터 전송
const sendChunk = (buffer, data) => {
  const { channel, file, connection, reader, uuid, remoteUserId, maxChunks, lastModifiedDate } =
    data;

  data.offset += buffer.byteLength;
  data.currentPosition += 1;

  const chunk = {
    buffer: data.offset,
    currentPosition: data.currentPosition,
    extra: connection.extra,
    lastModifiedDate,
    maxChunks,
    name: file.name,
    remoteUserId,
    size: file.size,
    type: file.type,
    userid: connection.userid,
    uuid
  };

  channel.send(JSON.stringify(chunk));
  connection.onFileProgress(chunk);

  if (data.offset < file.size) {
    readNextChunk(file, data.offset, connection.chunkSize, reader);
  } else {
    sendFileEnd(channel, uuid, remoteUserId, maxChunks, lastModifiedDate, file);
  }
};

// 파일 전송 시작 데이터 송신
const sendFileStart = (channel, uuid, remoteUserId, file, maxChunks, lastModifiedDate) => {
  const chunk = {
    currentPosition: 0,
    extra: connection.extra,
    lastModifiedDate,
    maxChunks,
    name: file.name,
    remoteUserId,
    size: file.size,
    start: true,
    type: file.type,
    userid: connection.userid,
    uuid
  };
  channel.send(JSON.stringify(chunk));
  connection.onFileStart(chunk);
};

// 파일 전송 완료 데이터 송신
const sendFileEnd = (channel, uuid, remoteUserId, maxChunks, lastModifiedDate, file) => {
  const chunk = {
    end: true,
    name: file.name,
    url: URL.createObjectURL(file),
    extra: connection.extra,
    userid: connection.userid,
    uuid,
    size: file.size,
    maxChunks,
    lastModifiedDate,
    type: file.type,
    remoteUserId
  };
  channel.send(JSON.stringify(chunk));
  connection.onFileEnd(chunk);
};

// 음성대화 연결 해제
export const handleDisconnectRTC = () => {
  connection.isInitiator = false; // 대화종료 시 방장구분값 false로 초기화
  connection.attachStreams.forEach((stream) => {
    stream.stop(); // 미디어 스트림 제거
  });
  connection.getAllParticipants().forEach((pid) => {
    connection.disconnectWith(pid); // 연결된 참가자들과 연결해제
  });
  connection.getSocket((socket) => {
    socket.emit('leave-room'); // 대화종료 소켓 이벤트 서버로 전달
  });
};

// 대화 참가 가능 인원수 제어
export const handleMaxParticipantsAllowed = (participants) => {
  connection.maxParticipantsAllowed = participants;
};

export default connection;
