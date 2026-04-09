// script.js
// ---------------------------------------------------------------
// HOOCER — Citizen Blink Monitoring System
// Enforcement Module v3.7.2 (build 47, "The Blinkinator")
// ---------------------------------------------------------------
//
// ok so here's the deal. this script "detects" blinks using:
//   - mouse inactivity          (you stopped moving → eyes closed → blink)
//   - mouse movement            (you looked somewhere new → preceded by blink)
//   - tab switching             (you looked away, you DEFINITELY blinked)
//   - the passage of time       (time = blinking. this is science.)
//   - clicking anything         (focused attention → micro-blink)
//   - clicking "I DID NOT BLINK" (this one is my favourite)
//
// is any of this real? absolutely not.
// does it feel uncomfortably plausible? that's the whole point.
//
// I am not sorry.
// ---------------------------------------------------------------

'use strict';

// ---------------------------------------------------------------
// GLOBAL STATE
// the entire app lives in here. React who?
// ---------------------------------------------------------------
const state = {
  blinkCount: 0,
  sessionStart: Date.now(),
  lastActivity: Date.now(),
  caseRef: '',
  fineAmount: 0,
  suspicionScore: 0,
  monitorInterval: null,
  feedInterval: null,
  factInterval: null,
  isFinedAlready: false, // prevents double-fining. we're not monsters.
};

const BLINK_LIMIT = 25; // the law is 25. section 3(1) of the Act.

// ---------------------------------------------------------------
// DATA
// all of this is made up. DO NOT cite in court.
// ---------------------------------------------------------------

const FEED_NAMES = [
  'Margaret H.', 'Dave T.', 'Susan K.', 'Gary B.', 'Patricia M.',
  'Keith R.', 'Brenda F.', 'Trevor N.', 'Carol W.', 'Des O.',
  'Janice L.', 'Ron H.', 'Beverly C.', 'Nigel P.', 'Doris Q.',
  'Clive A.', 'Mildred S.', 'Geoffrey T.', 'Hilda J.', 'Barry Z.',
  '[REDACTED]', 'User_4471', 'Anon (suspicious)', 'A. Person',
  'Dr E. Yelid', 'O. Cular', 'I. Blink', 'C. Clearly', 'R. Etina',
];

// these are the "Did You Know" facts. they are all fiction.
// please do not quote them in academic work.
// (this has happened to me before with a different project. please don't.)
const FACTS = [
  'The average person blinks 15–20 times per minute, adding up to 28,800 blinks per day. HOOCER considers this "aggressive."',
  'In 1987, a man in Dorset blinked 47 times in a single minute. He has not been seen since.',
  'Under Schedule 7 of the Act, "decorative blinking" carries a maximum fine of £840. Flirting is £1,200.',
  'HOOCER employs 4,700 staff across three regional offices. 4,699 of them are in Milton Keynes. One is somewhere else and we can\'t find them.',
  'The longest recorded streak without blinking is 40 minutes and 59 seconds, held by a man who claims he "just forgot."',
  'In 2025, HOOCER issued 2.4 million Notices of Ocular Infringement. Approximately none were paid.',
  '"Blink" derives from the Old English "blyncan," meaning "to blink." Etymology team taking the day off.',
  'Section 5(4) of the Act states that clicking "I Did Not Blink" shall be treated as a blink. This was added by a very tired civil servant on a Friday afternoon.',
  'The Blink Frequency (Emergency Powers) Order 2022 was introduced after an incident described in Hansard only as "the Dorset situation." No further details are available.',
  'Your eyelids have closed approximately 12 times since you started reading this sentence. We noted them all.',
];

// Severity descriptors for the fine multiplier.
// the tribunal takes these very seriously.
const SEVERITY_DESCRIPTORS = [
  'Negligent', 'Reckless', 'Chronic', 'Persistent', 'Wilful',
  'Aggravated', 'Flagrant', 'Systematic', 'Habitual', 'Compulsive',
  'Spectacular', 'Brazen', 'Frankly Audacious',
];

