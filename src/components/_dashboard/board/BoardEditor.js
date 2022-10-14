import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

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

// react-moveable
import Moveable from 'react-moveable';

BoardEditor.propTypes = {
  editorRef: PropTypes.object.isRequired,
  height: PropTypes.string,
  initialValue: PropTypes.string,
  customHTMLRenderer: PropTypes.object
};

export default function BoardEditor({ editorRef, height, initialValue, customHTMLRenderer }) {
  const [resizeTarget, setResizeTarget] = useState(null);
  const [editorChange, setEditorChange] = useState(null);

  // 에디터 내용 상태 변화 이벤트
  const handleChange = (e) => {
    setEditorChange(e);
  };

  // 클릭한 이미지를 리사이징 타겟으로 설정
  const handleClick = useCallback((e) => {
    e.preventDefault();
    setResizeTarget(e.target);
  }, []);

  // editorChange상태값을 에디터의 onChange이벤트에 연결하여 에디터 내용이 변경될 경우 에디터 내부 요소들중 이미지를 가져와 imageArr 배열에 추가
  useEffect(() => {
    const images = document.querySelectorAll(
      '.toastui-editor-contents p img:not(.ProseMirror-separator)'
    );
    Object.values(images).forEach((img) => {
      img.addEventListener('click', handleClick);
    });
    return () => {
      setResizeTarget(null);
      setEditorChange(null);
      Object.values(images).forEach((img) => {
        img.removeEventListener('click', handleClick);
      });
    };
  }, [editorChange, handleClick]);

  // 에디터 내부 컨탠츠 영역의 스크롤이벤트 캐치해서 리사이징 박스 제거
  useEffect(() => {
    let mounted = true;
    const container = document.querySelector('.ProseMirror.toastui-editor-contents');
    container.addEventListener('scroll', () => {
      if (mounted) {
        setResizeTarget(null);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 클릭한 부분이 이미지가 아니면 리사이징 박스 제거
  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (e.target.tagName !== 'IMG') {
        setResizeTarget(null);
      }
    });
  }, []);

  return (
    <div>
      <Moveable
        target={resizeTarget}
        container={null}
        origin
        edge={false}
        warpable={false}
        resizable={false}
        scalable
        draggable
        throttleDrag={0}
        onDrag={({ target, transform }) => {
          target.style.transform = transform;
        }}
        throttleScale={0}
        onScale={({ target, transform }) => {
          target.style.transform = transform;
        }}
      />
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
        customHTMLRenderer={customHTMLRenderer}
        onChange={handleChange}
      />
    </div>
  );
}
