import { Content } from '../model/Content';

const markdownRegex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/gm; // MarkDown 이미지 태그 정규표현식
const htmlRegex = /<img[^>]*src="([^"]+)"[^>]*>/gm; // HTML 이미지 태그 정규표현식

/**
 * 본문의 마크다운 이미지 태그를 HTML 이미지 태그로 치환하여 반환하는 함수
 * @param {*} markdown 마크다운 본문
 * @param {*} html HTML 본문
 * @returns 치환된 본문 내용
 */
const convertImgMarkdownToHtml = (markdown, html) => {
  const content = new Content(markdown); // Content DTO 생성
  const markdownMatch = markdown.match(markdownRegex);
  const htmlMatch = html.match(htmlRegex);
  const contentMatch = content.getContent().match(htmlRegex);

  if (markdownMatch && htmlMatch) {
    const markdownImages = [...markdownMatch]; // Markdown content 값에서 마크다운 이미지 태그 추출 배열
    const htmlImages = [...htmlMatch]; // HTML content 값에서 이미지 태그 추출 배열
    for (let i = 0; i < htmlImages.length; i += 1) {
      content.setContent(content.getContent().replace(markdownImages[i], htmlImages[i])); // markdown 값에서 이미지 태그들만 html형식으로 치환후 저장
    }
  } else if (contentMatch) {
    const contentImages = [...contentMatch]; // 조회된 content값에서 HTML 이미지 태그 추출 배열
    const htmlImages = [...htmlMatch]; // HTML content 값에서 이미지 태그 추출 배열
    for (let i = 0; i < htmlImages.length; i += 1) {
      content.setContent(content.getContent().replace(contentImages[i], htmlImages[i]));
    }
  } else {
    content.setContent(content.getContent());
  }

  return content.getContent();
};

/**
 * 게시글 본문 데이터에 포함된 이미지 태그의 이미지 경로 추출
 * @param {r} content
 * @returns
 */
const extractImageFromContent = (content) => {
  const regex = /!\[.*?\]\((.*?)\)/g; // 마크다운 이미지 경로 추출  정규표현
  const imagePaths = [];
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(content)) !== null) {
    imagePaths.push(match[1]);
  }

  return imagePaths;
};

export { convertImgMarkdownToHtml, extractImageFromContent };
