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
  if (!file) {
    alert('Please select a PDF file first.');
    return;
  }

  showView(loadingView);

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/api/analyze-note', {
    method: 'POST',
    body: formData,
  });
  const plan = await response.json();

  renderPlan(plan);
  showView(resultsView);

  // Fire image AND video requests in parallel for every pose
  plan.poses.forEach(pose => {
    requestImage(pose);
    requestVideo(pose);
  });
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

    // Only show image if the video hasn't already arrived
    const slot = document.getElementById(`video-${pose.pose_number}`);
    if (slot && data.image_url) {
      slot.outerHTML = `<img class="pose-image" id="image-${pose.pose_number}" src="${data.image_url}" />`;
    }
  } catch {
    // Image failed silently — video may still arrive
  }
}

// Request a video — replaces image (or shimmer) when ready
async function requestVideo(pose) {
  try {
    const response = await fetch('http://localhost:8000/api/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: pose.veo_prompt }),
    });
    const data = await response.json();

    if (data.video_url) {
      // Replace shimmer or image — whichever is currently showing
      const slot = document.getElementById(`video-${pose.pose_number}`)
                || document.getElementById(`image-${pose.pose_number}`);
      if (slot) {
        slot.outerHTML = `<video class="pose-video" src="${data.video_url}" controls autoplay loop muted></video>`;
      }
    }
  } catch {
    // If video failed and no image shown yet, show fallback message
    const slot = document.getElementById(`video-${pose.pose_number}`);
    if (slot) {
      slot.outerHTML = `<div class="video-error">🧘 Video unavailable for this pose</div>`;
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
      <div class="video-placeholder" id="video-${pose.pose_number}">Video loading...</div>
      <p class="pose-instruction">${pose.instruction}</p>
      <div class="pose-footer">
        <span class="benefit">${pose.benefit}</span>
        <span class="duration">⏱ Hold ${pose.duration_seconds}s</span>
      </div>
    </div>
  `).join('');
}
