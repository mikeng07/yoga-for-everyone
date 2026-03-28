# YogaRx — Milestones

---

## M1: UI Shell — Upload screen visible in browser
- [ ] 1.1 Create project structure (`frontend/index.html`, `style.css`, `app.js`, `backend/main.py`)
  - **Verify:** Open `index.html` in browser — page loads with no console errors
- [ ] 1.2 Build upload view — drag-drop zone, tagline, "Generate My Yoga Plan" button
  - **Verify:** Upload zone is centered on screen; button is visible and styled
- [ ] 1.3 Build results view skeleton — diagnosis card + 3 pose card placeholders (hardcoded, hidden)
  - **Verify:** Temporarily show results view in JS → diagnosis card and pose cards render correctly
- [ ] 1.4 Wire view transitions — upload → loading spinner → results
  - **Verify:** Click button → loading spinner appears → results view appears (with mock data)

---

## M2: Backend scaffold + PDF upload
- [ ] 2.1 FastAPI app with CORS + `GET /health` endpoint
  - **Verify:** Run `uvicorn main:app` → `curl http://localhost:8000/health` returns `{"status": "ok"}`
- [ ] 2.2 `POST /api/analyze-note` returns hardcoded mock yoga plan JSON
  - **Verify:** `curl -X POST /api/analyze-note -F "file=@test.pdf"` → mock JSON returned in terminal
- [ ] 2.3 Frontend sends PDF to backend, displays mock yoga plan in results view
  - **Verify:** Upload any PDF → diagnosis card shows mock text + 3 pose cards appear with mock names

---

## M3: Gemini PDF parsing — real yoga plan
- [ ] 3.1 Integrate Gemini File API — upload PDF and pass to Gemini in backend
  - **Verify:** Backend logs show Gemini raw response for a real doctor note PDF
- [ ] 3.2 Parse Gemini JSON response, return structured yoga plan from `/api/analyze-note`
  - **Verify:** Upload a real doctor note PDF → diagnosis summary and pose names on screen match the note content
- [ ] 3.3 Display diagnosis summary + contraindications in the diagnosis card
  - **Verify:** Diagnosis card shows the actual condition name and a list of movements to avoid

---

## M4: Veo video generation — yoga videos per pose
- [ ] 4.1 `POST /api/generate-video` endpoint wired to Veo API (with polling loop)
  - **Verify:** Call endpoint manually with a sample prompt → terminal shows polling logs → video URL returned
- [ ] 4.2 Frontend fires video requests in parallel for all poses after plan loads
  - **Verify:** Network tab shows multiple `/api/generate-video` requests firing simultaneously
- [ ] 4.3 Videos load progressively — each pose card shows shimmer skeleton, then video player appears
  - **Verify:** Watch the results page — pose cards fill in with video players one-by-one as Veo completes
- [ ] 4.4 Error fallback — if a video fails, pose card shows a placeholder image (not broken)
  - **Verify:** Manually kill one video request → that card shows a calm placeholder, others still work

---

## M5: Polish + demo prep
- [ ] 5.1 UI polish — wellness color palette, typography, smooth transitions, mobile responsive
  - **Verify:** Open on mobile viewport in DevTools → layout looks clean, no overflow
- [ ] 5.2 Error handling — invalid file type, backend down, Gemini failure
  - **Verify:** Upload a `.txt` file → friendly error message appears (not a console crash)
- [ ] 5.3 Demo prep — 3 sample doctor note PDFs tested end-to-end, full flow works reliably
  - **Verify:** Run full flow with each sample note → yoga plan + at least 2 videos generate successfully

---

---

## M6 (Optional): Pose illustrations via Imagen
- [ ] 6.1 `POST /api/generate-image` endpoint wired to Imagen API
  - **Verify:** Call endpoint with a sample pose prompt → image URL returned in terminal
- [ ] 6.2 Frontend requests pose image in parallel with video; image shows immediately while video loads
  - **Verify:** Results page shows a generated illustration in each pose card before the video arrives
- [ ] 6.3 Image acts as video poster frame — replaced by video player once Veo completes
  - **Verify:** Pose card shows Imagen illustration → seamlessly transitions to video player when ready

---

## M7 (Optional): Background music via Lyria
- [ ] 7.1 `POST /api/generate-music` endpoint wired to Lyria API
  - **Verify:** Call endpoint → calming music audio URL returned in terminal
- [ ] 7.2 Music auto-plays softly when results view loads (muted by default, user unmutes)
  - **Verify:** Results page loads → music toggle button visible in corner; clicking it starts calm background audio
- [ ] 7.3 Music toggle (on/off) with smooth fade in/out
  - **Verify:** Toggle music on → audio fades in; toggle off → audio fades out gracefully

---

## Cut Line

If time is short, ship in this order of priority:

1. **Must have:** PDF upload → Gemini diagnosis card displayed (M1–M3)
2. **Core demo:** At least 1 Veo video generated and playing (M4.1–M4.3, single pose)
3. **Nice to have:** All poses with progressive video loading + polish (M4.4, M5)
4. **Bonus:** Imagen pose illustrations (M6) — high visual impact, relatively quick to add
5. **Bonus:** Lyria background music (M7) — nice atmosphere for demo, lowest priority
