import os
import json
from fastapi import FastAPI
from fastapi import HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from dotenv import load_dotenv
from database import SessionLocal, init_db, TaskEntry, User

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
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

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
    try:
        # 1. Identify User Silo
        current_username = request.profile.get('username')
        user = db.query(User).filter(User.username == current_username).first()
        
        if not user:
            return {"error": "User context lost. Please re-authenticate."}

        # 2. Create Initial Task Entry
        new_task = TaskEntry(
            content=request.task,
            user_id=user.id,
            theater="Personal",
            priority="Standard",
            analysis="Neural Link pending...", 
            score=0.5
        )
        db.add(new_task)
        db.commit()
        db.refresh(new_task)

        # 3. Build Neural Context (Legacy History)
        legacy = request.profile.get('legacyProfessions', [])
        legacy_str = ", ".join(legacy) if legacy else "none"

        prompt = f"""
        User Profession: {user.profession}
        Neural History (Previous Experience): {legacy_str}
        
        Task to Analyze: "{request.task}"
        
        Return a JSON object with:
        - "theater": (Professional, Domestic, or Personal)
        - "priority": (High, Medium, or Low)
        - "analysis": (A 1-sentence neural assessment based on their profession)
        - "score": (A float 0.0-1.0)
        """

        # 4. Execute AI Analysis (New SDK Syntax)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        # 5. Parse and Update
        data = json.loads(response.text)
        new_task.theater = data.get("theater", "Personal")
        new_task.priority = data.get("priority", "Medium")
        new_task.analysis = data.get("analysis", "Neural analysis synchronized.")
        new_task.score = data.get("score", 0.5)

        db.commit()
        db.refresh(new_task)
        return new_task 

    except Exception as e:
        print(f"Neural Link Error: {e}")
        # Return a graceful fallback if AI or DB fails
        return {
            "theater": "Personal", 
            "priority": "Standard", 
            "analysis": "Neural Link intermittent. Manual classification required.", 
            "score": 0.5
        }
    finally:
        db.close()

@app.get("/tasks/{username}")
async def get_tasks(username: str):
    db = SessionLocal()
    # 1. Find the user ID based on the username string
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        db.close()
        return []

    # 2. Filter tasks so User A never sees User B's data
    tasks = db.query(TaskEntry).filter(TaskEntry.user_id == user.id).order_by(TaskEntry.created_at.desc()).limit(50).all()
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
        task = db.query(TaskEntry).filter(
        TaskEntry.id == task_id, 
        TaskEntry.user_id == user.id
    ).first()
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

import json

@app.post("/register")
async def register_user(request: dict):
    db = SessionLocal()
    try:
        # Check if username already exists one last time
        existing_user = db.query(User).filter(User.username == request.get("username")).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already linked to a Neural ID")

        # Create the new User record
        new_user = User(
            username=request.get("username"),
            hashed_password=request.get("password"), # Note: In production, hash this!
            profession=request.get("profession"),
            # We store the list as a JSON string in SQLite
            legacy_knowledge=json.dumps(request.get("legacyProfessions", [])),
            theme_preference="dark"
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {"status": "success", "message": "Neural Link Established"}
    except Exception as e:
        db.rollback()
        print(f"Registration Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to establish Neural Link")
    finally:
        db.close()

@app.post("/check-user")
async def check_user(request: dict):
    db = SessionLocal()
    username = request.get("username")
    user = db.query(User).filter(User.username == username).first()
    db.close()
    return {"exists": user is not None}

@app.post("/login")
async def login(request: dict):
    db = SessionLocal()
    user = db.query(User).filter(User.username == request.get("username")).first()
    db.close()
    
    if user and user.hashed_password == request.get("password"):
        # We parse the legacy_knowledge string back into a list for React
        import json
        legacy_list = json.loads(user.legacy_knowledge) if user.legacy_knowledge else []

        return {
            "status": "success", 
            "username": user.username,
            "email": user.username, # Or user.email if you added that column
            "profile": {
                "firstName": user.username, # Placeholder until you add actual name columns
                "lastName": "",
                "profession": user.profession,
                "legacyProfessions": legacy_list,
                "work_address": "",
                "home_address": "",
                "primary_theater": "Professional",
                "energy_peak": "Morning"
            }
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")