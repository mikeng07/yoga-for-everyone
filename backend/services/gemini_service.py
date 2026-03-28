import os
import json
import tempfile
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

PROMPT = """
You are a certified yoga therapist and physiotherapy assistant.
A patient has uploaded their doctor's note. Analyze it carefully and:

1. Extract the primary back/spine diagnosis
2. Identify any contraindications or movements to avoid
3. Generate a safe, personalized yoga sequence of 4-6 poses

Rules:
- Only recommend poses safe for the specific diagnosis
- Explicitly avoid poses that could worsen the condition
- Keep instructions clear and accessible for beginners
- For each pose, write a "veo_prompt": a detailed visual description of a yoga instructor demonstrating the pose, suitable for AI video generation. Include camera angle, lighting, and specific body positioning.
- Every veo_prompt MUST feature the same instructor: a fit woman in her early 30s, shoulder-length brown hair, wearing a teal fitted top and black yoga leggings, on a purple mat, white studio background, soft natural lighting from the left.
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
"""

def analyze_doctor_note(pdf_bytes: bytes) -> dict:
    # Write bytes to a temp file — Gemini File API requires a file path
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(pdf_bytes)
        tmp_path = tmp.name

    # Upload the temp file to Gemini File API
    uploaded_file = client.files.upload(
        file=tmp_path,
        config={"mime_type": "application/pdf"},
    )
    os.unlink(tmp_path)  # clean up temp file

    # Ask Gemini to generate a structured yoga plan
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[uploaded_file, PROMPT],
    )

    # Strip markdown code fences if Gemini wraps the JSON in ```json ... ```
    text = response.text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(text)
