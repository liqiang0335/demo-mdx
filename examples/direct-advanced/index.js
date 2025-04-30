import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import templateHtml from "./comps/template-html.js";
import TabItem from './comps/TabItem.js';
import TabbedContent from './comps/TabbedContent.js';
import TopBlock from './comps/TopBlock.js';
import CodeBlock from './comps/CodeBlock.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


/**
 * 创建无JSX语法的高级组件
 */
const createAdvancedComponents = () => {

  // 自定义警告组件工厂
  const createCustomAlert = (type = 'info') => {
    return (props) => React.createElement('div', { className: `myapp-admonition ${props.type || type}` }, props.children);
  };

  return {
    // HTML 元素映射
    h1: (props) => React.createElement('h1', { className: 'myapp-h1', ...props }, props.children),
    h2: (props) => React.createElement('h2', { className: 'myapp-h2', ...props }, props.children),
    h3: (props) => React.createElement('h3', { className: 'myapp-h3', ...props }, props.children),
    p: (props) => React.createElement('p', { className: 'myapp-p', ...props }, props.children),
    a: (props) => React.createElement('a', { className: 'myapp-a', href: props.href, target: "_blank", rel: "noopener noreferrer", ...props }, props.children),
    blockquote: (props) => React.createElement('blockquote', { className: 'myapp-quote' }, props.children),
    code: (props) => {
      if (!props.className) return React.createElement('code', { className: 'myapp-inlincode', ...props }, props.children); // 内联代码
      return React.createElement(CodeBlock, props, props.children);   // 代码块
    },
    Wrapper: (props) => React.createElement('div', { className: 'myapp-wrapper', ...props }, props.children),
    Highlight: (props) => React.createElement('div', { className: 'myapp-highlight', ...props }, props.children),
    Admonition: (props) => {
      const CustomAlertComponent = createCustomAlert(props.type);
      return React.createElement(CustomAlertComponent, props, props.children);
    },
    TabItem,
    TabbedContent,
    TopBlock,
  };
};

/**
 * 项目说明:
 * 这是一个高级MDX处理工具，用于将MDX内容转换为HTML。
 * 该工具提供了自定义组件支持，包括引用块、代码块和警告提示等。
 * 它使用React服务端渲染和MDX编译器来处理Markdown和JSX混合内容。
 * 支持remark-gfm插件，可以处理GitHub风格的Markdown扩展语法。 
 */

async function main(source, output) {
  try {
    // 读取 MDX 文件内容
    const mdxContent = await fs.readFile(path.join(__dirname, source), 'utf-8');
    // 编译 MDX 内容
    // 不使用 providerImportSource
    // 添加 GitHub Flavored Markdown 支持
    const compiledCode = String(await compile(mdxContent, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm]
    }));
    // 运行编译后的代码
    const { default: Content } = await run(compiledCode, { ...runtime, baseUrl: import.meta.url });
    // 创建组件并直接传递给 Content
    const container = React.createElement('div', {
      className: 'container'
    }, React.createElement(Content, { components: createAdvancedComponents() }));

    const result = renderToString(container);
    // 保存结果到文件
    await fs.writeFile(path.join(__dirname, output), templateHtml(result));
    console.log("✅ Success");
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
}


/**
 * 测试
 */
const SOURCE = 'source.mdx';
const OUTPUT = 'output.html';
main(SOURCE, OUTPUT);