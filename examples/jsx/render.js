import { renderToString } from "react-dom/server";
import App from "./app.js";
const html = renderToString(App());
console.log(html);