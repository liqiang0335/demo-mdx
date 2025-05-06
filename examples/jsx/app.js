import React from "react";

/**
 * 将 jsx 转换为 react 的 createElement 形式
 * 执行命令: npx babel  examples/jsx/app.jsx --out-file examples/jsx/app.js
 */
export default function App() {
  return /*#__PURE__*/React.createElement("div", {
    className: "layer-1"
  }, /*#__PURE__*/React.createElement("div", null, "Hello"), /*#__PURE__*/React.createElement("div", {
    className: "layer-2"
  }, "level-b", /*#__PURE__*/React.createElement(SubComponent, null)));
}
function SubComponent() {
  return /*#__PURE__*/React.createElement("div", {
    className: "layer-3"
  }, "level-c");
}
