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

// 创建无JSX语法的组件
const createComponents = () => {
  return {
    // 覆盖 HTML 元素
    h1: (props) => React.createElement('h1',
      { style: { color: 'blue' }, ...props },
      props.children
    ),
    h2: (props) => React.createElement('h2',
      { style: { color: 'green' }, ...props },
      props.children
    ),

    // 自定义组件
    Wrapper: (props) => React.createElement('div', {
      style: {
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        margin: '10px 0'
      }
    }, props.children),

    Highlight: (props) => React.createElement('div', {
      style: {
        backgroundColor: 'yellow',
        padding: '10px',
        borderRadius: '5px',
        margin: '10px 0'
      }
    }, props.children)
  };
};

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

    // 使用 MDXProvider 提供组件
    const components = createComponents();
    const result = renderToString(
      React.createElement(MDXProvider, { components },
        React.createElement(Content)
      )
    );

    console.log(result);

    // 保存结果到文件
    await fs.writeFile(path.join(__dirname, 'output-esm.html'), `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>MDX Provider 示例</title>
        </head>
        <body>
          ${result}
        </body>
      </html>
    `);

    console.log('已生成 HTML 文件: output-esm.html');
  } catch (error) {
    console.error('发生错误:', error);
  }
}

main(); 