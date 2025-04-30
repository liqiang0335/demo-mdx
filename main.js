import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import Content from './example.mdx'


console.log(renderToStaticMarkup(React.createElement(Content)))