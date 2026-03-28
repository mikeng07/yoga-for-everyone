# YogaRx backend — routes added as we build
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.gemini_service import analyze_doctor_note
from services.veo_service import generate_yoga_video
from services.imagen_service import generate_pose_image

app = FastAPI()

# Allow the frontend (opened as a local file) to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "null"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/analyze-note")
async def analyze_note(file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    plan = analyze_doctor_note(pdf_bytes)
    return plan


class VideoRequest(BaseModel):
    prompt: str
    duration_seconds: int = 5


@app.post("/api/generate-image")
def generate_image(req: VideoRequest):
    try:
        image_url = generate_pose_image(req.prompt)
        return {"image_url": image_url}
    except Exception as e:
        print(f"Image generation failed: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/generate-video")
def generate_video(req: VideoRequest):
    try:
        video_uri = generate_yoga_video(req.prompt, req.duration_seconds)
        return {"video_url": video_uri}
    except Exception as e:
        print(f"Video generation failed: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})
