javascript:
/* @title: Caption Transcript */
/* @description: Scrub the page's main video to load its full caption track, then download a timestamped transcript (.txt) */
(function () {
  'use strict';

  const LOG = 'Caption Transcript:';
  const RUN_FLAG = '__captionTranscriptRunning';

  /* A second click while a run is active is ignored. */
  if (window[RUN_FLAG]) {
    console.log(LOG, 'already running, ignoring second click');
    return;
  }
  window[RUN_FLAG] = true;

  /* ---------- Tunables ---------- */
  const STEP = 600;            /* pass 1 seek interval, seconds */
  const SETTLE = 1200;         /* ms with no new cues before a step counts as settled */
  const FIRST_LOAD_WAIT = 3000; /* ms of quiet tolerated before the first new cue of a step */
  const STEP_TIMEOUT = 6000;   /* ms hard cap per step */
  const GAP = 20;              /* seconds between cues that counts as a gap */
  const GAP_STEP = 100;        /* seek interval inside a gap, seconds */
  const GAP_ROUNDS = 3;        /* max gap-filling rounds */
  const MARKER_EVERY = 60;     /* seconds between [hh:mm:ss] markers */
  const VIDEO_WAIT = 3000;     /* ms to wait for a video with metadata */

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function CancelledError() { this.name = 'CancelledError'; }

  /* ---------- Overlay ---------- */

  const overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed', 'top:12px', 'right:12px', 'z-index:2147483647',
    'background:#1e1e1e', 'color:#eee', 'font:13px/1.4 system-ui,sans-serif',
    'padding:10px 12px', 'border-radius:8px', 'box-shadow:0 4px 16px rgba(0,0,0,.4)',
    'min-width:240px', 'max-width:340px'
  ].join(';');
  const overlayTitle = document.createElement('div');
  overlayTitle.textContent = 'Caption Transcript';
  overlayTitle.style.cssText = 'font-weight:600;margin-bottom:4px';
  const overlayStatus = document.createElement('div');
  overlayStatus.style.cssText = 'white-space:pre-line;font-variant-numeric:tabular-nums';
  const overlayButton = document.createElement('button');
  overlayButton.textContent = 'Cancel';
  overlayButton.style.cssText = 'margin-top:8px;padding:3px 10px;cursor:pointer;font:inherit;border-radius:4px;border:1px solid #888;background:#333;color:#eee';
  overlay.append(overlayTitle, overlayStatus, overlayButton);
  document.body.appendChild(overlay);

  let cancelled = false;
  let finished = false;
  overlayButton.addEventListener('click', () => {
    if (finished) { overlay.remove(); return; }
    cancelled = true;
    overlayStatus.textContent = 'Cancelling…';
  });

  function setStatus(text) { overlayStatus.textContent = text; }

  function checkCancel() { if (cancelled) throw new CancelledError(); }

  /* Switch the overlay to a final message and remove it after a delay. */
  function finish(text, delayMs) {
    finished = true;
    setStatus(text);
    overlayButton.textContent = 'Close';
    setTimeout(() => overlay.remove(), delayMs);
  }

  /* ---------- Formatting helpers ---------- */

  function hms(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const pad = (n) => String(n).padStart(2, '0');
    return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
  }

  /* VTT cue text can carry voice/class tags and HTML entities. */
  function cleanCueText(raw) {
    return String(raw || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function slugify(text) {
    const slug = String(text || '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
    return slug || 'video';
  }

  /* ---------- Find the video ---------- */

  /* Walk a document or shadow root, descending into open shadow roots and
     same-origin iframes. Cross-origin iframes throw on access and are skipped. */
  function collectVideos(root, found) {
    let elements;
    try { elements = root.querySelectorAll('*'); } catch (e) { return found; }
    for (const el of elements) {
      if (el.tagName === 'VIDEO') found.push(el);
      if (el.shadowRoot) collectVideos(el.shadowRoot, found);
      if (el.tagName === 'IFRAME' || el.tagName === 'FRAME') {
        try {
          const doc = el.contentDocument;
          if (doc) collectVideos(doc, found);
        } catch (e) { /* cross-origin: skip silently */ }
      }
    }
    return found;
  }

  function longestVideo() {
    let best = null;
    for (const video of collectVideos(document, [])) {
      const d = video.duration;
      if (isFinite(d) && d > 0 && (!best || d > best.duration)) best = video;
    }
    return best;
  }

  async function findVideo() {
    const deadline = Date.now() + VIDEO_WAIT;
    for (;;) {
      const video = longestVideo();
      if (video || Date.now() >= deadline) return video;
      checkCancel();
      await sleep(250);
    }
  }

  /* ---------- Pick the track ---------- */

  function pickTrack(video) {
    const tracks = Array.from(video.textTracks || [])
      .filter((t) => t.kind === 'subtitles' || t.kind === 'captions');
    if (!tracks.length) return null;
    const english = tracks.find((t) => /^en/i.test(t.language || '') ||
      /english|\bcc\b/i.test(t.label || ''));
    return english || tracks[0];
  }

  /* ---------- Main ---------- */

  let video = null;
  let saved = null;

  function saveState() {
    saved = {
      currentTime: video.currentTime,
      paused: video.paused,
      muted: video.muted,
      playbackRate: video.playbackRate,
      modes: Array.from(video.textTracks || []).map((t) => [t, t.mode])
    };
  }

  function restoreState() {
    if (!video || !saved) return;
    try {
      video.pause();
      saved.modes.forEach(([track, mode]) => { if (track.mode !== mode) track.mode = mode; });
      video.currentTime = saved.currentTime;
      video.playbackRate = saved.playbackRate;
      video.muted = saved.muted;
      if (!saved.paused) {
        const p = video.play();
        if (p && p.catch) p.catch((e) => console.warn(LOG, 'could not resume playback', e));
      }
    } catch (e) {
      console.warn(LOG, 'restore failed', e);
    }
  }

  async function run() {
    setStatus('Looking for a video…');
    video = await findVideo();
    if (!video) {
      finish('No video found.', 3000);
      return;
    }
    const duration = video.duration;
    console.log(LOG, 'video found, duration', duration, video);

    const track = pickTrack(video);
    if (!track) {
      finish('This video has no subtitle or caption track.', 4000);
      return;
    }
    console.log(LOG, 'using track', track.label, track.language, track.kind);

    saveState();
    video.muted = true;
    video.pause();

    /* Cues are copied out after every step (per-step harvest), so players
       that drop cues on seek or toggle mode between loads lose nothing. */
    const cues = new Map();
    let wantedMode = 'hidden';
    let passLabel = 'Pass 1';
    let position = 0;

    function harvest() {
      let list = null;
      try { list = track.cues; } catch (e) { list = null; }
      if (!list) return;
      for (let i = 0; i < list.length; i++) {
        const cue = list[i];
        const text = cleanCueText(cue.text);
        if (!text) continue;
        const key = cue.startTime.toFixed(3) + '|' + text;
        if (!cues.has(key)) cues.set(key, { start: cue.startTime, end: cue.endTime, text: text });
      }
    }

    function report() {
      setStatus(passLabel + '\n' + hms(position) + ' / ' + hms(duration) + '\n' + cues.size + ' cues');
    }

    /* Seek to t and wait until the cue count stops growing. Before the first
       new cue arrives we tolerate a longer quiet period, since a chunk fetch
       usually takes longer than SETTLE to start. */
    async function seekAndSettle(t) {
      checkCancel();
      position = Math.min(Math.max(0, t), Math.max(0, duration - 0.5));
      if (track.mode !== wantedMode) track.mode = wantedMode;
      video.currentTime = position;
      report();
      const startCount = cues.size;
      const started = Date.now();
      let lastCount = cues.size;
      let lastGrowth = started;
      for (;;) {
        await sleep(200);
        checkCancel();
        if (track.mode !== wantedMode) track.mode = wantedMode;
        harvest();
        const now = Date.now();
        if (cues.size !== lastCount) { lastCount = cues.size; lastGrowth = now; }
        report();
        const quietNeeded = cues.size > startCount ? SETTLE : FIRST_LOAD_WAIT;
        if (now - lastGrowth >= quietNeeded || now - started >= STEP_TIMEOUT) return;
      }
    }

    /* Gaps between sorted cues, including the stretch before the first cue and
       after the last one. */
    function findGaps() {
      const sorted = Array.from(cues.values()).sort((a, b) => a.start - b.start);
      const gaps = [];
      let edge = 0;
      for (const cue of sorted) {
        if (cue.start - edge > GAP) gaps.push([edge, cue.start]);
        edge = Math.max(edge, cue.end);
      }
      if (duration - edge > GAP) gaps.push([edge, duration]);
      return gaps;
    }

    /* Pass 1: coarse sweep. If 'hidden' leaves the track empty after the
       first step, retry the sweep in 'showing'. */
    track.mode = wantedMode;
    for (let t = 0; t < duration; t += STEP) {
      await seekAndSettle(t);
      if (t === 0 && cues.size === 0 && wantedMode === 'hidden') {
        console.log(LOG, "no cues in 'hidden' mode, retrying in 'showing'");
        wantedMode = 'showing';
        await seekAndSettle(0);
      }
    }
    console.log(LOG, 'pass 1 done,', cues.size, 'cues');

    /* Pass 2: seek into every gap until a round fills nothing. Positions
       already visited are not re-sought, so silent stretches end the loop. */
    const visited = new Set();
    for (let round = 1; round <= GAP_ROUNDS; round++) {
      const gaps = findGaps();
      if (!gaps.length) break;
      const before = cues.size;
      let seeks = 0;
      passLabel = 'Pass 2, round ' + round + ' (' + gaps.length + ' gaps)';
      for (const [from, to] of gaps) {
        for (let t = from + 1; t < to; t += GAP_STEP) {
          const key = Math.round(t);
          if (visited.has(key)) continue;
          visited.add(key);
          seeks++;
          await seekAndSettle(t);
        }
      }
      console.log(LOG, 'gap round', round, ':', seeks, 'seeks,', cues.size - before, 'new cues');
      if (cues.size === before) break;
    }

    harvest();
    if (!cues.size) {
      restoreState();
      finish('The caption track stayed empty. The player may only load captions during playback.', 6000);
      return;
    }

    const text = buildTranscript(Array.from(cues.values()), track, duration, findGaps());
    restoreState();
    deliver(text, cues.size);
  }

  /* ---------- Output ---------- */

  function buildTranscript(cueList, track, duration, gaps) {
    cueList.sort((a, b) => a.start - b.start || a.end - b.end);

    const lines = [];
    let lineStart = -Infinity;
    let parts = [];
    let last = null;
    for (const cue of cueList) {
      /* Rolling captions repeat the same line in back-to-back cues. */
      if (last && cue.text === last.text && cue.start <= last.end + 1) {
        last.end = Math.max(last.end, cue.end);
        continue;
      }
      last = { text: cue.text, end: cue.end };
      if (cue.start >= lineStart + MARKER_EVERY) {
        if (parts.length) lines.push(parts.join(' '));
        lineStart = cue.start;
        parts = ['[' + hms(cue.start) + ']'];
      }
      parts.push(cue.text);
    }
    if (parts.length) lines.push(parts.join(' '));

    const gapText = gaps.length
      ? gaps.map(([a, b]) => hms(a) + '–' + hms(b)).join(', ')
      : 'none';
    const trackName = (track.label || '(unlabelled)') + (track.language ? ' (' + track.language + ')' : '');

    const header = [
      'Title: ' + (document.title || '(untitled)'),
      'URL: ' + location.origin + location.pathname,
      'Duration: ' + hms(duration),
      'Cues: ' + cueList.length,
      'Track: ' + trackName,
      'Captured: ' + new Date().toISOString().slice(0, 10),
      'Uncaptioned gaps over ' + GAP + ' s: ' + gapText,
      'Note: automatic captions contain speech-recognition errors.'
    ];
    return header.join('\n') + '\n\n' + lines.join('\n\n') + '\n';
  }

  function deliver(text, count) {
    const filename = slugify(document.title) + '-transcript.txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    console.log(LOG, 'downloaded', filename);

    const done = (copied) => finish(count + ' cues saved to ' + filename +
      (copied ? '\nAlso copied to the clipboard.' : ''), 6000);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => done(true), (e) => {
        console.log(LOG, 'clipboard not permitted', e);
        done(false);
      });
    } else {
      done(false);
    }
  }

  run().catch((error) => {
    restoreState();
    if (error instanceof CancelledError) {
      console.log(LOG, 'cancelled');
      finish('Cancelled. Playback restored.', 2000);
    } else {
      console.error(LOG, error);
      finish('Failed: ' + (error && error.message ? error.message : error), 6000);
    }
  }).finally(() => {
    window[RUN_FLAG] = false;
  });
})();
