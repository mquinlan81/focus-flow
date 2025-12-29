import os
import json
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
from database import SessionLocal, init_db, TaskEntry

# Initialize the database on startup
init_db()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. Load Environment Variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

# 2. Enable CORS so your React app can talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskRequest(BaseModel):
    task: str
    profile: dict

@app.post("/analyze")
async def analyze_task(request: TaskRequest):
    db = SessionLocal()
    
    # 1. CREATE INITIAL RECORD (The "Safety Save")
    # We save this immediately so it exists in your DB even if Google fails.
    new_task = TaskEntry(
        content=request.task,
        theater="Personal",  # Default starting theater
        priority="Standard", # Default starting priority
        analysis="Neural Link pending...", 
        score=0.5
    )
    
    try:
        db.add(new_task)
        db.commit()
        db.refresh(new_task) # This gets us the 'id' assigned by SQLite

        # 2. CALL THE AI
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = f"""
        Analyze this task: "{request.task}" for a {request.profile.get('profession')}.
        Assign one of these three 'Theaters':

        1. 'Professional': Tasks related to property management, tenants, or business growth.
        2. 'Domestic': Tasks related to the physical household, chores, groceries, or home maintenance (e.g., "Mow lawn", "Buy milk").
        3. 'Personal': Tasks related to self-care, hobbies, fitness, or social life (e.g., "Go for a run", "Call mom").

        Return ONLY a JSON object: 
        {{"theater": "Professional/Domestic/Personal", "priority": "High/Standard", "analysis": "max 15 words", "score": 0.5}}
        """

        response = model.generate_content(prompt)
        
        # 3. CLEAN & PARSE
        cleaned_json = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(cleaned_json)

        # 4. UPDATE THE EXISTING RECORD
        # Now we fill in the blanks with the AI's wisdom
        new_task.theater = data.get("theater", "Personal")
        new_task.priority = data.get("priority", "Standard")
        new_task.analysis = data.get("analysis", "Analysis complete.")
        new_task.score = data.get("score", 0.5)
        
        db.commit()
        db.refresh(new_task)
        
        return data

    except Exception as e:
        print(f"Neural Error: {e}")
        # If AI fails (like 429), we update the record to show the error
        new_task.analysis = f"Neural Offline: {str(e)[:20]}..."
        db.commit()
        
        # We still return a "safe" version to React so the UI doesn't crash
        return {
            "theater": new_task.theater,
            "priority": new_task.priority,
            "analysis": new_task.analysis,
            "score": new_task.score
        }
    finally:
        db.close()

@app.get("/tasks")
async def get_tasks():
    db = SessionLocal()
    # Get the 50 most recent tasks
    tasks = db.query(TaskEntry).order_by(TaskEntry.created_at.desc()).limit(50).all()
    db.close()
    return tasks

# 1. Define the data shape for the move request
class MoveRequest(BaseModel):
    task_id: int
    new_theater: str

# 2. Create the PATCH route (PATCH is used for partial updates)
@app.patch("/tasks/move")
async def move_task(request: MoveRequest):
    db = SessionLocal()
    try:
        # Find the task by its ID
        task = db.query(TaskEntry).filter(TaskEntry.id == request.task_id).first()
        
        if not task:
            return {"status": "error", "message": "Task not found"}
        
        # Update the theater and clear the "Offline" analysis message
        task.theater = request.new_theater
        task.analysis = f"Manually moved to {request.new_theater}"
        
        db.commit()
        return {"status": "success", "new_theater": task.theater}
    except Exception as e:
        print(f"Move Error: {e}")
        return {"status": "error", "message": str(e)}
    finally:
        db.close()

# DELETE: Removes the task from the database entirely
@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    db = SessionLocal()
    try:
        task = db.query(TaskEntry).filter(TaskEntry.id == task_id).first()
        if task:
            db.delete(task)
            db.commit()
            return {"status": "success"}
        return {"status": "error", "message": "Task not found"}
    finally:
        db.close()

# COMPLETE: Marks the task as done (we'll update the analysis text for now)
@app.patch("/tasks/{task_id}/complete")
async def complete_task(task_id: int):
    db = SessionLocal()
    try:
        task = db.query(TaskEntry).filter(TaskEntry.id == task_id).first()
        if task:
            task.analysis = "✓ Objective Secured"
            db.commit()
            return {"status": "success"}
    finally:
        db.close()