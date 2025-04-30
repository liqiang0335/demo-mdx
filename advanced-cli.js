import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { compile, run } from '@mdx-js/mdx';
import { MDXProvider } from '@mdx-js/react';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';

// 获取当前文件所在目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  try {
    // 读取 MDX 文件内容
    const mdxContent = await fs.readFile(path.join(__dirname, 'advanced-content.mdx'), 'utf-8');

    // 编译 MDX 内容
    const compiledCode = String(await compile(mdxContent, {
      outputFormat: 'function-body',
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [remarkGfm] // 添加 GitHub Flavored Markdown 支持
    }));

    // 运行编译后的代码
    const { default: Content } = await run(compiledCode, {
      ...runtime,
      baseUrl: import.meta.url
    });

    // 自定义引用块组件
    const Quote = ({ children }) => (
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
    const CodeBlock = ({ children, className }) => {
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

    // 定义全局组件映射
    const components = {
      // HTML 元素映射
      h1: props => <h1 style={{ color: 'darkblue', borderBottom: '1px solid #eee' }} {...props} />,
      h2: props => <h2 style={{ color: 'darkgreen' }} {...props} />,
      h3: props => <h3 style={{ color: 'darkred' }} {...props} />,
      p: props => <p style={{ lineHeight: '1.6' }} {...props} />,

      // 链接组件
      a: ({ href, children }) => (
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
      ),

      // 块级元素
      blockquote: Quote,

      // 代码块处理
      code: (props) => {
        // 内联代码
        if (!props.className) {
          return <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px', borderRadius: '3px' }} {...props} />;
        }
        // 代码块
        return <CodeBlock {...props} />;
      },

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
      ),

      // 自定义警告组件
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

    // 保存 HTML 到文件
    await fs.writeFile(path.join(__dirname, 'output.html'), `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>MDX Provider 高级示例</title>
        </head>
        <body>
          ${result}
        </body>
      </html>
    `);

    console.log('已生成 HTML 文件: output.html');
  } catch (error) {
    console.error('发生错误:', error);
  }
}

main(); 