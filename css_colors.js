javascript:(function() {
	/* @title: Extract CSS Colors */
	/* @description: Extracts and displays all CSS color values used on the current page */
	const rgbToHsl = (r, g, b) => {
	  r /= 255, g /= 255, b /= 255;
	  const max = Math.max(r, g, b), min = Math.min(r, g, b);
	  let h, s, l = (max + min) / 2;
	  if (max === min) {
		h = s = 0;
	  } else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
		  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
		  case g: h = (b - r) / d + 2; break;
		  case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	  }
	  return [h, s, l];
	};
	
	const extractColorRules = () => {
	  const colorDict = {};
	  Array.from(document.styleSheets).forEach(sheet => {
		try {
		  Array.from(sheet.rules || sheet.cssRules).forEach(rule => {
			if (rule.style) {
			  ['color', 'background-color'].forEach(property => {
				const value = rule.style.getPropertyValue(property);
				if (value) {
				  if (!colorDict[value]) colorDict[value] = [];
				  colorDict[value].push(`${rule.selectorText} { ${property}: ${value}; }`);
				}
			  });
			}
		  });
		} catch (e) {}
	  });
	  const colors = Object.keys(colorDict).sort((a, b) => {
		const aRGB = window.getComputedStyle(document.body).color.match(/\d+/g);
		const bRGB = window.getComputedStyle(document.body).backgroundColor.match(/\d+/g);
		const aHSL = rgbToHsl(+aRGB[0], +aRGB[1], +aRGB[2]);
		const bHSL = rgbToHsl(+bRGB[0], +bRGB[1], +bRGB[2]);
		return aHSL[0] - bHSL[0] || aHSL[1] - bHSL[1] || aHSL[2] - bHSL[2];
	  });
	  let htmlContent = '<html><head><title>Color Swatches</title></head><body>';
	  colors.forEach(color => {
		htmlContent += `<div style="display: flex; align-items: center; margin: 10px;"><div style="width: 50px; height: 50px; background-color: ${color};"></div><div style="margin-left: 10px;">`;
		htmlContent += colorDict[color].join('<br>');
		htmlContent += '</div></div>';
	  });
	  htmlContent += '</body></html>';
	  const win = window.open('', '_blank');
	  win.document.write(htmlContent);
	  win.document.close();
	};
  
	extractColorRules();
  })();
  