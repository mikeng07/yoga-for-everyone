// YogaRx — app logic filled in as we build
console.log('YogaRx loaded');

// View elements
const uploadView  = document.getElementById('upload-view');
const loadingView = document.getElementById('loading-view');
const resultsView = document.getElementById('results-view');

// Helper to switch between views
function showView(view) {
  uploadView.hidden  = true;
  loadingView.hidden = true;
  resultsView.hidden = true;
  view.hidden = false;
}

// Pain slider — update displayed value as user drags
const painSlider = document.getElementById('pain-level');
const painValue  = document.getElementById('pain-value');
painSlider.addEventListener('input', () => {
  painValue.textContent = painSlider.value;
});

// File input — show selected filename
const fileInput = document.getElementById('file-input');
const fileName  = document.getElementById('file-name');

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  fileName.textContent = file ? file.name : 'No file selected';
});

// Generate button — send PDF to backend, render yoga plan
const generateBtn = document.getElementById('generate-btn');

generateBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  const description = document.getElementById('description').value;

  if (!file && !description) {
    alert('Please upload a doctor\'s note or describe your symptoms.');
    return;
  }

  showView(loadingView);

  let plan;
  const formData = new FormData();
  if (file) formData.append('file', file);
  formData.append('gender',      document.getElementById('gender').value);
  formData.append('age',         document.getElementById('age').value);
  formData.append('height',      document.getElementById('height').value);
  formData.append('weight',      document.getElementById('weight').value);
  formData.append('pain_level',  document.getElementById('pain-level').value);
  formData.append('description', document.getElementById('description').value);

  try {
    const response = await fetch('http://localhost:8000/api/analyze-note', {
      method: 'POST',
      body: formData,
    });
    plan = await response.json();
  } catch {
    showView(uploadView);
    alert('Could not reach the server. Make sure the backend is running.');
    return;
  }

  renderPlan(plan);
  showView(resultsView);

  // Store plan globally so the schedule builder can access it
  window.currentPlan = plan;
  window.currentPainLevel = document.getElementById('pain-level').value;

  // Fire image AND video requests in parallel for every pose
  plan.poses.forEach(pose => {
    requestImage(pose);
    requestVideo(pose);
  });

  // Wire schedule button
  document.getElementById('schedule-btn').addEventListener('click', showLevelSelector);
});

// Request an image — shows quickly while video is still generating
async function requestImage(pose) {
  try {
    const response = await fetch('http://localhost:8000/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: pose.veo_prompt }),
    });
    const data = await response.json();

    const slot = document.getElementById(`image-front-${pose.pose_number}`);
    if (slot && data.image_url) {
      slot.outerHTML = `<img class="pose-image" id="image-front-${pose.pose_number}" src="${data.image_url}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />`;
    }
  } catch {
    // Image failed silently — video may still arrive
  }
}

// Request a video — replaces image (or shimmer) when ready
const VIDEO_TIMEOUT_MS = 150000; // 2m 30s

async function fetchVideo(pose) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), VIDEO_TIMEOUT_MS)
  );
  const request = fetch('http://localhost:8000/api/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: pose.veo_prompt }),
  }).then(r => r.json());

  return Promise.race([request, timeout]);
}

async function requestVideo(pose, isRetry = false) {
  try {
    const data = await fetchVideo(pose);
    const slot = document.getElementById(`video-back-${pose.pose_number}`);
    if (slot && data.video_url) {
      slot.outerHTML = `<video id="video-back-${pose.pose_number}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" src="${data.video_url}" autoplay loop muted playsinline></video>`;
    }
  } catch {
    if (!isRetry) {
      console.log(`Pose ${pose.pose_number} video timed out — retrying...`);
      requestVideo(pose, true);
    } else {
      const slot = document.getElementById(`video-back-${pose.pose_number}`);
      if (slot) {
        slot.outerHTML = `<div class="video-error" id="video-back-${pose.pose_number}">🧘 Video unavailable</div>`;
      }
    }
  }
}

