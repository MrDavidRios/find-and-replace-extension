chrome.runtime.onInstalled.addListener(() => {});

// chrome.tabs.onActivated.addListener((activeInfo) => {
// 	applyEnhancementScript(activeInfo.tabId);
// });

// chrome.tabs.onUpdated.addListener((tabId, info) => {
// 	if (info.status === 'complete') {
// 		applyEnhancementScript(tabId);
// 	}
// });

// function applyReplacements(tabId) {
// 	chrome.tabs.get(tabId, async (tab) => {
// 		chrome.scripting.executeScript({
// 			target: { tabId: tab.id },
// 			files: ['content.js']
// 		});
// 	});
// }
