//Strings to enter into document.querySelector to get desired elements
class KeyElements {
	constructor(replaceMenuCloseButton, findInput, replaceInput, replaceAllButton) {
		this.replaceMenuCloseButton = replaceMenuCloseButton;
		this.findInput = findInput;
		this.replaceInput = replaceInput;
		this.replaceAllButton = replaceAllButton;
	}
}

//Pulled from StackOverflow: https://stackoverflow.com/questions/51848258/google-docs-programmatically-send-mouse-click-to-an-item-in-outline-pane
//Thanks to Iván Nokonoko!
function clickElement(el) {
	var box = el.getBoundingClientRect(),
		coordX = box.left + (box.right - box.left) / 2,
		coordY = box.top + (box.bottom - box.top) / 2;

	simulateMouseEvent(el, 'mousedown', coordX, coordY);
	simulateMouseEvent(el, 'mouseup', coordX, coordY);
	simulateMouseEvent(el, 'click', coordX, coordY);
}

var simulateMouseEvent = function (element, eventName, coordX, coordY) {
	element.dispatchEvent(
		new MouseEvent(eventName, {
			view: window,
			bubbles: true,
			cancelable: true,
			clientX: coordX,
			clientY: coordY,
			button: 0
		})
	);
};

//Adds support for Macs (metaKey). Did not feel like it was worth OS checking
function openReplaceAllMenu() {
	console.log('opening find & replace menu...');

	//Non-Mac operating systems
	const openReplaceAllMenu = new KeyboardEvent('keydown', { key: 'h', ctrlKey: true, bubbles: true });
	document.body.dispatchEvent(openReplaceAllMenu);

	//MacOS
	const openReplaceAllMenuMac = new KeyboardEvent('keydown', { key: 'h', metaKey: true, bubbles: true });
	document.body.dispatchEvent(openReplaceAllMenuMac);
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
