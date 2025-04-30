import React from 'react';

// 自定义引用块组件
export const Quote = ({ children }) => (
  <blockquote style={{
    borderLeft: '4px solid #ccc',
    paddingLeft: '16px',
    fontStyle: 'italic',
    margin: '16px 0'
  }}>
    {children}
  </blockquote>
);

// 自定义代码块组件
export const CodeBlock = ({ children, className }) => {
  // 处理语言类名 (如 language-js)
  const language = className ? className.replace('language-', '') : 'text';

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '16px',
      borderRadius: '4px',
      overflow: 'auto',
      margin: '16px 0'
    }}>
      <div style={{
        fontSize: '12px',
        color: '#666',
        marginBottom: '8px'
      }}>
        {language}
      </div>
      <pre>{children}</pre>
    </div>
  );
};

// 自定义链接组件
export const Link = ({ href, children }) => (
  <a
    href={href}
    style={{
      color: '#0077cc',
      textDecoration: 'none',
      borderBottom: '1px dashed #0077cc'
    }}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
); 