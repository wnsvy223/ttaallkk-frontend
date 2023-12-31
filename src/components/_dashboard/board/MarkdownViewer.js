import PropTypes from 'prop-types';

// markdown-it
import MarkdownIt from 'markdown-it';
import MarkdownItAttrs from 'markdown-it-attrs';

// toast-ui
import { Viewer } from '@toast-ui/react-editor';

MarkdownViewer.propTypes = {
  markdown: PropTypes.string
};

export default function MarkdownViewer({ markdown }) {
  /**
   * MarkdownIt, MarkdownItAttrs 모듈을 이용해서 마크다운 이미지의 width, height및 style문법을 파싱해서 html태그로 변환시키는 함수
   * @param {*} content
   * @returns
   */
  const convertMarkdown = (content) => {
    const md = MarkdownIt().use(MarkdownItAttrs);
    const html = md.render(content);
    console.log(html);
    return html;
  };

  return <Viewer initialValue={convertMarkdown(markdown)} />;
}
