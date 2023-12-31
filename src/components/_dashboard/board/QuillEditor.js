import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import dompurify from 'dompurify';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import BlotFormatter from 'quill-blot-formatter';
import { ImageDrop } from 'quill-image-drop-module';
// import { useQuill } from 'react-quilljs';

// Quill 모듈 등록
Quill.register('modules/ImageResize', ImageResize);
Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register('modules/imageDrop', ImageDrop);

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    [{ align: [] }, { color: [] }, { background: [] }],
    ['clean']
  ],
  ImageResize: {
    parchment: Quill.import('parchment')
  },
  imageDrop: true
};

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'code-block'
];

QuillEditor.propTypes = {
  editorRef: PropTypes.object.isRequired,
  initialValue: PropTypes.string,
  height: PropTypes.string
};

// Quill 에디터 컨탠츠의 HTML 데이터에서 이미지 태그의 스타일 속성을 파싱하여 반환하는 함수
const parseImageStyle = (html) => {
  const parser = new DOMParser();
  const sanitizedHtml = dompurify.sanitize(html);
  const doc = parser.parseFromString(sanitizedHtml, 'text/html');
  const images = doc.querySelectorAll('img');
  const styles = {};

  images.forEach((image) => {
    const style = image.getAttribute('style');
    if (style) {
      styles[image.src] = style;
    }
  });

  return styles;
};

// Quill 에디터 컨탠츠 마크다운 데이터 반환 함수(마크다운 문법의 이미지 width attributes값이 포함된 데이터)
export const getMarkdownWithAttributes = (editor) => {
  // acc : 에디터에 작성되어있는 마크다운 데이터
  // op : 에디터에 추가되는 마크다운 데이터
  // 마크다운 에디터의 contents 값에서 이미지 리사이징 모듈에 의해 추가되는 width attributes값을 추출하여
  // 마크다운 내용을 width가 포함된 내용으로 치환하여 반환
  const markdownStringWithImage = editor.getContents().ops.reduce((acc, op) => {
    // console.log(op);
    if (op.insert && op.insert.image && op.attributes) {
      const width = op?.attributes?.width; // width 속성
      const styles = parseImageStyle(editor.root.innerHTML); // style 속성 객체(객체의 키값은 이미지 src값)
      return `${acc}![](${op.insert.image}){width=${width} style="${styles[op.insert.image]}"}`;
    }
    return acc + op.insert;
  }, '');
  return markdownStringWithImage;
};

export default function QuillEditor({ editorRef, height, initialValue }) {
  return (
    <div>
      <ReactQuill
        ref={editorRef}
        style={{ height }}
        modules={modules}
        formats={formats}
        defaultValue={initialValue || ''}
      />
    </div>
  );
}
