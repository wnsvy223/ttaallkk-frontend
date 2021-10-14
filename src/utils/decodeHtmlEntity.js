import dompurify from 'dompurify';

/**
 * 이스케이프된 태그 문자열 다시 태그로 치환
 * @param {이스케이프된 문자열} str
 * @returns 태그로 변환시킨 문자열
 */
export function escapeParser(str) {
  str = str.replace(/&lt;/g, '<');
  str = str.replace(/&gt;/g, '>');
  str = str.replace(/&nbsp;/g, ' ');
  str = str.replace(/&amp;/g, '&');
  str = str.replace(/&quot;/g, '"');

  return str;
}

/**
 * dompurify모듈 sanitize 함수를 이용하여 위험한 데이터값 제거
 * @param {sanitize 처리 이전 문자열} str
 * @returns sanitize 처리 된 문자열
 */
function sanitizer(str) {
  return dompurify.sanitize(str);
}

/**
 * XSS 필터링된 html entity 디코딩 처리함수
 * @param {서버에서 XSS 필터링된 데이터} content
 * @returns 디코딩 데이터
 */
export default function decodeHTMLEntity(content) {
  const sanitizedContent = sanitizer(content);
  const escapeData = escapeParser(sanitizedContent);
  const e = document.createElement('div');
  e.innerHTML = escapeData;
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
}
