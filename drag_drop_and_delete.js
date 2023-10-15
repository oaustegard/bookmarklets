javascript: (function() {
	let outlinedElement = null;
	let offsetX, offsetY;
	const outlineOnHover = (e) => {
		if (outlinedElement) outlinedElement.style.outline = "";
		outlinedElement = e.target;
		outlinedElement.style.outline = "2px solid blue";
	};
	const mouseDown = (e) => {
		if (e.target === outlinedElement) {
			offsetX = e.clientX - outlinedElement.getBoundingClientRect().left;
			offsetY = e.clientY - outlinedElement.getBoundingClientRect().top;
			document.addEventListener('mousemove', mouseMove);
		}
	};
	const mouseMove = (e) => {
		if (outlinedElement) {
			outlinedElement.style.position = 'fixed';
			outlinedElement.style.left = (e.clientX - offsetX) + 'px';
			outlinedElement.style.top = (e.clientY - offsetY) + 'px';
		}
	};
	const mouseUp = (e) => {
		document.removeEventListener('mousemove', mouseMove);
	};
	const keyHandler = (e) => {
		if (e.key === "Delete" || e.key === "Backspace") {
			outlinedElement.remove();
			outlinedElement = null;
		} else if (e.key === "Escape") {
			cleanup();
		}
	};
	const cleanup = () => {
		if (outlinedElement) outlinedElement.style.outline = "";
		document.removeEventListener('mouseover', outlineOnHover);
		document.removeEventListener('mousedown', mouseDown);
		document.removeEventListener('mouseup', mouseUp);
		document.removeEventListener('keydown', keyHandler);
	};
	document.addEventListener('mouseover', outlineOnHover);
	document.addEventListener('mousedown', mouseDown);
	document.addEventListener('mouseup', mouseUp);
	document.addEventListener('keydown', keyHandler);
})();