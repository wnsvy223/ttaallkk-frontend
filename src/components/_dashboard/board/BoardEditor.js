import PropTypes from 'prop-types';

// TOAST UI Editor Component
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';

// TOAST UI Editor Plugins
/**
 * tui-chart 패키지 이슈 : tui-chart의 3버전대 패키지에서 의존성 url이 git:// 형태인 패키지를 포함하고 있어,
 * 인증 관련 빌드 오류(The unauthenticated git protocol on port 9418 is no longer supported.)가 발생하여 제거함.
 * "@toast-ui/chart": "^4.0.0" 로 설치시 해당 의존성url은 해결되지만 현재 사용할 필요없는 패키지라 추가 설치하지 않음.
 */
import chart from '@toast-ui/editor-plugin-chart';
import 'highlight.js/styles/github.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import 'tui-color-picker/dist/tui-color-picker.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import uml from '@toast-ui/editor-plugin-uml';

BoardEditor.propTypes = {
  editorRef: PropTypes.object.isRequired,
  height: PropTypes.string,
  initialValue: PropTypes.string
};

export default function BoardEditor({ editorRef, height, initialValue }) {
  return (
    <Editor
      previewStyle="vertical"
      initialValue={initialValue || ''}
      height={height || '300px'}
      initialEditType="wysiwyg"
      useCommandShortcut
      usageStatistics={false}
      ref={editorRef}
      plugins={[chart, codeSyntaxHighlight, colorSyntax, tableMergedCell, uml]}
      language="ko-KR"
    />
  );
}
