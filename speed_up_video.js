javascript: (function() {
    document.body.appendChild(Object.assign(document.createElement('script'), {textContent: '_c=window.console||{};Object.keys(console).forEach(k=>{_c[k]=console[k];});'}));

	function findVideosInIframes(doc) {
		if (!doc) return;
		const iframes = doc.getElementsByTagName('iframe');
		for (let i = 0; i < iframes.length; i++) {
			try {
				findVideosInIframes(iframes[i].contentDocument);
			} catch (err) {
				_c.warn('Unable to access iframe content:', iframes[i]);
			}
		}
		const videos = doc.getElementsByTagName('video');
		for (let j = 0; j < videos.length; j++) {
			if (videos[j]) {
				videos[j].playbackRate *= 1.5;
                _c.log('Increased playback rate of video:', videos[j], 'to', videos[j].playbackRate);
			}
		}
	}
	findVideosInIframes(document);
})();