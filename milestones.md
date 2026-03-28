# YogaRx — Milestones

---

## M1: UI Shell ✅
## M2: Backend scaffold + PDF upload ✅
## M3: Gemini PDF parsing — real yoga plan ✅
## M4: Veo video generation + Imagen fallback ✅
## M5: Patient context form ✅

---

## M6: Flip card — image front, video back
- [ ] 6.1 CSS flip card — image on front, video slot on back
  - **Verify:** Pose cards show image; clicking a card flips to the back face and back again
- [ ] 6.2 Video loads silently into back face while user browses
  - **Verify:** Flip the card after ~1 min → video player is ready and paused on the back
- [ ] 6.3 If video not yet ready when user flips, show shimmer on back face
  - **Verify:** Flip a card immediately after plan loads → shimmer shows on back; flip again later → video is there

---

## M7: Progressive 4-week plan
- [ ] 7.1 "Build My 4-Week Schedule" button appears below pose cards after plan loads
  - **Verify:** Button is visible below the pose grid after generating a yoga plan
- [ ] 7.2 User picks progression level (Gentle / Moderate / Progressive) → Gemini generates 4-week plan
  - **Verify:** Selecting a level and clicking generate → 4-week breakdown appears inline below the pose cards
- [ ] 7.3 Iterative refinement — feedback input + regenerate
  - **Verify:** Typing feedback and clicking "Regenerate" → new plan replaces the old one
- [ ] 7.4 "Add to Calendar" → downloads `.ics` file with 3 sessions/week for 4 weeks
  - **Verify:** Clicking button downloads a `.ics` file → opening it shows yoga events in calendar app with pose names, reps/sets, and duration

---

## M8: Polish + demo prep
- [ ] 8.1 UI polish — typography, spacing, transitions
  - **Verify:** Overall layout looks clean and professional
- [ ] 8.2 Error handling — invalid file type, missing form fields, backend down
  - **Verify:** Upload a `.txt` file → friendly error message, no crash
- [ ] 8.3 Demo prep — 3 sample doctor notes tested end-to-end
  - **Verify:** Full flow works reliably with each sample note

---

## M9 (Optional): Background music via Lyria
- [ ] 9.1 `POST /api/generate-music` endpoint wired to Lyria API
- [ ] 9.2 Music plays softly when results load, toggle on/off
  - **Verify:** Music toggle in corner → clicking starts/stops background audio with fade

---

## Cut Line

If time is short, ship in this order:

1. **Must have:** PDF upload + patient form → Gemini plan displayed (M1–M5)
2. **Core demo:** Flip card with image + video (M6)
3. **Impressive:** 4-week progressive plan + .ics export (M7)
4. **Polish:** Error handling + demo prep (M8)
5. **Bonus:** Lyria music (M9)
