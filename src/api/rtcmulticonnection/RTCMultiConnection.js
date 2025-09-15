import RTCMultiConnection from '../../lib/RTCMultiConnection'; // 기존 RTCMultiConnection 오픈 소스 코드 개선 및 커스터마이징(ES6 이전의 모듈이기 때문에 eslintignore파일에 추가하여 사용)
import { defaultMaxParticipantsAllowed, chunkSize } from '../../utils/constant';

const connection = new RTCMultiConnection();

console.log(`브라우저 :${connection.DetectRTC.browser.name}`);
if (connection.DetectRTC.browser.name === 'IE') {
  alert('이 사이트는 인터넷 익스플로러를 지원하지 않습니다. 크롬 브라우저를 이용하세요.');
}

connection.socketURL = process.env.REACT_APP_SIGNAL_SERVER_URL;
connection.autoCreateMediaElement = false; // 미디어 엘리먼트 자동생성 X(default media element의 경우 unmute시 echo 이슈)
connection.enableFileSharing = true; // 파일 공유 세팅
connection.chunkSize = chunkSize; // ChunkSize(기본값 - 16KB)
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
      const channel = connection.peers[remoteUserId].createDataChannel(`Parallel`, {});
      channel.bufferedAmountLowThreshold = chunkSize; // bufferedamountlow 임계값 설정 (16KB)
      channel.addEventListener('open', async () => {
        const uuid = (Math.random() * 100).toString().replace(/\./g, '');
        try {
          // 파일 메타데이터 전송
          await sendAsync(
            channel,
            JSON.stringify({
              messageType: 'fileInfo',
              data: {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModifiedDate: file.lastModified,
                uuid,
                userid: connection.userid,
                remoteUserId
              }
            })
          );

          const reader = new FileReader(); // FileReader 준비
          let chunkIndex = 0;
          const maxChunks = Math.ceil(file.size / chunkSize);

          const sendNextChunk = (start) => {
            const end = Math.min(start + chunkSize, file.size);
            const blob = file.slice(start, end);

            reader.onload = async (e) => {
              const chunk = e.target.result; // ArrayBuffer
              const chunkData = JSON.stringify({
                messageType: 'fileChunk',
                fileName: file.name,
                chunkIndex,
                maxChunks,
                data: Array.from(new Uint8Array(chunk)),
                uuid,
                remoteUserId,
                userid: connection.userid,
                size: file.size,
                type: file.type,
                lastModifiedDate: file.lastModified
              });

              try {
                // eslint-disable-next-line no-await-in-loop
                await sendAsync(channel, chunkData);

                chunkIndex += 1;
                if (end < file.size) {
                  sendNextChunk(end); // 다음 청크 전송
                }
              } catch (error) {
                console.error('Send error while sending chunk:', error);
              }
            };

            reader.readAsArrayBuffer(blob);
          };

          // 첫 번째 청크 전송 시작
          sendNextChunk(0);
        } catch (error) {
          console.error('File transfer error:', error);
        }
      });
    });
  });
};

const sendAsync = (channel, data) =>
  new Promise((resolve, reject) => {
    try {
      if (channel.bufferedAmount < channel.bufferedAmountLowThreshold) {
        channel.send(data);
        resolve();
      } else {
        // 버퍼가 가득 찬 경우 bufferedamountlow 이벤트 대기
        const onBufferLow = () => {
          channel.removeEventListener('bufferedamountlow', onBufferLow);
          try {
            channel.send(data);
            resolve();
          } catch (error) {
            console.error('Send error:', error);
            reject(error);
          }
        };
        channel.addEventListener('bufferedamountlow', onBufferLow);
      }
    } catch (error) {
      console.error('Send error:', error);
      reject(error);
    }
  });

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
