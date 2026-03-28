# Learning Journey — March 27

## Project: YogaRx (Hackathon)

---

## What We Built
Scaffolded the project structure for YogaRx — a web app that takes a doctor's PDF note and generates a personalized yoga video sequence using Gemini + Veo.

Files created: `frontend/index.html`, `frontend/style.css`, `frontend/app.js`, `backend/main.py`

---

## Key Takeaways

### HTML — Script placement matters
- The browser reads HTML **top to bottom**
- `<script>` at the bottom of `<body>` ensures all HTML elements exist before JavaScript tries to interact with them
- `<link>` for CSS goes in `<head>` so styles are applied before the page is visible (avoids flash of unstyled content)

### JavaScript — console.log as a sanity check
- `console.log('YogaRx loaded')` in `app.js` is a quick confirmation that the file is connected and running
- If it doesn't appear in the browser console → something is wrong (wrong path, typo in `src`)
- Useful habit during development to verify files are wired up correctly

### CSS — Resetting browser defaults
- Browsers add a default `margin` (~8px) to `<body>` automatically
- Setting `margin: 0` removes that gap so you control spacing from scratch
- Common first line in any CSS file — resets defaults for consistent cross-browser behavior

### Python / FastAPI — Conventions matter
- `FastAPI()` creates the web application instance — like turning on the server
- The variable is named `app` by convention, not rule
- Tools like `uvicorn` expect `uvicorn main:app` — if you rename it, you must update the command too
- Following conventions reduces friction with tutorials, teammates, and tooling

---

## Mindset Note
Asked "is it a rule?" about script placement — good instinct to question whether things are enforced or just best practice. Many things in web dev are conventions, not rules. Understanding *why* helps you know when to break them.
