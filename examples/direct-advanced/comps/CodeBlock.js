import React from 'react';
import Prism from 'prismjs';

// 导入常用的语言支持
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-sql.js';



// 自定义代码块组件，增加Prism高亮支持
const CodeBlock = (props) => {

  // 处理语言类名 (如 language-js)
  const language = props.className
    ? props.className.replace('language-', '')
      .replace('prisma', 'sql') // 将 prisma语言替换为 js
    : 'text';

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

  return React.createElement('div', { className: 'myapp-code-block' },
    [
      React.createElement('div', { key: 'language', className: 'myapp-code-block-language' }, language),
      React.createElement('pre', { key: 'content', className: 'myapp-code-block-content' },
        React.createElement('code', { className: `language-${language}`, dangerouslySetInnerHTML: { __html: highlightedCode } }))
    ]);
};

export default CodeBlock;
