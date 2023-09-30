chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Replace Phrases",
    id: "replacePhrasesMenuItem",
  });
});

chrome.contextMenus.onClicked.addListener(async (_info, tab) => {
  triggerReplacePhrasesAction(tab);
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "replace-phrases") {
    triggerReplacePhrasesAction(tab);
  }
});

async function triggerReplacePhrasesAction(tab) {
  await chrome.storage.sync.set({
    currentURL: tab.url,
  });

  chrome.tabs.sendMessage(tab.id, { action: "replacePhrases" });
}
