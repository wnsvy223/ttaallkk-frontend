// XSS 필터링된 html entity 디코딩 처리함수
export default function decodeHTMLEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}
