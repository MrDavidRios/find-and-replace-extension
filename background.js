chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Replace Phrases",
    id: "replacePhrasesMenuItem",
  });
});

chrome.contextMenus.onClicked.addListener(async (_info, tab) => {
  await chrome.storage.sync.set({
    currentURL: tab.url,
  });

  chrome.tabs.sendMessage(tab.id, { action: "replacePhrases" });
});
