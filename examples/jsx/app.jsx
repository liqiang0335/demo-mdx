import React from "react";

/**
 * 将 jsx 转换为 react 的 createElement 形式
 * 执行命令: npx babel  examples/jsx/app.jsx --out-file examples/jsx/app.js
 */
export default function App() {
  return <div className="layer-1">
    <div>Hello</div>
    <div className="layer-2">
      level-b
      <SubComponent />
    </div>
  </div>;
}

function SubComponent() {
  return <div className="layer-3">level-c</div>;
}
