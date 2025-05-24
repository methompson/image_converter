import { initDrop } from "./image_drop";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <div id="timer"></div>
    <div class='dropBox' id="drop">Drop On Me</div>
  </div>
`;

initDrop();
