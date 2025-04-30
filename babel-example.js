// 这个文件使用 Babel 注册器运行，允许直接使用 JSX 语法
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MDXProvider } from '@mdx-js/react';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { compile } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

// 获取文件路径
const __dirname = dirname(fileURLToPath(import.meta.url));
const mdxPath = join(__dirname, 'example-content.mdx');

async function main() {
  try {
    // 读取 MDX 文件
    const mdxContent = readFileSync(mdxPath, 'utf-8');

    // 编译 MDX
    const compiledCode = String(await compile(mdxContent, {
      outputFormat: 'function-body',
      providerImportSource: '@mdx-js/react'
    }));

    // 创建执行函数
    const runCode = new Function(
      'React',
      'props',
      'runtime',
      'useMDXComponents',
      `${compiledCode}
       return MDXContent(props);`
    );

    // MDXProvider 的 useMDXComponents 函数
    const useMDXComponents = (components) => {
      return components || {};
    };

    // 自定义组件
    const components = {
      h1: props => <h1 style={{ color: 'blue' }} {...props} />,
      h2: props => <h2 style={{ color: 'green' }} {...props} />,
      Wrapper: ({ children }) => (
        <div style={{
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
          margin: '10px 0'
        }}>
          {children}
        </div>
      ),
      Highlight: ({ children }) => (
        <div style={{
          backgroundColor: 'yellow',
          padding: '10px',
          borderRadius: '5px',
          margin: '10px 0'
        }}>
          {children}
        </div>
      )
    };

    // 执行代码获取 Content 组件
    const Content = runCode(React, {}, runtime, useMDXComponents);

    // 使用 MDXProvider 渲染内容
    const html = renderToString(
      <MDXProvider components={components}>
        <Content />
      </MDXProvider>
    );

    console.log(html);
  } catch (error) {
    console.error('发生错误:', error);
  }
}

main(); 