import React from 'react';
import { renderToString } from 'react-dom/server';
import { MDXProvider } from '@mdx-js/react';
import Content from './provider-example.mdx';
import Highlight from './components/Highlight.js';
import Wrapper from './components/Wrapper.js';

// 定义全局组件映射
const components = {
  // HTML 元素映射到自定义组件
  h1: props => <h1 style={{ color: 'blue' }} {...props} />,
  h2: props => <h2 style={{ color: 'green' }} {...props} />,
  // 自定义组件
  Highlight,
  Wrapper
};

// 使用 MDXProvider 包裹 MDX 内容，提供全局组件
const result = renderToString(
  <MDXProvider components={components}>
    <Content />
  </MDXProvider>
);

console.log(result); 