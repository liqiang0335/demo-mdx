import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import templateHtml from "./template-html";


// 导入常用的语言支持
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-python.js';

/**
 * 项目说明:
 * 这是一个高级MDX处理工具，用于将MDX内容转换为HTML。
 * 该工具提供了自定义组件支持，包括引用块、代码块和警告提示等。
 * 它使用React服务端渲染和MDX编译器来处理Markdown和JSX混合内容。
 * 支持remark-gfm插件，可以处理GitHub风格的Markdown扩展语法。 
 */
const SOURCE = 'source.mdx';
const OUTPUT = 'output.html';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 创建无JSX语法的高级组件
const createAdvancedComponents = () => {
  // 自定义引用块组件
  const Quote = (props) => React.createElement('blockquote', {
    className: 'myapp-quote',
    style: { borderLeft: '4px solid #ccc', paddingLeft: '16px', fontStyle: 'italic', margin: '16px 0' }
  }, props.children);

  // 自定义代码块组件，增加Prism高亮支持
  const CodeBlock = (props) => {
    // 处理语言类名 (如 language-js)
    const language = props.className ? props.className.replace('language-', '') : 'text';

    // 获取代码内容
    const code = typeof props.children === 'string' ? props.children : '';

    // 使用Prism高亮代码
    let highlightedCode = code;
    if (language !== 'text' && Prism.languages[language]) {
      try {
        highlightedCode = Prism.highlight(code, Prism.languages[language], language);
      } catch (error) {
        console.warn(`代码高亮失败: ${language}`);
      }
    }

    return React.createElement('div', {
      className: 'myapp-code-block',
      style: { backgroundColor: '#282c34', padding: '16px', borderRadius: '4px', overflow: 'auto', margin: '16px 0' }
    }, [
      React.createElement('div', {
        key: 'language',
        className: 'myapp-code-block-language',
        style: { fontSize: '12px', color: '#9ca3af', marginBottom: '8px', fontFamily: 'monospace' }
      }, language),
      React.createElement('pre', {
        key: 'content',
        className: 'myapp-code-block-content',
        style: { margin: 0, fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5' }
      },
        React.createElement('code', {
          className: `language-${language}`,
          dangerouslySetInnerHTML: { __html: highlightedCode },
          style: { display: 'block', color: '#e5e7eb' }
        }))
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
      className: 'myapp-admonition',
      style: {
        padding: '12px 20px', borderLeft: '4px solid', margin: '16px 0', borderRadius: '3px',
        ...styles[props.type || type]
      }
    }, props.children);
  };

  return {
    // HTML 元素映射
    h1: (props) => React.createElement('h1', {
      className: 'myapp-h1',
      style: { color: 'darkblue', borderBottom: '1px solid #eee' },
      ...props
    }, props.children),

    h2: (props) => React.createElement('h2', {
      className: 'myapp-h2',
      style: { color: 'darkgreen' },
      ...props
    }, props.children),

    h3: (props) => React.createElement('h3', {
      className: 'myapp-h3',
      style: { color: 'darkred' },
      ...props
    }, props.children),

    p: (props) => React.createElement('p', {
      className: 'myapp-p',
      style: { lineHeight: '1.6' },
      ...props
    }, props.children),

    // 链接组件
    a: (props) => React.createElement('a', {
      className: 'myapp-a',
      href: props.href,
      style: { color: '#0077cc', textDecoration: 'none', borderBottom: '1px dashed #0077cc' },
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
          className: 'myapp-inlincode',
          style: { backgroundColor: '#f0f0f0', padding: '2px 4px', borderRadius: '3px' },
          ...props
        }, props.children);
      }
      // 代码块
      return React.createElement(CodeBlock, props, props.children);
    },

    // 自定义组件
    Wrapper: (props) => React.createElement('div', {
      className: 'myapp-wrapper',
      style: { border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px 0' }
    }, props.children),

    Highlight: (props) => React.createElement('div', {
      className: 'myapp-highlight',
      style: { backgroundColor: 'yellow', padding: '10px', borderRadius: '5px', margin: '10px 0' }
    }, props.children),

    // 自定义警告组件
    Admonition: (props) => {
      const CustomAlertComponent = createCustomAlert(props.type);
      return React.createElement(CustomAlertComponent, props, props.children);
    }
  };
};

async function main() {
  try {
    // 读取 MDX 文件内容
    const mdxContent = await fs.readFile(path.join(__dirname, SOURCE), 'utf-8');

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
    await fs.writeFile(path.join(__dirname, OUTPUT), templateHtml(result));
    console.log(`已生成 HTML 文件: ${OUTPUT}`);
  } catch (error) {
    console.error('发生错误:', error);
  }
}

main(); 