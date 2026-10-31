# Attacker of English

英文進擊者 — a Blue Lock–inspired web game for learning the **12 English tenses**. The interface and explanations are in **Traditional Chinese (繁體中文)**; practice sentences stay in English. Every tense is one level: study the course, then win a 3D top-down football challenge to unlock the next level.

> Fan-made learning project inspired by the anime *Blue Lock*. Not affiliated with the official series.

## Run it

It's a static site with no build step. Serve the folder with any static server, for example:

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173. An internet connection is needed for Three.js (cdnjs) and Google Fonts.

## How to play

1. **Enter Blue Lock.** Pick a striker name. You start at rank #300.
2. **Course.** Each level teaches one tense: Coach Ego's briefing, the formula (positive / negative / question), when to use it, signal words, and examples on the pitch. Clear all 3 warm-up drills to unlock the challenge.
3. **Challenge (3D top-down match).**
   - Move with **WASD / arrow keys**, or the **on-screen joystick** on touch devices.
   - Collect glowing **EGO orbs** to fill your **Flow** meter. With full Flow you get a speed boost, and your next question has only 2 options (50/50).
   - When a defender reaches you, a **DUEL** starts. Answer correctly to break through. A wrong answer costs a heart and the ball.
   - Enter the penalty box to **SHOOT**. A correct answer scores. A wrong answer means the keeper saves it and you lose a heart.
   - Answer with a click/tap or the **1–4** keys before the timer runs out.
4. **Objective.** Score **3 goals** before you lose **3 hearts**. A win clears the level, unlocks the next one, and earns 1–3 stars (one per heart left). Later levels add more and faster defenders, and mix in review questions from earlier tenses.

## 中譯 translation mode

Every English sentence (examples, drills, match questions) has a Traditional Chinese translation:

- **中譯 switch** (course top bar, question card, ⚙ Settings) shows or hides all translations. The choice is saved.
- **譯 button** next to each sentence reveals or hides just that one, overriding the switch.
- During a match, press **T** to flip the switch.

## Levels

| # | Category | Tense |
|---|----------|-------|
| 1–4 | Present | Simple, Continuous, Perfect, Perfect Continuous |
| 5–8 | Past | Simple, Continuous, Perfect, Perfect Continuous |
| 9–12 | Future | Simple, Continuous, Perfect, Perfect Continuous |

The level map can be filtered by **tense category** (Present / Past / Future) and by **status** (Not started / Course done / Cleared / Locked).

## Data

All progress is saved in `localStorage` under `attacker-of-english:v1`: name, ego points, drills done, cleared levels, stars, attempts, filter choices, and translation mode. Reset it from ⚙ Settings.

## Files

```
index.html        app shell and views
css/styles.css    responsive UI (mobile + desktop)
js/data.js        12 tense lessons + question bank (English)
js/data-zh.js     Traditional Chinese names, usage notes, translations, explanations
js/storage.js     localStorage persistence
js/game.js        Three.js 3D top-down match
js/app.js         routing, course, match flow, results
```
