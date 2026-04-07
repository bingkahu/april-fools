# HOOCER — HM Office for Ocular Compliance & Eyelid Regulation

## A DEV April Fools Challenge 2026 Entry

### Or: "I Stayed Up Until 2am Building A Fake Government Website About Blinking And I Have No Regrets"

---

I was lying awake at 1:47am — as one does — thinking about how the UK government regulates genuinely
extraordinary things. Pub opening hours. What you can name your boat. The exact shape of a banger.
And I thought: *what if they regulated blinking?*

This is that thought, made real, made worse, deployed to the internet.

---

## What Is This

**HOOCER** is a fully fake UK government portal for the fictional *HM Office for Ocular Compliance
& Eyelid Regulation*, which monitors your blinking activity, issues you a fine when you exceed
the "legal limit" of 25 blinks, processes your appeal through 14 government departments, and
then denies it.

The "blink detection" is completely made up and works like this:

| Behaviour | Interpretation |
|-----------|---------------|
| Mouse is moving | You're tracking something with your eyes → preceded by a blink |
| Mouse has stopped | You stopped looking → eyes closed → blink |
| You switched tabs | You looked away. Classic. |
| Time is passing | Time = blinking. This is science. |
| You clicked something | Pre-click micro-blink (very real, very documented, I looked it up*) |
| You clicked "I DID NOT BLINK" | Recorded as a blink. This is the best bit. |

_* I did not look it up_

---

## Features

- **Live blink counter** with a scanning line animation because I wanted it to feel ominous
- **Fake biometric readings** (Lid Velocity in μm/s, Eye Moisture Index) that are completely random and refresh every update cycle
- **Live National Blink Feed** — a scrolling terminal of fabricated citizen blink data in hacker green because why not
- **Official fine notice** with a genuine watermark effect and a fine calculated by an elaborate formula that occasionally malfunctions and outputs something like £14,392.00 for two excess blinks
- **Appeal form** (Form OCI-7) with seven grounds of appeal including "I philosophically dispute the existence of blinks as discrete events"
- **Fake 14-department processing pipeline** that takes about 10 seconds and denies you at the end
- **CSS rubber stamp** that says APPEAL DENIED at a slight angle. My proudest work.
- **Konami code easter egg** that tells you your fine has NOT been reduced
- **Comic Sans footer on hover** because I am a professional

---

## Tech Stack

```
HTML            ████████████████  100%  (one file. just the one.)
CSS             ████████████████  100%  (GOV.UK aesthetic, partially broken)
JavaScript      ████████████████  100%  (vanilla. I'm not installing anything for this.)
Caffeinated beverages ███████░░░   68%  (ran out near the end)
Regrets               ░░░░░░░░░░    0%
```

No frameworks. No build step. No `node_modules` folder taking up 847MB. No `.env` file hiding
shameful API keys. No TypeScript (I considered it for about 4 seconds then remembered this is
a website about blinking). Just HTML, CSS, and JavaScript, the holy trinity of making things
that probably shouldn't exist.

---

## Deployment

Cloudflare Pages. Drop the files in. Click deploy. It runs. There is nothing to build.

The `_headers` file adds some fun response headers to every page including:

```
X-HOOCER-Monitoring: ACTIVE
X-Blink-Threshold: 25
X-Powered-By: Unspecified Government Framework v4.2
X-Appeal-Status: Probably-Denied
```

These headers do nothing. They are purely for people who check the network tab.
(Hello, network tab people. You're blinking right now.)

---

## File Structure

```
/
├── index.html       — the whole app. four screens. one file.
├── style.css        — GOV.UK aesthetic, 0.15 degrees off from correct
├── script.js        — fake blink detection engine (comments included)
├── README.md        — you are here
├── LEGISLATION.md   — the law that governs all of this (not real)
├── manifest.json    — PWA manifest, mostly unnecessary, added for the vibes
├── teapot.txt       — RFC 2324 compliance
└── _headers         — Cloudflare Pages headers, mostly jokes
```

---

## FAQ

**Is this a real government website?**
No. HOOCER does not exist. The Ocular Regulation and Eyelid Governance Act 2019 is not
real legislation. Please do not write to your MP about blink fines. I will feel responsible.

**Why does clicking "I Did Not Blink" record a blink?**
Because the act of denying a blink requires your eyes to be open, which implies they
were previously closed. The defendant cannot both deny the blink and provide evidence
of open eyes. This is the doctrine of Ocular Mens Rea (R v. Blinksworth, 2021, also made up).

**The fine is £48,291.00 and I only did two extra blinks.**
The Blink Severity Multiplier calculation has a 3% chance of experiencing what I've
documented in the code as a "Government IT incident." The fine stands. The Tribunal
has been notified. There is an investigation. It will take several years.

**I entered the Konami code and nothing good happened.**
Something happened. It just didn't reduce your fine. That was always going to be the
outcome. I'm glad you tried.

**The "Pay Fine" button doesn't work.**
Neither does the real government payment portal, if my previous experiences are
anything to go by. This is a faithful simulation.

**This made me anxious.**
That's working as intended. The government wants you slightly anxious.
That's just governance.

**The live blink feed shows my name.**
It doesn't. All names are made up. If you see "Margaret H." that is a coincidence
and not your fault.

---

## Known Issues

- The fine sometimes computes to something with three decimal places (e.g. £14.003). Not
  legal tender. The tribunal has been informed. They said "that's on the developer."
- On mobile, the bureaucratic aesthetic suffers slightly. I considered fixing this and
  then decided government websites look a bit broken on mobile anyway, so this is authentic.
- The commitment slider on the appeal form goes up to 10 (Will Never Blink Again) which the
  code comments say should prompt the user to seek medical attention. The code does not
  actually do this. It's just a comment. I ran out of time.

---

## Author Note

This took me one evening, one morning, and several laps of my flat muttering
"what if the blink limit was 25" to myself.

My partner asked what I was doing. I said "a government website about blinking."
She looked at me for a long time and then left the room.

If this wins anything, I will frame the notification and put it next to my GCSE
Art certificate (a C — but I'm proud of that ceramic mug and I stand by it).

If this wins nothing, I will add a second agency: the **Authority for Sneeze Regulation (TASR)**.
Consider this your warning.

---

*Built for the DEV April Fools Challenge 2026*

*HOOCER is not real. Blinking is not regulated. The Konami code will not help you.*

*Please blink normally.*
