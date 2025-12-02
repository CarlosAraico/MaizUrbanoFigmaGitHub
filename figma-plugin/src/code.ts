import ui from "./ui.html?raw";

figma.showUI(ui, { width: 380, height: 520 });

figma.ui.onmessage = (msg) => {
  if (msg?.type === "notify") {
    figma.notify(msg.message || "Listo");
  }

  if (msg?.type === "close") {
    figma.closePlugin();
  }
};
