import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { compile, run } from '@mdx-js/mdx';
import { MDXProvider } from '@mdx-js/react';
import * as runtime from 'react/jsx-runtime';

// 获取当前文件所在目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  try {
    // 读取 MDX 文件内容
    const mdxContent = await fs.readFile(path.join(__dirname, 'example-content.mdx'), 'utf-8');

    // 编译 MDX 内容
    const compiledCode = String(await compile(mdxContent, {
      outputFormat: 'function-body',
      providerImportSource: '@mdx-js/react'
    }));

    // 运行编译后的代码
    const { default: Content } = await run(compiledCode, {
      ...runtime,
      baseUrl: import.meta.url
    });

    // 定义自定义组件
    const components = {
      // 覆盖 HTML 元素
      h1: props => <h1 style={{ color: 'blue' }} {...props} />,
      h2: props => <h2 style={{ color: 'green' }} {...props} />,

      // 自定义组件
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

    // 使用 MDXProvider 提供组件
    const result = renderToString(
      <MDXProvider components={components}>
        <Content />
      </MDXProvider>
    );

    console.log(result);
  } catch (error) {
    console.error('发生错误:', error);
  }
}

main(); 