// Appeal denial reasons. the tribunal considered these carefully for several microseconds.
const DENIAL_REASONS = [
  'Your stated reason was reviewed and found to be insufficient given that HOOCER\'s atmospheric modelling found no registered dust events in your vicinity at the time of infringement. The weather logs are very clear on this.',
  'The Independent Tribunal noted your commitment score of {score}/10 was described as "aspirational." Aspirational is not a legal defence. We checked.',
  'Your appeal was rejected on the grounds that you submitted it, which demonstrates awareness of the infringement and therefore implies consciousness of guilt. This is the doctrine of "Ocular Mens Rea," established by R v. Blinksworth (2021).',
  'HOOCER\'s Medical Advisory Panel reviewed your claim of "existing in a human body against your will" and, while philosophically engaged by the point, confirmed it is not recognised as a medical defence under current legislation.',
  'The Tribunal found your account of each individual blink well-formatted but ultimately irrelevant. The Automated Division does not read submissions. It does, however, weigh them. Yours was light.',
  'Upon review, the Tribunal noted you clicked "I Did Not Blink" at some point during your session. Section 5(4) of the Act is unambiguous: that button always records a blink. Clicking it to dispute a blink is legally self-defeating.',
  'Your philosophical argument disputing the existence of blinks as discrete events was forwarded to the HOOCER Philosophy Team (one part-time consultant). He replied: "No."',
  'The stated mitigating circumstance of "near an onion" was assessed against Schedule 12 (Allium Proximity Defence). The Schedule requires the onion to be within 30cm and actively cut. Proximity alone is insufficient. Your onion, wherever it was, cannot save you.',
];

const DENIAL_ADJECTIVES = [
  'unconvincing', 'bewildering', 'optimistic but incorrect',
  'creative but no', 'well-formatted but still rejected',
  'legally frivolous', 'administratively entertaining',
  'among the weaker appeals we have received today',
];

// ---------------------------------------------------------------
// UTILITY FUNCTIONS
// (I wrote utility functions for a blinking website.
//  this is my life now. I have accepted it.)
// ---------------------------------------------------------------

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatCurrency(amount) {
  return '£' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function todayFormatted() {
  return new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function hearingDateFormatted() {
  const d = new Date();
  d.setMonth(d.getMonth() + 8 + Math.floor(Math.random() * 7));
  return d.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function generateCaseRef() {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 90000) + 10000;
  const regions = ['LON', 'MKY', 'BHM', 'MAN', 'EBG', 'GLS', 'BRS'];
  return `HOOCER/${year}/BLK/${randomFrom(regions)}/${seq}`;
}

// ---------------------------------------------------------------
// SCREEN MANAGEMENT
// ---------------------------------------------------------------

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    target.style.display = 'flex';
    window.scrollTo(0, 0);
  }
}

// ---------------------------------------------------------------
// PORTAL ENTRY
// ---------------------------------------------------------------

function enterPortal() {
  state.caseRef = generateCaseRef();
  document.getElementById('caseRef').textContent = state.caseRef;
  showScreen('monitor');
  startMonitoring();
  startFeed();
  startFacts();
}

// ---------------------------------------------------------------
// BLINK DETECTION ENGINE
// (I cannot stress enough how not-real this is.)
// ---------------------------------------------------------------

function recordBlink(source) {
  if (state.isFinedAlready) return;

  state.blinkCount++;
  state.suspicionScore = Math.min(100, state.suspicionScore + (Math.random() * 4));

  const countEl = document.getElementById('blinkCount');
  if (!countEl) return;

  countEl.textContent = state.blinkCount;

  // colour the number based on how many crimes you've committed
  countEl.className = 'blink-number';
  if (state.blinkCount >= BLINK_LIMIT) {
    countEl.classList.add('danger');
  } else if (state.blinkCount >= Math.floor(BLINK_LIMIT * 0.65)) {
    countEl.classList.add('warning');
  }

  updateProgressBar();
  updateMetrics();

  // update status text as they approach the limit
  updateStatusText();

  if (state.blinkCount >= BLINK_LIMIT && !state.isFinedAlready) {
    state.isFinedAlready = true;
    stopMonitoring();
    // dramatic pause before the bad news. purely for psychological effect.
    setTimeout(() => issueFine(), 800);
  }
}

function recordManualBlink() {
  // player clicks "I DID NOT BLINK"
  // we record a blink
  // this is my proudest achievement as a developer
  recordBlink('manual_denial');
}

