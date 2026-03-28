# YogaRx — Milestones

---

## M1: UI Shell — Upload screen visible in browser ✅
- [x] 1.1 Create project structure
- [x] 1.2 Build upload view
- [x] 1.3 Build results view skeleton
- [x] 1.4 Wire view transitions

---

## M2: Backend scaffold + PDF upload ✅
- [x] 2.1 FastAPI app with CORS + `GET /health` endpoint
- [x] 2.2 `POST /api/analyze-note` returns mock yoga plan JSON
- [x] 2.3 Frontend sends PDF to backend, displays mock yoga plan

---

## M3: Gemini PDF parsing — real yoga plan ✅
- [x] 3.1 Integrate Gemini File API
- [x] 3.2 Parse Gemini JSON response, return structured yoga plan
- [x] 3.3 Display diagnosis summary + contraindications

---

## M4: Veo video generation ✅
- [x] 4.1 `POST /api/generate-video` endpoint wired to Veo API
- [x] 4.2 Frontend fires video requests in parallel
- [x] 4.3 Videos load progressively with shimmer skeleton
- [x] 4.4 Error fallback via Imagen illustration

---

## M5: Patient context form — two-column upload view
- [ ] 5.1 Redesign upload view — two columns (left: patient form, right: PDF upload)
  - **Verify:** Upload view shows two side-by-side panels on desktop — form on left, drop zone on right
- [ ] 5.2 Patient form fields — gender, height, weight, pain level (1–10), description
  - **Verify:** All fields render correctly; pain level shows as a 1–10 slider with current value displayed
- [ ] 5.3 Pass patient context + PDF to backend, include in Gemini prompt
  - **Verify:** Upload PDF + fill form → diagnosis card and poses reflect the patient's pain level and description

---

## M6: Pose card redesign — image + video side by side
- [ ] 6.1 `POST /api/generate-image` endpoint wired to Imagen API
  - **Verify:** `curl` the endpoint → base64 image returned in terminal
- [ ] 6.2 Pose card layout — image on left, video thumbnail on right (click to play)
  - **Verify:** Results page shows pose cards with image placeholder left + video placeholder right
- [ ] 6.3 Images load progressively into left slot as Imagen completes
  - **Verify:** Left slots fill in with generated illustrations one by one
- [ ] 6.4 Videos load into right slot; click to play (no autoplay)
  - **Verify:** Right slot fills in with video; clicking it starts playback
- [ ] 6.5 If video fails after all others loaded, auto-retry once
  - **Verify:** Simulate a slow video — after others complete, failed card retries and video appears

---

## M7: Polish + demo prep
- [ ] 7.1 UI polish — typography, spacing, transitions
  - **Verify:** Overall layout looks clean and professional
- [ ] 7.2 Error handling — invalid file type, missing form fields, backend down
  - **Verify:** Upload a `.txt` file → friendly error message, no crash
- [ ] 7.3 Demo prep — 3 sample doctor notes tested end-to-end
  - **Verify:** Full flow works reliably with each sample note

---

## M8 (Optional): Background music via Lyria
- [ ] 8.1 `POST /api/generate-music` endpoint wired to Lyria API
- [ ] 8.2 Music plays softly when results load, toggle on/off
  - **Verify:** Music toggle in corner → clicking starts/stops background audio with fade

---

## Cut Line

If time is short, ship in this order:

1. **Must have:** PDF upload + patient form → Gemini plan displayed (M1–M5)
2. **Core demo:** Images + at least 1 video per pose (M6.1–M6.4)
3. **Nice to have:** Video retry logic + polish (M6.5, M7)
4. **Bonus:** Lyria music (M8)
