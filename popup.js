let replacePhrasesButton = document.getElementById("replacePhrasesButton");
let resetDefaultsButton = document.getElementById("resetDefaultsButton");
let addEntryButton = document.getElementById("addEntryButton");

let initialized = false;

replacePhrasesButton.addEventListener("click", async () => {
  let [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  await chrome.storage.sync.set({
    currentURL: activeTab.url,
  });

  chrome.tabs.sendMessage(activeTab.id, { action: "replacePhrases" });
});

let replacementPhrases = [
  { toReplace: "emdash", replaceWith: "\u2014", enabled: true },
];

const dictUI = document.getElementById("replaceDict");

resetDefaultsButton.addEventListener("click", () => {
  replacementPhrases = [
    { toReplace: "emdash", replaceWith: "\u2014", enabled: true },
  ];

  saveReplacementPhrases();

  dictUI.innerHTML = "";

  updateInputs();
});

resetDefaultsButton.addEventListener("keypress", (e) => {
  if (e.key === "Enter") resetDefaultsButton.click();
});

addEntryButton.addEventListener("click", () => {
  // If last input row is empty, don't allow adding.
  const lastToReplaceInput = document.querySelector(
    `input[idx="${replacementPhrases.length - 1}"]:not([type="checkbox"])`
  );
  const lastReplaceWithInput = document.querySelector(
    `input[idx="${replacementPhrases.length - 1}"][repltype="replaceWith"]`
  );

  replacementPhrases[replacementPhrases.length - 1]["toReplace"] =
    lastToReplaceInput.value;
  replacementPhrases[replacementPhrases.length - 1]["replaceWith"] =
    lastReplaceWithInput.value;

  if (lastToReplaceInput.value != "") addInputRow();
});

addEntryButton.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addEntryButton.click();
});

// Load saved repacement phrases from storage
chrome.storage.sync.get("replacementPhrases", (data) => {
  if (data["replacementPhrases"] == undefined) updateInputs();
  else {
    replacementPhrases = data["replacementPhrases"];

    if (replacementPhrases.length == 0) addInputRow();

    updateInputs();
  }

  // This is done later to prevent any accidental data overriding
  setupAutosaveListeners();
  setupDeleteButtonsAndCheckboxes();
});

function setupAutosaveListeners() {
  document.querySelectorAll("input").forEach((input) => {
    const idx = parseInt(input.getAttribute("idx"));
    const replType = input.getAttribute("replType");

    input.addEventListener("focusout", () => {
      replacementPhrases[idx][replType] = input.value;

      saveReplacementPhrases();
    });
  });
}

function setupDeleteButtonsAndCheckboxes() {
  document.querySelectorAll(".remove-btn").forEach((removeBtn) => {
    removeBtn.addEventListener("click", () => {
      if (replacementPhrases.length == 1) addInputRow();

      const siblingInput = removeBtn.parentElement.querySelector("input");
      const idx = parseInt(siblingInput.getAttribute("idx"));

      replacementPhrases.splice(idx, 1);

      saveReplacementPhrases();
      updateInputs();
    });

    removeBtn.addEventListener("keypress", (e) => {
      if (e.key === "Enter") removeBtn.click();
    });
  });

  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    const idx = parseInt(checkbox.getAttribute("idx"));

    checkbox.addEventListener("change", () => {
      replacementPhrases[idx].enabled = checkbox.checked;
    });
  });
}

function saveReplacementPhrases() {
  let replacementPhrasesToSave = JSON.parse(JSON.stringify(replacementPhrases));

  let indicesToDelete = [];
  for (let i = 0; i < replacementPhrasesToSave.length; i++) {
    const phrase = replacementPhrasesToSave[i];

    if (phrase["toReplace"] == "" && phrase["replaceWith"] == "")
      indicesToDelete.push(i);
  }

  indicesToDelete.forEach((idx) => {
    replacementPhrasesToSave.splice(idx, 1);
  });

  chrome.storage.sync.set({ replacementPhrases: replacementPhrasesToSave });
}

function updateInputs() {
  dictUI.innerHTML = "";

  for (let i = 0; i < replacementPhrases.length; i++) {
    const replacementPhrase = replacementPhrases[i];

    dictUI.innerHTML += createInputRow(
      i,
      replacementPhrase["toReplace"],
      replacementPhrase["replaceWith"]
    );
  }

  updateCheckboxes();
  setupDeleteButtonsAndCheckboxes();
}

function updateCheckboxes() {
  for (let i = 0; i < replacementPhrases.length; i++) {
    const replacementPhrase = replacementPhrases[i];

    const checkbox = document.querySelector(
      `input[idx="${i}"][type="checkbox"]`
    );

    if (replacementPhrase["enabled"]) checkbox.checked = true;
    else checkbox.checked = false;
  }
}

// Returns HTML code for an input row.
function createInputRow(i, toReplace, replaceWith) {
  let htmlString = `<div class='input-row'>`;

  htmlString += `<input type="checkbox" idx="${i}" title="Toggle Replacement">`;
  htmlString += `<input replType="toReplace" idx="${i}" value="${toReplace}" placeholder="Find"> <input replType="replaceWith" idx="${i}" value="${replaceWith}" placeholder="Replace">`;
  htmlString +=
    '<img class="remove-btn" tabindex="0" title="Remove Entry" src="./img/delete.svg">';
  htmlString += "</div>";

  return htmlString;
}

// Adds input row using createInputRow().
function addInputRow() {
  saveReplacementPhrases();
  updateInputs();

  let i = replacementPhrases.length;

  dictUI.innerHTML += createInputRow(i, "", "");

  replacementPhrases.push({ toReplace: "", replaceWith: "", enabled: true });

  updateCheckboxes();

  setupAutosaveListeners();
  setupDeleteButtonsAndCheckboxes();
}
