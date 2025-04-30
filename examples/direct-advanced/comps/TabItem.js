import React from 'react';

export default function TabItem(props) {
  // 选项卡项目组件
  return React.createElement('div', {
    className: `tab-item ${props.active ? 'active' : ''}`,
    id: `tab-${props.value}`
  }, props.children);
}
