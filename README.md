# HOOCER — HM Office for Ocular Compliance & Eyelid Regulation

## A DEV April Fools Challenge 2026 Entry

### Or: "I Stayed Up Until 3am Building A Fake Government Agency That Regulates Blinking And I Have No Regrets Whatsoever"

---

I was lying awake at 1:47am — as one does — thinking about how the UK government regulates
genuinely extraordinary things. Pub opening hours. What you can name your boat. The exact
legal definition of a banger. And I thought: *what if they regulated blinking?*

Four days, several coffees, and one strongly worded memo about crisps later: here we are.

---

## What Is This

**HOOCER** is a fully fake UK government agency — the *HM Office for Ocular Compliance &
Eyelid Regulation* — with a complete citizen-facing portal, a staff intranet (accidentally
public), an enforcement van, a tribunal, a chatbot that can't help you, and a form that
cannot be submitted.

The entire site operates under **Ocular Compliance Code 418**, a fictional enforcement code
that happens to share its number with HTTP 418 (I'm a Teapot). This is entirely intentional.
It is also the best creative decision I've ever made.

---

## Features

### Core Portal
- **Live Blink Monitor** — counts your "blinks" using a scientifically questionable detection
  algorithm (mouse activity, tab switching, the passage of time, and clicking "I Did Not Blink"
  which Code 418(c) converts directly into a blink)
- **Official Fine Notice** — a complete, watermarked, bureaucratic fine with a multiplier that
  occasionally has a "Government IT incident" and outputs something like £14,392 for two excess blinks
- **Form OCI-7 Appeal** — a full appeal form with 14-department fake processing and automated denial

### Blink Training Simulator
A two-phase training module where the Blink Detection Engine accuses you every 2–5 seconds
with one of 34 different bureaucratic accusations, including:

- *"Your eyes closed. Briefly. But 'briefly' is not a legal category under Code 418."*
- *"Per the Act: that's a blink. Section 2, definition (a): voluntary or involuntary closure. You closed."*
- *"No, you didn't blink earlier. You blinked now. That's different. The earlier blink was also a blink."*

The training module has never been passed. This is documented in Internal Guidance Note IGN-44.

### National Blink Surveillance Map
A live SVG map (very accurate too) of the UK with randomly-generated blink events appearing in real time, colour-coded
by compliance level. London always has the worst numbers. They're stressed. It's London. Milton
Keynes HQ is marked with a gold star. Always watching.

### HOOCER Mobile Enforcement Van Tracker
A GPS tracker for VAN-7, driven by D. Thompson (Grade 6). The van moves around the map, generates
status logs ("stuck behind a tractor — not Code 418-related"), and never actually arrives.
ETA fluctuates between 3 and 22 minutes. Occasionally the van gets lost near "some shops."

### Blink Appeal Chatbot (AAAS)
An automated appeal assistant that:
- Sincerely and effortfully cannot help you
- References Form OCI-7 regardless of your question
- Loops back to the beginning after 6 exchanges
- Contradicts itself between sessions
- Occasionally accuses you of blinking during the conversation

### Ocular Tribunal Audio Logs
Four absurd tribunal hearings, rendered using the Web Audio API:
- *Blinksworth v. HOOCER* — the salt and vinegar crisp incident
- *Re: Petition of C. Ocular* — philosophical grounds (the gerund argument)
- *Emergency Hearing: The Staring Contest Incident* — the Tribunal had not anticipated this
- *H. Yelid — Van Encounter Appeal* — the van's signage was in 14pt Arial. Adequate.

Each hearing has a scrolling transcript that syncs with the audio, partial redactions replaced
with an ominous tone chosen by the IT team.

### Form EYE-9: Renunciation of Blinking
A statutory opt-out form that:
- Requires a Justice of the Peace countersignature (unavailable)
- Requires an Ocular Notary witness (register closed since 2021, zero notaries registered)
- Requires a payment reference before submission and a submission reference before payment
- Has two mandatory sections that directly contradict each other
- Cannot be submitted. This is not a bug.
- Cycling submission attempts produce increasingly unhinged error messages, culminating in
  `FATAL-418: The server is a teapot and refuses to accept EYE-9 forms.`

### Blink Compliance Self-Assessment (Gaslight Mode)
Six questions about your own blinking. For every answer you give, HOOCER's records disagree.
Every question. All six. 100% discrepancy rate. The discrepancies are always yours.
A Self-Report Discrepancy Notice is issued at the end. The fine scales with how much you blinked.

### HOOCER Staff Intranet (Accidentally Public)
An internal staff portal, currently visible to the public due to IT ticket HOO-IT-2026-0774
(Status: Open, Week 6). Contains:
- Memos including a divisional note about crisps (classified OFFICIAL by mistake)
- Active disciplinary notices (the IT person made the intranet public, the Tribunal Chair sent
  the crisp memo, and a Grade 7 officer blinked 12,440 times in a monitored week)
- Six broken staff tools including a BSM Calculator returning values up to 500x
- Live Code 418 enforcement statistics
- A tea fund that has been in deficit since March

---

## The Fake Legal Framework

**Ocular Compliance Code 418** governs the entire site. Key provisions include:
- **418(a)** — Basic blink infringement
- **418(b)** — Wilful or reckless blinking
- **418(c)** — Blink denial (clicking "I Did Not Blink" counts as admission)
- **418(d)** — Ironic non-compliance during blink training
- **418(e)** — Unacceptable appeal
- **418(f)** — Record flagging
- **418(g)** — Documented Ocular Discourse (chatbot conversations)
- **418(k)** — Electronic Input Sequences as Legal Instruments (why the Konami Code doesn't work)

Full fake legislation is in `LEGISLATION.md`, including Schedule 12 (Allium Proximity Defence)
and the note that HOOCER employs zero Allium Inspectors and therefore the defence is
impossible to invoke.

---

## Tech Stack

```
HTML            ████████████████  100%  (9 pages, all in root)
CSS             ████████████████  100%  (GOV.UK aesthetic, slightly broken)
JavaScript      ████████████████  100%  (vanilla, no frameworks, no regrets)
Web Audio API   ████████████░░░░   75%  (tribunal hearings. actual audio. from scratch.)
SVG             ████████████░░░░   75%  (UK map, eye animation, tribunal waveforms)
Instant coffee  ████████████░░░░   72%  (ran out near form-EYE-9)
Sleep           ████░░░░░░░░░░░░   25%  (insufficient)
Regrets         ░░░░░░░░░░░░░░░░    0%
```

No frameworks. No build step. No `node_modules`. No TypeScript. No Webpack. No Vite.
No package.json. Just files in a folder, deployed to Cloudflare Pages, monitoring your blinks.

---

## File Structure

```
/
├── index.html              — main portal: blink monitor, fine, appeal, denial
├── style.css               — shared styles, GOV.UK aesthetic
├── script.js               — blink detection engine, fine calculator, Konami code
├── compliance-score.js     — floating live compliance widget (appears on every page)
├── blink-simulator.html    — mandatory training module BT-7
├── surveillance-map.html   — national blink surveillance map
├── van-tracker.html        — VAN-7 GPS tracker (D. Thompson, Grade 6)
├── chatbot.html            — automated appeal assistance (cannot help)
├── tribunal-audio.html     — tribunal hearing audio logs
├── form-EYE-9.html         — statutory renunciation of blinking (cannot be submitted)
├── intranet.html           — staff intranet (accidentally public)
├── gaslight.html           — ocular compliance self-assessment
├── favicon.svg             — crown and eye, because of course
├── manifest.json           — PWA manifest (someone installed this. I want to meet them.)
├── _headers                — Cloudflare Pages headers (includes X-Blink-Threshold: 25)
├── README.md               — you are here
├── LEGISLATION.md          — the Act, in full, including the crisp clause
└── teapot.txt              — RFC 2324 compliance
```

---

## Deployment

Drop the folder onto Cloudflare Pages. Click deploy. No build step. It runs.

Every page loads the shared `compliance-score.js` which injects a floating live compliance
percentage in the bottom-right corner. The percentage is random. It drifts between 19%
and 71%. It is never good. It never gets better. This is by design.

Response headers include `X-HOOCER-Monitoring: ACTIVE` and `X-Blink-Threshold: 25` and
`X-Appeal-Status: Probably-Denied`. These are functionally useless. I'm proud of them.

---

## FAQ

**Is this a real government website?**
No. HOOCER does not exist. Ocular Compliance Code 418 is not real. The Eyelid Tribunal
does not sit. D. Thompson's van is not outside your house. Please blink normally.

**The fine is £48,291.00 for two excess blinks.**
The Blink Severity Multiplier has a 3% chance of experiencing what the code comments
describe as a "Government IT incident." The fine stands. An investigation is ongoing.

**The Form EYE-9 countdown reaches zero and then nothing happens.**
Correct. The form cannot be submitted. This is documented. The documentation is correct.

**Why does the intranet say it's publicly accessible by accident?**
Because it's funnier that way. IT ticket HOO-IT-2026-0774 is open. Status: open.

**The chatbot has given me contradictory information.**
This is consistent with its design specification. It does not have a specification.
The contradiction is the specification.

**I tried the Konami code.**
It didn't help. Code 418(k) is very clear on this. The attempt was noted on your file.

**What happened in The Dorset Situation?**
We cannot discuss this. Hover over the redacted text on the intranet to find out.

**Are the crisps actually mild?**
We have reviewed the available evidence and we are not taking a position on the crisps.
This matter is closed. The Tribunal Chair has requested we not reopen it.

---

## Author Note

This took four evenings, one very late morning, and one accidental 2am when I thought
"I'll just add the chatbot" and looked up an hour later having also written a fake tribunal
audio system using the Web Audio API.

The fake muffled voices in the tribunal hearings are AM-modulated sawtooth oscillators.
Different characters have different fundamental frequencies. Margaret (Tribunal Chair)
is 200Hz. The appellant is 350Hz. The Redaction Tone is 440Hz descending, square wave.
I am aware this is an extraordinary amount of effort for a joke.

My partner asked what I was building. I said "a fake government website with a tribunal
that generates synthesised audio of hearings about crisps." She looked at me for a long time.

She now also knows what Code 418 is.

If this wins anything, I will frame it next to the GCSE Art certificate (C, proud of that mug).

If this wins nothing, I'm building the **Authority for Sneeze Regulation (TASR)** next.
The TASR operates under Nasal Compliance Code 451.

---

*Built for the DEV April Fools Challenge 2026*

*HOOCER is not real. Blinking is not regulated. The van will not arrive.*
*The crisps were not mild. (This position is not endorsed by the author.)*

*Please blink normally.*
