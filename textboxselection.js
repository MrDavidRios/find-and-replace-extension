document.addEventListener(
  "click",
  (e) => {
    e = e || window.event;
    var target = e.target;

    if (
      target.getAttribute("aria-label") == "Message Body" &&
      target.getAttribute("role") == "textbox"
    )
      chrome.storage.sync.set({ lastSelectedGmailTextboxID: target.id });
  },
  false
);
