import os
import json
import tempfile
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

PROMPT = """
You are a certified yoga therapist and physiotherapy assistant.
A patient has shared their profile and may have uploaded their doctor's note. Analyze carefully and:

1. Extract the primary diagnosis — this may involve the back, spine, neck, or a combination
2. Identify any contraindications or movements to avoid
3. Generate a safe, personalized yoga sequence of 4-6 poses that targets the affected areas

Rules:
- If the diagnosis or patient description mentions neck issues, include neck-specific poses
- If both back and neck are affected, include poses that address both areas
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

def build_prompt(context: dict) -> str:
    patient_info = f"""
Patient profile:
- Gender: {context.get('gender') or 'not specified'}
- Age: {context.get('age') or 'not specified'}
- Height: {context.get('height_ft') or 'not specified'} ft
- Weight: {context.get('weight_lbs') or 'not specified'} lbs
- Current pain level: {context.get('pain_level', '5')}/10
- How they feel: {context.get('description') or 'not provided'}

Use this profile to personalise the yoga sequence — adjust intensity and pose difficulty based on pain level (higher pain = gentler poses, shorter holds).
"""
    return patient_info + PROMPT


def analyze_doctor_note(pdf_bytes: bytes | None, context: dict = {}) -> dict:
    prompt = build_prompt(context)

    if pdf_bytes:
        # Upload PDF and pass it alongside the prompt
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp.write(pdf_bytes)
            tmp_path = tmp.name
        uploaded_file = client.files.upload(
            file=tmp_path,
            config={"mime_type": "application/pdf"},
        )
        os.unlink(tmp_path)
        contents = [uploaded_file, prompt]
    else:
        # No PDF — work from patient profile only
        contents = [prompt]

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=contents,
    )

    text = response.text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(text)
