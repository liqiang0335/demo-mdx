import React from 'react';
import { renderToString } from 'react-dom/server';
import { MDXProvider } from '@mdx-js/react';
import Content from './advanced-example.mdx';
import Highlight from './components/Highlight.js';
import Wrapper from './components/Wrapper.js';
import { Quote, CodeBlock, Link } from './custom-components.js';

// 定义全局组件映射
const components = {
  // HTML 元素映射
  h1: props => <h1 style={{ color: 'darkblue', borderBottom: '1px solid #eee' }} {...props} />,
  h2: props => <h2 style={{ color: 'darkgreen' }} {...props} />,
  h3: props => <h3 style={{ color: 'darkred' }} {...props} />,
  p: props => <p style={{ lineHeight: '1.6' }} {...props} />,
  a: Link,  // 使用自定义链接组件
  blockquote: Quote,  // 使用自定义引用组件

  // 代码块处理
  code: (props) => {
    // 内联代码
    if (!props.className) {
      return <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px', borderRadius: '3px' }} {...props} />;
    }
    // 代码块
    return <CodeBlock {...props} />;
  },

  // 内置组件
  Highlight,
  Wrapper,

  // 自定义组件
  CustomAlert: ({ children, type = 'info' }) => {
    const styles = {
      info: { backgroundColor: '#e8f4fd', borderColor: '#b3d7ff' },
      success: { backgroundColor: '#e9fbe8', borderColor: '#c3e6cb' },
      warning: { backgroundColor: '#fff9e6', borderColor: '#ffeeba' },
      error: { backgroundColor: '#feeae9', borderColor: '#f5c6cb' }
    };

    return (
      <div style={{
        padding: '12px 20px',
        borderLeft: '4px solid',
        margin: '16px 0',
        borderRadius: '3px',
        ...styles[type]
      }}>
        {children}
      </div>
    );
  }
};

// 使用 MDXProvider 包裹 MDX 内容，提供全局组件
const result = renderToString(
  <MDXProvider components={components}>
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Content />
    </div>
  </MDXProvider>
);

console.log(result); 