function updateStatusText() {
  const pct = state.blinkCount / BLINK_LIMIT;
  const statusDot  = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  if (!statusText) return;

  if (pct < 0.5) {
    statusText.textContent = 'MONITORING ACTIVE';
    if (statusDot) { statusDot.className = 'status-dot green'; }
  } else if (pct < 0.8) {
    statusText.textContent = 'ELEVATED BLINK ACTIVITY DETECTED';
    if (statusDot) { statusDot.className = 'status-dot red'; }
  } else {
    statusText.textContent = 'IMMINENT INFRINGEMENT — TRIBUNAL NOTIFIED';
    if (statusDot) { statusDot.className = 'status-dot red'; }
  }
}

function updateProgressBar() {
  const pct = Math.min(100, (state.blinkCount / BLINK_LIMIT) * 100);
  const bar = document.getElementById('progressBar');
  const remaining = document.getElementById('blinksUntilFine');
  if (!bar) return;

  bar.style.width = pct + '%';
  bar.className = 'progress-bar-inner';
  if (pct >= 100)      bar.classList.add('danger');
  else if (pct >= 65)  bar.classList.add('warning');

  if (remaining) remaining.textContent = Math.max(0, BLINK_LIMIT - state.blinkCount);
}

function updateMetrics() {
  const elapsed = Math.max(0.001, (Date.now() - state.sessionStart) / 60000);
  const rate = (state.blinkCount / elapsed);
  const pct  = state.blinkCount / BLINK_LIMIT;

  const blinkRateEl = document.getElementById('blinkRate');
  if (blinkRateEl) {
    blinkRateEl.textContent = elapsed < 0.1
      ? 'calibrating...'
      : rate.toFixed(1) + ' /min';
  }

  const complianceEl = document.getElementById('compliance');
  if (complianceEl) {
    if (pct < 0.3) {
      complianceEl.textContent = 'REVIEWING';
      complianceEl.className = 'metric-val green-text';
    } else if (pct < 0.6) {
      complianceEl.textContent = 'AMBER WATCH';
      complianceEl.className = 'metric-val orange-text';
    } else if (pct < 0.9) {
      complianceEl.textContent = 'SUSPECTED BLINKER';
      complianceEl.className = 'metric-val orange-text';
    } else {
      complianceEl.textContent = 'OCULAR CRIMINAL';
      complianceEl.className = 'metric-val red-text';
    }
  }

  // fake biometric readings. very scientific. don't google these units.
  const moistureEl = document.getElementById('moistureIdx');
  if (moistureEl) {
    moistureEl.textContent = (Math.random() * 30 + 55).toFixed(1) + '% (est.)';
  }

  const velocityEl = document.getElementById('lidVelocity');
  if (velocityEl) {
    velocityEl.textContent = (Math.random() * 150 + 120).toFixed(0) + ' μm/s';
  }

  const suspicionEl = document.getElementById('suspicionScore');
  if (suspicionEl) {
    suspicionEl.textContent = Math.round(state.suspicionScore) + '/100';
    if (state.suspicionScore > 60) suspicionEl.className = 'metric-val red-text';
    else if (state.suspicionScore > 30) suspicionEl.className = 'metric-val orange-text';
    else suspicionEl.className = 'metric-val green-text';
  }
}

// ---------------------------------------------------------------
// MONITORING — the intervals that make the number go up
// ---------------------------------------------------------------

function startMonitoring() {

  // core detection loop: checks inactivity every 1.3 seconds
  state.monitorInterval = setInterval(() => {
    if (state.isFinedAlready) return;

    const idle = Date.now() - state.lastActivity;

    // been still for a bit? you blinked.
    if (idle > 2000 && Math.random() < 0.55) {
      recordBlink('inactivity');
      return;
    }

    // general background blink probability — 9% per tick
    // your eyes are just like that
    if (Math.random() < 0.09) {
      recordBlink('passive');
    }
  }, 1300);

  // switching tabs = DEFINITELY blinking. multiple times.
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // mouse movement updates the activity timer
  // and occasionally catches a micro-blink
  document.addEventListener('mousemove', handleMouseMove, { passive: true });

  // clicks: 35% chance of a pre-click blink
  // (not counted for the deny button — that has its own irony)
  document.addEventListener('click', handleClick);

  // touchscreen support — because HOOCER doesn't discriminate
  document.addEventListener('touchstart', handleTouch, { passive: true });

  // run initial metrics
  updateMetrics();
}

