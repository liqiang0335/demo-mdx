# MDX  示例项目

- examples
  - direct-components 直接组件示例
  - direct-advanced 直接高级组件示例
  - node-loader 使用 node-loader 示例

## 转换JSX

```bash
pnpm add -D @babel/core @babel/cli @babel/preset-react

npx babel  examples/jsx/app.jsx --out-file examples/jsx/app.2.js
```
