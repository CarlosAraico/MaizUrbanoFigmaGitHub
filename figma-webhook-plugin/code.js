async function sendWebhook(payload) {
  const url = "http://localhost:3000/api/webhooks";
  const secret = "supersecreto123";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": secret
      },
      body: JSON.stringify(payload)
    });

    await res.json().catch(() => ({}));
    figma.notify("Webhook enviado correctamente");
  } catch (e) {
    figma.notify("Error enviando webhook");
  }
}

figma.showUI(__html__, { width: 320, height: 180 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "send-webhook") {
    const node = figma.currentPage.selection[0] || null;

    const payload = {
      event: "figma-plugin",
      action: msg.action,
      nodeId: node?.id || null,
      nodeName: node?.name || null,
      timestamp: Date.now()
    };

    sendWebhook(payload);
  }
};
