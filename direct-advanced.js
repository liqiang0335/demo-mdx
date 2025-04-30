import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';

// 获取当前文件所在目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 创建无JSX语法的高级组件
const createAdvancedComponents = () => {
  // 自定义引用块组件
  const Quote = (props) => React.createElement('blockquote', {
    style: {
      borderLeft: '4px solid #ccc',
      paddingLeft: '16px',
      fontStyle: 'italic',
      margin: '16px 0'
    }
  }, props.children);

  // 自定义代码块组件
  const CodeBlock = (props) => {
    // 处理语言类名 (如 language-js)
    const language = props.className ? props.className.replace('language-', '') : 'text';

    return React.createElement('div', {
      style: {
        backgroundColor: '#f5f5f5',
        padding: '16px',
        borderRadius: '4px',
        overflow: 'auto',
        margin: '16px 0'
      }
    }, [
      React.createElement('div', {
        key: 'language',
        style: {
          fontSize: '12px',
          color: '#666',
          marginBottom: '8px'
        }
      }, language),
      React.createElement('pre', { key: 'content' }, props.children)
    ]);
  };

  // 自定义警告组件工厂
  const createCustomAlert = (type = 'info') => {
    const styles = {
      info: { backgroundColor: '#e8f4fd', borderColor: '#b3d7ff' },
      success: { backgroundColor: '#e9fbe8', borderColor: '#c3e6cb' },
      warning: { backgroundColor: '#fff9e6', borderColor: '#ffeeba' },
      error: { backgroundColor: '#feeae9', borderColor: '#f5c6cb' }
    };

    return (props) => React.createElement('div', {
      style: {
        padding: '12px 20px',
        borderLeft: '4px solid',
        margin: '16px 0',
        borderRadius: '3px',
        ...styles[props.type || type]
      }
    }, props.children);
  };

  return {
    // HTML 元素映射
    h1: (props) => React.createElement('h1', {
      style: { color: 'darkblue', borderBottom: '1px solid #eee' },
      ...props
    }, props.children),

    h2: (props) => React.createElement('h2', {
      style: { color: 'darkgreen' },
      ...props
    }, props.children),

    h3: (props) => React.createElement('h3', {
      style: { color: 'darkred' },
      ...props
    }, props.children),

    p: (props) => React.createElement('p', {
      style: { lineHeight: '1.6' },
      ...props
    }, props.children),

    // 链接组件
    a: (props) => React.createElement('a', {
      href: props.href,
      style: {
        color: '#0077cc',
        textDecoration: 'none',
        borderBottom: '1px dashed #0077cc'
      },
      target: "_blank",
      rel: "noopener noreferrer"
    }, props.children),

    // 块级元素
    blockquote: Quote,

    // 代码块处理
    code: (props) => {
      // 内联代码
      if (!props.className) {
        return React.createElement('code', {
          style: { backgroundColor: '#f0f0f0', padding: '2px 4px', borderRadius: '3px' },
          ...props
        }, props.children);
      }
      // 代码块
      return React.createElement(CodeBlock, props, props.children);
    },

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
    }, props.children),

    // 自定义警告组件
    CustomAlert: (props) => {
      const CustomAlertComponent = createCustomAlert(props.type);
      return React.createElement(CustomAlertComponent, props, props.children);
    }
  };
};

async function main() {
  try {
    // 读取 MDX 文件内容
    const mdxContent = await fs.readFile(path.join(__dirname, 'advanced-content.mdx'), 'utf-8');

    // 编译 MDX 内容
    const compiledCode = String(await compile(mdxContent, {
      outputFormat: 'function-body',
      // 不使用 providerImportSource
      remarkPlugins: [remarkGfm] // 添加 GitHub Flavored Markdown 支持
    }));

    // 运行编译后的代码
    const { default: Content } = await run(compiledCode, {
      ...runtime,
      baseUrl: import.meta.url
    });

    // 创建组件并直接传递给 Content
    const components = createAdvancedComponents();
    const container = React.createElement('div', {
      style: {
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
      }
    }, React.createElement(Content, { components }));

    const result = renderToString(container);

    console.log(result);

    // 保存结果到文件
    await fs.writeFile(path.join(__dirname, 'output-direct-advanced.html'), `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>MDX 高级直接组件示例</title>
        </head>
        <body>
          ${result}
        </body>
      </html>
    `);

    console.log('已生成 HTML 文件: output-direct-advanced.html');
  } catch (error) {
    console.error('发生错误:', error);
  }
}

main(); 