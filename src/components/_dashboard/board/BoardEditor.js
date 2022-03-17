import PropTypes from 'prop-types';

// TOAST UI Editor Component
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';

// TOAST UI Editor Plugins
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
      plugins={[codeSyntaxHighlight, colorSyntax, tableMergedCell, uml]}
      language="ko-KR"
    />
  );
}
