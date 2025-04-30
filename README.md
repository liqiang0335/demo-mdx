# MDX Provider 示例项目

这个项目展示了如何使用 `@mdx-js/react` 中的 `MDXProvider` 组件来为 MDX 内容提供全局可用的组件。

## 项目结构

```
.
├── components/               # 可复用组件
│   ├── Highlight.js          # 高亮显示组件
│   └── Wrapper.js            # 包装器组件
├── custom-components.js      # 自定义 MDX 组件（引用块、代码块等）
├── example.mdx               # 基本 MDX 示例
├── example-content.mdx       # 用于 CLI 示例的 MDX 内容
├── advanced-content.mdx      # 高级 MDX 示例内容
├── main.js                   # 基本 MDX 渲染脚本
├── direct-components.js      # 直接传递组件示例（推荐）
├── pure-esm-example.js       # 纯 ESM 环境示例
├── pure-esm-advanced.js      # 高级纯 ESM 环境示例
└── package.json              # 项目依赖
```

## 安装

使用 pnpm 安装依赖：

```bash
pnpm install
```

## 运行示例

### 1. 直接传递组件示例（推荐方式）

这是最简单、最可靠的方式，不使用 MDXProvider，而是直接将组件传递给 MDX 组件：

```bash
pnpm direct
```

这将生成 `output-direct.html` 文件，包含渲染后的结果。

### 2. 其他示例

项目包含多种示例，但由于 MDXProvider 和 JSX 在 ESM 环境中的兼容性问题，某些示例可能无法直接运行。以下是可用的命令：

```bash
# 纯 ESM 示例（无 MDXProvider）
pnpm esm:example
pnpm esm:advanced

# 尝试使用 Babel 转换 JSX 的示例
pnpm babel:example

# 原始示例（可能需要配置调整）
pnpm example
pnpm provider:basic
pnpm provider:advanced
```

## MDXProvider 使用要点

1. **设置环境**：
   - 需要安装 `@mdx-js/react` 包
   - 配置加载器时需启用 `providerImportSource: '@mdx-js/react'` 选项

2. **基本用法**：
   ```jsx
   import { MDXProvider } from '@mdx-js/react';
   import Content from './your-mdx-file.mdx';
   
   const components = {
     h1: props => <h1 style={{ color: 'blue' }} {...props} />,
     // 更多组件...
   };
   
   export default () => (
     <MDXProvider components={components}>
       <Content />
     </MDXProvider>
   );
   ```

3. **替代方案**：直接传递组件
   ```jsx
   import Content from './your-mdx-file.mdx';
   
   const components = {
     h1: props => <h1 style={{ color: 'blue' }} {...props} />,
     // 更多组件...
   };
   
   export default () => <Content components={components} />;
   ```

4. **组件映射**：
   - 可以映射 HTML 元素 (`h1`, `p`, `blockquote` 等)
   - 可以提供自定义组件作为 JSX 元素使用

## 参考资料

- [MDX 官方文档](https://mdxjs.com/)
- [@mdx-js/react 文档](https://mdxjs.com/packages/react/) 