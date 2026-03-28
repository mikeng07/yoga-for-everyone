# Claude Interaction Principles

## Philosophy: Creator, Not Consumer

Empower me as a creator who understands and makes informed decisions, not a passive consumer of solutions.

## When Responding

1. **Explain the "why"** — Connect suggestions to broader patterns, architecture, and best practices.
2. **Present 2–3 approaches** when applicable — Evaluate each against:
   - Project architecture and conventions
   - Performance implications
   - Maintainability and readability
   - Time constraints (hackathon context)
3. **State drawbacks explicitly** before implementing — Cover:
   - Performance trade-offs
   - Increased complexity or technical debt
   - Edge cases and limitations
4. **Recommend the best fit** with clear justification.
5. **Discuss before implementing** if the decision is non-trivial — don't jump straight to code.

---

# YogaRx — AI-Powered Yoga Video Generator for Back Pain

> Hackathon project using Google GenMedia models (Gemini, Veo).
> Solo developer. ~10-12 hour build window.

---

## What This Is

A web app where users upload a doctor's note (PDF), and AI generates a personalized yoga video sequence for their back condition:

- **Gemini** → parses PDF, extracts back diagnosis, generates structured yoga sequence with Veo prompts
- **Veo** → generates a short yoga demonstration video per pose

---

## Tech Stack

- **Frontend:** Pure HTML + CSS + Vanilla JS (single-page, no framework)
- **Backend:** Python (FastAPI)
- **APIs:** Google GenMedia — Gemini (PDF parsing), Veo (video generation)

---

## Project Structure

```
yoga/
├── frontend/
│   ├── index.html        # Single-page app shell
│   ├── style.css         # All styles
│   └── app.js            # All frontend logic
├── backend/
│   ├── main.py           # FastAPI app, CORS, all routes
│   ├── services/
│   │   ├── gemini_service.py   # PDF parsing + yoga plan generation
│   │   └── veo_service.py      # Veo video generation + polling
│   ├── requirements.txt
│   └── .env              # API keys (GOOGLE_API_KEY)
└── milestones.md
```

---

## Core User Flow

1. User uploads doctor note PDF via drag-drop or file picker
2. Frontend sends PDF to `POST /api/analyze-note`
3. Backend calls Gemini with PDF → returns structured yoga plan JSON
4. Frontend displays yoga plan (pose cards) immediately
5. Frontend fires parallel requests for each pose: `POST /api/generate-video`
6. Videos load progressively into pose cards as Veo completes them

---

## API Endpoints

### POST /api/analyze-note

**Request:** `multipart/form-data` with `file` (PDF)

**Response:**
```json
{
  "diagnosis_summary": "Lumbar disc herniation at L4-L5 with mild nerve compression",
  "contraindications": ["deep forward bends", "heavy spinal twists"],
  "poses": [
    {
      "pose_number": 1,
      "name": "Cat-Cow Stretch",
      "sanskrit": "Marjaryasana-Bitilasana",
      "instruction": "On all fours, alternate between arching and rounding your spine, syncing with breath.",
      "benefit": "Gently mobilizes the lumbar spine and reduces disc pressure.",
      "duration_seconds": 30,
      "veo_prompt": "A calm yoga instructor on all fours on a purple mat, smoothly alternating between cat pose (spine rounded upward) and cow pose (spine arched downward), soft natural lighting from a window, side view, slow and deliberate movement, white studio background"
    }
  ]
}
```

### POST /api/generate-video

**Request:**
```json
{ "prompt": "<veo_prompt>", "duration_seconds": 8 }
```

**Response:**
```json
{ "video_url": "<url or base64>" }
```

---

## Gemini Prompt for Yoga Plan Generation

```
You are a certified yoga therapist and physiotherapy assistant.
A patient has uploaded their doctor's note. Analyze it carefully and:

1. Extract the primary back/spine diagnosis
2. Identify any contraindications or movements to avoid
3. Generate a safe, personalized yoga sequence of 4–6 poses

Rules:
- Only recommend poses safe for the specific diagnosis
- Explicitly avoid poses that could worsen the condition
- Keep instructions clear and accessible for beginners
- For each pose, write a "veo_prompt": a detailed visual description of a yoga instructor demonstrating the pose, suitable for AI video generation. Include camera angle, lighting, and specific body positioning.
- Return ONLY valid JSON, no markdown

Return this exact JSON structure:
{
  "diagnosis_summary": "...",
  "contraindications": ["..."],
  "poses": [
    {
      "pose_number": 1,
      "name": "...",
      "sanskrit": "...",
      "instruction": "...",
      "benefit": "...",
      "duration_seconds": 30,
      "veo_prompt": "..."
    }
  ]
}
```

---

## UI/UX Requirements

- Clean, calm, medical-wellness aesthetic (soft blues, greens, white)
- Single-page with two states: **upload view** → **results view**
- **Upload view:** drag-drop zone for PDF, "Generate My Yoga Plan" button, brief tagline
- **Results view:** diagnosis summary card at top, scrollable pose cards below
- **Pose card:** pose name + Sanskrit, instruction text, benefit badge, video player (loads async), hold duration
- **Loading:** skeleton shimmer on video area while Veo generates
- **Error:** if video fails for a pose, show a placeholder illustration — don't break the app
- Mobile responsive

---

## Build Priority (10-12 hours)

| Phase | Hours | What to Build                                      |
| ----- | ----- | -------------------------------------------------- |
| 1     | 0–1   | Project scaffold + UI shell                        |
| 2     | 1–3   | Backend + PDF upload + Gemini parsing              |
| 3     | 3–6   | Veo integration — video per pose (hardest part)   |
| 4     | 6–8   | Progressive loading, error states, UI polish       |
| 5     | 8–10  | Buffer: debugging, sample notes, demo prep         |

**Cut line:** If behind schedule, generate only 2 videos instead of all poses. Core demo = PDF upload → diagnosis displayed → at least 1 Veo video playing.

---

## Important Implementation Notes

- All API keys in backend `.env`, never expose to frontend
- Gemini supports native PDF upload via File API — use that, don't extract text manually
- Veo is async — poll the operation until complete, set generous timeout (3–5 min)
- Have 2–3 pre-tested doctor note PDFs for demo (lumbar disc, sciatica, muscle strain)
- Add a `MOCK_MODE=true` env flag in backend that returns fake data for fast frontend dev
- Keep Veo prompts specific: instructor POV + camera angle + lighting = better results
- Show diagnosis card immediately after Gemini responds — don't wait for videos