function stopMonitoring() {
  if (state.monitorInterval) clearInterval(state.monitorInterval);
  if (state.feedInterval)    clearInterval(state.feedInterval);
  if (state.factInterval)    clearInterval(state.factInterval);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('click', handleClick);
  document.removeEventListener('touchstart', handleTouch);
}

function handleVisibilityChange() {
  if (document.hidden && !state.isFinedAlready) {
    // you looked away. classic blinker move.
    recordBlink('tab_switch_1');
    recordBlink('tab_switch_2');
  }
}

function handleMouseMove() {
  state.lastActivity = Date.now();
  // eye tracks the mouse: micro-blink risk 3%
  if (!state.isFinedAlready && Math.random() < 0.03) {
    recordBlink('eye_track');
  }
}

function handleClick(e) {
  if (state.isFinedAlready) return;
  // don't double-count the deny button — it has its own explicit call
  if (e.target && e.target.classList.contains('btn-deny')) return;
  if (Math.random() < 0.35) {
    recordBlink('pre_click');
  }
}

function handleTouch() {
  state.lastActivity = Date.now();
  if (!state.isFinedAlready && Math.random() < 0.25) {
    recordBlink('touch');
  }
}

// ---------------------------------------------------------------
// LIVE NATIONAL BLINK FEED
// (every single entry is fabricated. HOOCER is not real.
//  your blinks are not being uploaded anywhere.
//  I promise. please stop emailing me.)
// ---------------------------------------------------------------

function startFeed() {
  const feed = document.getElementById('blinkFeed');
  if (!feed) return;

  function addFeedItem() {
    const name      = randomFrom(FEED_NAMES);
    const count     = Math.floor(Math.random() * 55) + 3;
    const isInfring = count > 25;
    const time      = new Date().toLocaleTimeString('en-GB');
    const status    = isInfring
      ? '⚠ INFRINGEMENT — NOI ISSUED'
      : '✓ within threshold';

    const item = document.createElement('div');
    item.className = isInfring ? 'feed-item infringement' : 'feed-item';
    item.textContent = `[${time}] ${name}: ${count} blinks — ${status}`;
    feed.insertBefore(item, feed.firstChild);

    // don't let the feed grow forever. the only mature engineering decision here.
    while (feed.children.length > 22) {
      feed.removeChild(feed.lastChild);
    }
  }

  // seed with some entries so it doesn't look empty on load
  for (let i = 0; i < 7; i++) {
    setTimeout(addFeedItem, i * 180);
  }

  state.feedInterval = setInterval(addFeedItem, 2200 + Math.random() * 800);
}

// ---------------------------------------------------------------
// "DID YOU KNOW" FACTS
// ---------------------------------------------------------------

function startFacts() {
  const el = document.getElementById('didYouKnow');
  if (!el) return;

  let factIndex = Math.floor(Math.random() * FACTS.length);

  function rotateFact() {
    el.style.transition = 'opacity 0.4s';
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = FACTS[factIndex % FACTS.length];
      el.style.opacity = '1';
      factIndex++;
    }, 450);
  }

  rotateFact();
  state.factInterval = setInterval(rotateFact, 9000);
}

// ---------------------------------------------------------------
// FINE CALCULATION
// peak bureaucracy. this is what I was put on earth to do.
// ---------------------------------------------------------------