// Render diagnosis card + pose cards from API response
function renderPlan(plan) {
  // Diagnosis card
  const diagnosisCard = document.getElementById('diagnosis-card');
  diagnosisCard.innerHTML = `
    <h2>Your Diagnosis</h2>
    <p class="diagnosis-text">${plan.diagnosis_summary}</p>
    <div class="contraindications">
      <span class="label">Avoid:</span>
      ${plan.contraindications.map(c => `<span class="tag">${c}</span>`).join('')}
    </div>
  `;

  // Pose cards
  const posesGrid = document.getElementById('poses-grid');
  posesGrid.innerHTML = plan.poses.map(pose => `
    <div class="pose-card">
      <div class="pose-header">
        <span class="pose-number">${pose.pose_number}</span>
        <div>
          <h3>${pose.name}</h3>
          <p class="sanskrit">${pose.sanskrit}</p>
        </div>
      </div>

      <div class="flip-card" onclick="this.querySelector('.flip-card-inner').classList.toggle('flipped')">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="video-placeholder" id="image-front-${pose.pose_number}"></div>
            <span class="flip-hint">▶ Tap for video</span>
          </div>
          <div class="flip-card-back">
            <div class="video-placeholder" id="video-back-${pose.pose_number}"></div>
          </div>
        </div>
      </div>

      <p class="pose-instruction">${pose.instruction}</p>
      <div class="pose-footer">
        <span class="benefit">${pose.benefit}</span>
        <span class="duration">⏱ Hold ${pose.duration_seconds}s</span>
      </div>
    </div>
  `).join('');
}

// Show level selector when schedule button clicked
function showLevelSelector() {
  const section = document.getElementById('schedule-section');
  section.innerHTML = `
    <div class="level-selector">
      <h3>Choose your progression level</h3>
      <div class="level-options">
        <button class="level-btn" onclick="buildSchedule('Gentle')">🌱 Gentle</button>
        <button class="level-btn" onclick="buildSchedule('Moderate')">🔥 Moderate</button>
        <button class="level-btn" onclick="buildSchedule('Progressive')">⚡ Progressive</button>
      </div>
    </div>
  `;
}

// Call backend to generate schedule, then render it
async function buildSchedule(level) {
  const section = document.getElementById('schedule-section');
  section.innerHTML = `<p class="schedule-loading">Generating your ${level} 4-week plan...</p>`;

  const response = await fetch('http://localhost:8000/api/generate-schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      poses: window.currentPlan.poses,
      level: level,
      pain_level: window.currentPainLevel,
    }),
  });
  const schedule = await response.json();
  renderSchedule(schedule);
}

// Render the 4-week plan inline
function renderSchedule(schedule) {
  const section = document.getElementById('schedule-section');
  section.innerHTML = `
    <h2 class="schedule-heading">📅 Your ${schedule.level} 4-Week Plan</h2>
    ${schedule.weeks.map(week => `
      <div class="week-card">
        <h3 class="week-title">Week ${week.week} — ${week.theme}</h3>
        ${week.sessions.map(session => `
          <div class="session">
            <h4 class="session-day">${session.day} <span class="session-time">${session.total_minutes} min</span></h4>
            <table class="session-table">
              <thead><tr><th>Pose</th><th>Sets</th><th>Reps</th><th>Hold</th><th>Note</th></tr></thead>
              <tbody>
                ${session.poses.map(p => `
                  <tr>
                    <td>${p.name}</td>
                    <td>${p.sets}</td>
                    <td>${p.reps || '—'}</td>
                    <td>${p.hold_seconds}s</td>
                    <td class="note">${p.note || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
      </div>
    `).join('')}
    <button class="schedule-btn" style="margin-top:1rem" onclick="showLevelSelector()">↩ Change Level</button>
  `;
}
