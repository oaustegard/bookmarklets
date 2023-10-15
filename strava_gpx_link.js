javascript: (function() {
	for (let e of document.querySelectorAll('[data-field-name=name]')) {
		let h = e.href;
		let a = document.createElement("a");
		let l = document.createTextNode("GPX");
		a.appendChild(l);
		a.title = "GPX Data";
		a.href = h + "/export_gpx";
		a.style = "float:right;";
		e.parentNode.appendChild(a);
	}
})()