function calculateFine(blinkCount) {
  const excess = blinkCount - BLINK_LIMIT;
  const base = excess * 2.40;

  // The Blink Severity Multiplier.
  // Normally 1x–3.5x. Occasionally the system glitches.
  // Government IT, etc.
  let multiplier;
  const chaos = Math.random();
  if (chaos > 0.97) {
    // "Government IT incident" — wildly wrong fine
    multiplier = Math.random() * 300 + 80;
    console.warn('HOOCER SYSTEM NOTICE: BSM calculation error. Fine may be incorrect. This is not unusual.');
  } else if (chaos > 0.88) {
    multiplier = Math.random() * 5 + 3.5;
  } else {
    multiplier = Math.random() * 2.5 + 1.0;
  }

  // evening surcharge because why not
  const hour = new Date().getHours();
  const isEvening = hour >= 18 || hour < 6;
  const eveningSurcharge = isEvening ? base * 0.25 : 0;

  // cooperative citizen discount. always very small. this is the joke.
  const discount = Math.random() * 2.0 + 0.50;

  const total = (base * multiplier) + eveningSurcharge - discount;

  return {
    excess,
    multiplierRaw: multiplier,
    multiplierDisplay: multiplier.toFixed(2) + 'x (' + randomFrom(SEVERITY_DESCRIPTORS) + ')',
    eveningSurcharge,
    isEvening,
    discount,
    total: Math.max(14.00, total), // minimum fine is £14. always. no exceptions.
  };
}

// ---------------------------------------------------------------
// ISSUE FINE
// ---------------------------------------------------------------

function issueFine() {
  const fine = calculateFine(state.blinkCount);
  state.fineAmount = fine.total;

  const fineRef = state.caseRef.replace('/BLK/', '/NOI/');

  // populate the fine screen with beautiful fake data
  el('fineRef').textContent      = fineRef;
  el('fineRefBody').textContent  = fineRef;
  el('fineDate').textContent     = todayFormatted();
  el('citizenId').textContent    = 'Citizen #' + (Math.floor(Math.random() * 900000) + 100000);
  el('fineBlinkCount').textContent = state.blinkCount;
  el('excessBlinks').textContent   = fine.excess;
  el('severityMult').textContent   = fine.multiplierDisplay;
  el('eveningSurcharge').textContent = fine.isEvening
    ? formatCurrency(fine.eveningSurcharge) + ' (applied: after 18:00)'
    : 'N/A (£0.00)';
  el('citizenDiscount').textContent = '−' + formatCurrency(fine.discount);
  el('fineAmount').textContent      = formatCurrency(fine.total);

  // if the government glitched and the fine is enormous, acknowledge it
  if (fine.multiplierRaw > 50) {
    const note = document.createElement('p');
    note.style.cssText = 'background:#fff3f3;border-left:4px solid #d4351c;padding:10px 14px;font-size:13px;margin:12px 0;';
    note.innerHTML = '<strong>System Notice:</strong> Your Blink Severity Multiplier was calculated as ' +
      fine.multiplierRaw.toFixed(0) + 'x, which HOOCER acknowledges may appear high. ' +
      'This is a known system behaviour. An investigation has been opened. The fine stands.';
    const fineBody = document.querySelector('.fine-body');
    if (fineBody) fineBody.appendChild(note);
  }

  showScreen('fine');
}

// tiny helper so I don't type document.getElementById 400 times
function el(id) {
  return document.getElementById(id) || { textContent: '', innerHTML: '' };
}

// ---------------------------------------------------------------
// APPEAL FLOW
// ---------------------------------------------------------------

function goToAppeal() {
  showScreen('appeal');
  setupCommitmentSlider();
}

function setupCommitmentSlider() {
  const slider = document.getElementById('commitment');
  const label  = document.getElementById('commitmentLabel');
  if (!slider || !label) return;

  const labels = {
    1:  '1 — Actively planning to blink more, actually',
    2:  '2 — Indifferent to blinking',
    3:  '3 — Mildly concerned',
    4:  '4 — Somewhat committed (not legally binding)',
    5:  '5 — Moderately committed',
    6:  '6 — Taking this somewhat seriously',
    7:  '7 — Genuinely trying',
    8:  '8 — Very committed to blinking less',
    9:  '9 — Bordering on pathological (possibly a new infringement)',
    10: '10 — Will never blink again (please seek medical attention)',
  };

  slider.addEventListener('input', () => {
    label.textContent = labels[slider.value] || slider.value;
  });
}

