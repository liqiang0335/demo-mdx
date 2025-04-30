import { register } from 'node:module'
import babelRegister from '@babel/register'

// 注册 Babel 以支持 JSX
babelRegister({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  extensions: ['.js', '.jsx']
})

// 注册 MDX 加载器
register('@mdx-js/node-loader', import.meta.url, {
  format: 'mdx',
  jsxImportSource: 'react',
  jsx: true,
  extensions: ['.mdx', '.md', '.jsx', '.js']
})