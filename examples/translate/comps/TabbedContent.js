import React from 'react';

export default function TabbedContent(props) {
  // 选项卡容器组件
  return React.createElement('div', {
    className: 'tabbed-content'
  }, props.children);
}