function submitAppeal() {
  const declaration = document.getElementById('declarationCheck');
  if (!declaration || !declaration.checked) {
    // make the declaration shake
    const label = declaration ? declaration.parentElement : null;
    if (label) {
      label.style.color = '#d4351c';
      label.style.fontWeight = 'bold';
      setTimeout(() => {
        label.style.color = '';
        label.style.fontWeight = '';
      }, 3000);
    }
    alert('You must complete the statutory declaration in Section D.\n\nThis is a legal document. Sort of.');
    return;
  }

  const btn = document.getElementById('appealSubmitBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Submitted — processing...';
  }

  const processingEl = document.getElementById('appealProcessing');
  if (processingEl) processingEl.style.display = 'block';

  // fake 14-department processing pipeline
  // spoiler: none of these departments are real
  const steps = [
    'Routing to Ocular Infringement Team...',
    'Assigning to Regional Blink Inspector (Grade 7)...',
    'Checking National Blink Registry for prior offences...',
    'Forwarding to Legal Services (waiting for sign-off)...',
    'Submitting to Deputy Director, Eyelid Regulation Division...',
    'Routing to Independent Tribunal (Automated Division)...',
    'Processing... (department 7 of 14 is currently at lunch)...',
    'Running assessment algorithm...',
    'Cross-referencing with Allium Proximity Database...',
    'Calculating appeal score (this number doesn\'t mean anything)...',
    'Generating determination letter...',
    'Finalising outcome...',
  ];

  const stepEl = document.getElementById('processingStep');
  let i = 0;

  const stepInterval = setInterval(() => {
    if (i < steps.length) {
      if (stepEl) stepEl.textContent = steps[i];
      i++;
    } else {
      clearInterval(stepInterval);
      showDenied();
    }
  }, 750);
}

// ---------------------------------------------------------------
// APPEAL DENIED
// ---------------------------------------------------------------

function showDenied() {
  const commitmentScore = document.getElementById('commitment');
  const score = commitmentScore ? commitmentScore.value : 5;

  let reason = randomFrom(DENIAL_REASONS);
  reason = reason.replace('{score}', score);

  const increaseAmounts = [
    { label: '£35.00',  reason: 'appeal administration fee' },
    { label: '£12.50',  reason: 'tribunal document photocopying' },
    { label: '£240.00', reason: 'enhanced monitoring surcharge (post-appeal)' },
    { label: '£8.00',   reason: 'postage of this denial letter' },
    { label: '£95.00',  reason: 'Automated Division processing overhead' },
  ];

  const increase = randomFrom(increaseAmounts);
  const increaseAmount = parseFloat(increase.label.replace('£', ''));
  const updatedFine = state.fineAmount + increaseAmount;

  el('denialAdjective').textContent   = randomFrom(DENIAL_ADJECTIVES);
  el('denialReason').textContent      = reason;
  el('deniedFineAmount').textContent  = formatCurrency(state.fineAmount);
  el('fineIncrease').textContent      = increase.label;
  el('increaseReason').textContent    = increase.reason;
  el('updatedFine').textContent       = formatCurrency(updatedFine);
  el('hearingDate').textContent       = hearingDateFormatted();

  showScreen('denied');
}

// ---------------------------------------------------------------
// KONAMI CODE
// activates "Blink Amnesty"
// which does absolutely nothing
// the RFC on this was very clear
// ---------------------------------------------------------------

const KONAMI_SEQUENCE = [38,38,40,40,37,39,37,39,66,65]; // ↑↑↓↓←→←→BA
let konamiProgress = 0;

document.addEventListener('keydown', (e) => {
  if (e.keyCode === KONAMI_SEQUENCE[konamiProgress]) {
    konamiProgress++;
    if (konamiProgress === KONAMI_SEQUENCE.length) {
      konamiProgress = 0;
      triggerBlinkAmnesty();
    }
  } else {
    konamiProgress = 0;
  }
});

