import os
import time
import base64
import requests
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_yoga_video(prompt: str, duration_seconds: int = 5) -> str:
    print(f"Starting Veo generation for: {prompt[:60]}...")

    # Kick off the video generation (async operation)
    operation = client.models.generate_videos(
        model="veo-3.1-fast-generate-preview",
        prompt=prompt,
        config=types.GenerateVideosConfig(
            number_of_videos=1,
        ),
    )

    # Poll until Veo finishes
    while not operation.done:
        print("Veo still generating... waiting 5s")
        time.sleep(5)
        operation = client.operations.get(operation)

    print("Veo done!")

    # Get the video URI
    video = operation.response.generated_videos[0]
    uri = video.video.uri

    # Download the video and encode as base64 so the frontend can play it
    api_key = os.getenv("GOOGLE_API_KEY")
    video_bytes = requests.get(f"{uri}&key={api_key}").content
    encoded = base64.b64encode(video_bytes).decode("utf-8")
    return f"data:video/mp4;base64,{encoded}"
