import React from 'react';

export default function TopBlock(props) {
  // 顶部块组件
  return React.createElement('div', {
    className: 'top-block'
  }, props.children);
}
