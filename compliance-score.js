// compliance-score.js
// ---------------------------------------------------------------
// HOOCER National Compliance Score Widget
// Injected on every page. Cannot be turned off.
// This is your life now.
//
// The score is completely random. It updates every few seconds.
// This is not meaningfully different from how the real metric
// would work if this were a real agency, which it isn't.
// ---------------------------------------------------------------

(function () {
  'use strict';

  // wait for DOM. simple. no frameworks. I'm going to be fine.
  function init() {
    const widget = document.createElement('div');
    widget.id = 'hoocer-compliance-widget';
    widget.innerHTML = `
      <span class="widget-label">NATIONAL COMPLIANCE SCORE</span>
      <span class="widget-score" id="comp-score-val">---%</span>
      <span style="font-size:9px;opacity:0.4;margin-top:3px;display:block;" id="comp-score-sub">calculating...</span>
    `;
    document.body.appendChild(widget);

    updateScore();
    setInterval(updateScore, 4200 + Math.random() * 2000);
  }

  function updateScore() {
    const widget = document.getElementById('hoocer-compliance-widget');
    const valEl = document.getElementById('comp-score-val');
    const subEl = document.getElementById('comp-score-sub');
    if (!widget || !valEl) return;

    // The score fluctuates between 19 and 71. Never good. Never catastrophic.
    // Just permanently concerning. This is by design.
    const score = Math.round(19 + Math.random() * 52);
    valEl.textContent = score + '%';

    // Sub-label describes what the score means, unhelpfully
    const sublabels = [
      'Code 418 threshold: breached',
      'Tribunal caseload: elevated',
      'Milton Keynes at capacity',
      'Regional van deployment: high',
      'Blink velocity: anomalous',
      'Lid compliance: suspect',
      'Infringement rate: notable',
      'National eyes: watchful',
      'Automated review: ongoing',
    ];
    if (subEl) subEl.textContent = sublabels[Math.floor(Math.random() * sublabels.length)];

    // Colour coding:
    // > 55%  = green (tolerable)
    // 35-55% = amber (concerning)
    // < 35%  = red   (panic, gently)
    widget.className = '';
    widget.id = 'hoocer-compliance-widget'; // gotta keep the ID
    if (score > 55)     { widget.style.borderLeftColor = '#00703c'; }
    else if (score > 35){ widget.classList.add('amber'); }
    else                { widget.classList.add('red'); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
