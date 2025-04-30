export default function TemplateHtml(result) {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>MDX 高级直接组件示例</title>
          <style>
            code[class*="language-"],
            pre[class*="language-"] {
              color: #ccc;
              background: none;
              font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
              font-size: 1em;
              text-align: left;
              white-space: pre;
              word-spacing: normal;
              word-break: normal;
              word-wrap: normal;
              line-height: 1.5;
              tab-size: 4;
              hyphens: none;
            }
            
            /* Prism 高亮样式 */
            .token.comment,
            .token.block-comment,
            .token.prolog,
            .token.doctype,
            .token.cdata {
              color: #999;
            }

            .token.punctuation {
              color: #ccc;
            }

            .token.tag,
            .token.attr-name,
            .token.namespace,
            .token.deleted {
              color: #e2777a;
            }

            .token.function-name {
              color: #6196cc;
            }

            .token.boolean,
            .token.number,
            .token.function {
              color: #f08d49;
            }

            .token.property,
            .token.class-name,
            .token.constant,
            .token.symbol {
              color: #f8c555;
            }

            .token.selector,
            .token.important,
            .token.atrule,
            .token.keyword,
            .token.builtin {
              color: #cc99cd;
            }

            .token.string,
            .token.char,
            .token.attr-value,
            .token.regex,
            .token.variable {
              color: #7ec699;
            }

            .token.operator,
            .token.entity,
            .token.url {
              color: #67cdcc;
            }

            .token.important,
            .token.bold {
              font-weight: bold;
            }

            .token.italic {
              font-style: italic;
            }

            .token.entity {
              cursor: help;
            }

            .token.inserted {
              color: green;
            }
          </style>
        </head>
        <body>
          ${result}
        </body>
      </html>
    `
}
