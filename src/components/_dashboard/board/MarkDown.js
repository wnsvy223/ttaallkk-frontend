import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism/atom-dark';
import ReactMarkdown from 'react-markdown';
import { Box } from '@material-ui/core';

const Markdown = ({ content }) => (
  <Box sx={{ pt: 1, pb: 1 }}>
    <ReactMarkdown
      children={content}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, '')}
              style={dark}
              language={match[1]}
              PreTag="div"
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {content}
            </code>
          );
        }
      }}
    />
  </Box>
);

export default Markdown;
