import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_schedule(poses: list, level: str, pain_level: str) -> dict:
    pose_names = ", ".join([p["name"] for p in poses])

    prompt = f"""
You are a yoga therapist creating a 4-week progressive yoga schedule.

Patient's current pain level: {pain_level}/10
Progression level chosen: {level}
Yoga poses from their plan: {pose_names}

Create a 4-week schedule with 3 sessions per week (Monday, Wednesday, Friday).
Each session should be 15-20 minutes.

Progression rules:
- Gentle: week 1-2 same easy sets/reps, week 3-4 slightly increase holds
- Moderate: gradual increase each week in sets and hold duration
- Progressive: meaningful increase each week, introduce pose variations by week 3-4

For each pose in each session include: sets, reps (or hold duration in seconds).
Keep total session time to 15-20 mins.

Return ONLY valid JSON, no markdown:
{{
  "level": "{level}",
  "weeks": [
    {{
      "week": 1,
      "theme": "...",
      "sessions": [
        {{
          "day": "Monday",
          "total_minutes": 15,
          "poses": [
            {{
              "name": "...",
              "sets": 2,
              "reps": 10,
              "hold_seconds": 30,
              "note": "..."
            }}
          ]
        }}
      ]
    }}
  ]
}}
"""

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[prompt],
    )

    text = response.text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(text)