function triggerBlinkAmnesty() {
  // you found the easter egg
  // I'm proud of you
  // your fine is not reduced
  const overlay = document.createElement('div');
  overlay.className = 'konami-overlay';
  overlay.innerHTML = `
    <div class="konami-box">
      <h2>♛ BLINK AMNESTY ACTIVATED ♛</h2>
      <p>
        You have successfully invoked the <em>Ocular Clemency Protocol</em>
        by entering the correct input sequence.
      </p>
      <p>
        After careful review, the Secretary of State for Ocular Affairs has
        determined that the Konami Code is <strong>not a legally recognised
        instrument</strong> under UK law, Section 17 of the Legal Instruments
        (What Counts as One) Act 2008.
      </p>
      <p>
        Your fine has been: <strong>NOT REDUCED.</strong>
      </p>
      <p style="font-size:12px; margin-top: 16px; opacity: 0.6;">
        Entering this code has been added to your case file under
        "Attempted Procedural Circumvention." Sorry.
      </p>
      <button class="btn-primary" onclick="this.closest('.konami-overlay').remove()" style="margin-top:16px;">
        Understood (closes this, records a blink)
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ---------------------------------------------------------------
// INIT
// ---------------------------------------------------------------

window.addEventListener('load', () => {
  // make sure splash is showing. belt and braces.
  showScreen('splash');

  // console message for the curious
  // hello, curious person
  console.log(
    '%cHOOCER — HM Office for Ocular Compliance & Eyelid Regulation',
    'background:#00703c;color:white;font-size:15px;padding:8px 16px;font-weight:bold;'
  );
  console.log('%cYour blinks are being monitored.', 'color:#d4351c;font-weight:bold;font-size:13px;');
  console.log('%cCase reference will be generated on portal entry.', 'color:#505a5f;font-size:12px;');
  console.log('%c(This is a joke website. Please blink normally. We beg you.)', 'color:#aaa;font-size:11px;font-style:italic;');
  console.log('%cTip: try the Konami code. It will not help you.', 'color:#1d70b8;font-size:11px;');
});

// ---------------------------------------------------------------
// ADDITIONS — Code 418 references throughout
// ---------------------------------------------------------------

// update the code 418 status metric
function updateCode418Status() {
  const el = document.getElementById('code418status');
  if (!el) return;

  const blinkPct = state.blinkCount / BLINK_LIMIT;
  if (state.isFinedAlready) {
    el.textContent = 'ENFORCED';
    el.className = 'metric-val red-text';
  } else if (blinkPct > 0.8) {
    el.textContent = 'IMMINENT';
    el.className = 'metric-val red-text';
  } else if (blinkPct > 0.5) {
    el.textContent = 'ELEVATED';
    el.className = 'metric-val orange-text';
  } else {
    el.textContent = 'PENDING';
    el.className = 'metric-val orange-text';
  }
}

// patch the existing updateMetrics to also call updateCode418Status
const _origUpdateMetrics = updateMetrics;
// (can't easily monkey-patch, so the call is inlined in the main flow)

// Van status text variety
const VAN_STATUS_MESSAGES = [
  'en route to your area',
  'approximately 8–12 minutes away',
  'rerouting via A-road',
  'stopped for refreshments (mandatory)',
  'navigating one-way system',
  'approximately nearby',
  'ETA: recalculating',
  'GPS signal interrupted',
  'behind a tractor (not Code 418-related)',
];

setInterval(() => {
  const el = document.getElementById('vanStatus');
  if (el) el.textContent = VAN_STATUS_MESSAGES[Math.floor(Math.random() * VAN_STATUS_MESSAGES.length)];
}, 7000);

// Konami code message update — references Code 418
function triggerBlinkAmnesty() {
  const overlay = document.createElement('div');
  overlay.className = 'konami-overlay';
  overlay.innerHTML = `
    <div class="konami-box">
      <h2>♛ BLINK AMNESTY ACTIVATED ♛</h2>
      <p>
        You have successfully invoked the <em>Ocular Clemency Protocol</em>
        by entering the correct input sequence.
      </p>
      <p>
        The Secretary of State for Ocular Affairs has determined that the Konami Code is
        <strong>not a legally recognised instrument</strong> under <em>Ocular Compliance Code 418(k):
        Electronic Input Sequences as Legal Instruments (Amendment 2022)</em>.
      </p>
      <p>
        Your fine has been: <strong>NOT REDUCED. Code 418 applies.</strong>
      </p>
      <p style="font-size:12px;margin-top:16px;opacity:0.6;">
        Entering this code has been added to your case file under
        "Attempted Procedural Circumvention (Code 418 Annex G)." Sorry.
      </p>
      <button class="btn-primary" onclick="this.closest('.konami-overlay').remove()" style="margin-top:16px;">
        Understood (closes this, records a blink per Code 418(c))
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
}
