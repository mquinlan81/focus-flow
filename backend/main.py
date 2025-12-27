from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from textblob import TextBlob

app = FastAPI()

# This part is CITICAL. It allows your React app
# (on port 5173) to communicate with this FastAPI backend (on port 8000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "FocusFlow Neural Engine Online"}

@app.post("/analyze")
async def analyze_task(data: dict):
    task_text = data.get("task", "")
    profile = data.get("profile", {})
    profession = profile.get("profession", "").lower()
    
    blob = TextBlob(task_text)
    
    # Logic for "Clean the deck" ambiguity
    if "deck" in task_text.lower():
        if "property" in profession or "manager" in profession:
            category = "Work (Asset Management)"
            advice = "System identifies this as a professional maintenance objective."
        else:
            category = "Home (Maintenance)"
            advice = "System identifies this as a domestic maintenance objective."
    else:
        # Fallback to general sentiment
        category = "General"
        advice = "Standard processing."

    return {
        "analysis": f"[{category}] {advice}",
        "score": blob.sentiment.polarity
    }