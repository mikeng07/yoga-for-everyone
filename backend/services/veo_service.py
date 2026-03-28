import os
import time
import base64
import requests
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def _run_veo(prompt: str) -> str:
    operation = client.models.generate_videos(
        model="veo-3.1-fast-generate-preview",
        prompt=prompt,
        config=types.GenerateVideosConfig(
            number_of_videos=1,
        ),
    )
    while not operation.done:
        print("Veo still generating... waiting 5s")
        time.sleep(5)
        operation = client.operations.get(operation)

    videos = operation.response.generated_videos
    if not videos:
        raise Exception("Veo returned no videos")

    uri = videos[0].video.uri
    api_key = os.getenv("GOOGLE_API_KEY")
    video_bytes = requests.get(f"{uri}&key={api_key}").content
    encoded = base64.b64encode(video_bytes).decode("utf-8")
    return f"data:video/mp4;base64,{encoded}"


def generate_yoga_video(prompt: str, duration_seconds: int = 5) -> str:
    print(f"Starting Veo generation for: {prompt[:60]}...")
    try:
        return _run_veo(prompt)
    except Exception as e:
        print(f"Veo attempt 1 failed: {e} — retrying...")
        return _run_veo(prompt)  # retry once
