// RTCMultiConnection 라이브러리가 window.RTCPeerConnection을 모듈 로드 시점에
// 로컬 변수로 캡처하기 때문에, 라이브러리가 로드되기 전에 전역을 래핑해야 한다.
// 이 파일은 반드시 RTCMultiConnection 라이브러리 import보다 먼저 import되어야 한다.
//
// 문제: 라이브러리가 config에 null(iceCandidatePoolSize, bundlePolicy 등)을 넣는데
// 최신 Chrome이 null을 거부해 InvalidAccessError로 피어 생성이 실패한다. 결국
// fallback 경로에서 빈 config로 피어가 생성되어 TURN/STUN이 설정되지 않는다.
// 해결: 생성자 호출 직전에 config에서 null 값을 제거한다.

if (typeof window !== 'undefined' && window.RTCPeerConnection) {
  const OriginalRTCPeerConnection = window.RTCPeerConnection;

  const stripNulls = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    const out = {};
    Object.keys(obj).forEach((k) => {
      if (obj[k] !== null) out[k] = obj[k];
    });
    return out;
  };

  const WrappedRTCPeerConnection = function WrappedRTCPeerConnection(config, constraints) {
    return new OriginalRTCPeerConnection(stripNulls(config), constraints);
  };

  WrappedRTCPeerConnection.prototype = OriginalRTCPeerConnection.prototype;
  WrappedRTCPeerConnection.generateCertificate = OriginalRTCPeerConnection.generateCertificate;
  window.RTCPeerConnection = WrappedRTCPeerConnection;
}
