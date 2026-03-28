import os
import base64
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_pose_image(prompt: str) -> str:
    character = "a fit woman in her early 30s, shoulder-length brown hair, wearing a teal fitted top and black yoga leggings, on a purple mat, white studio background, soft natural lighting from the left"

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=f"Generate a photorealistic image of {character}, demonstrating this yoga pose: {prompt}",
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    # Extract image bytes from response
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            image_bytes = part.inline_data.data
            encoded = base64.b64encode(image_bytes).decode("utf-8")
            return f"data:image/png;base64,{encoded}"

    raise Exception("No image returned from Imagen")
