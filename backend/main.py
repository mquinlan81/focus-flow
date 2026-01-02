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
import datetime
from datetime import date, timedelta

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
    username: str

@app.post("/analyze")
async def analyze_task(request: TaskRequest):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == request.username).first()
        # Use the date class we imported earlier
        today_date = date.today()

        prompt = f"""
        Analyze this task: "{request.task}"
        Current Date: {today_date}
        User Profession: {user.profession}

        Return ONLY a JSON object:
        {{
          "clean_task": "the task without time words",
          "scheduled_date": "YYYY-MM-DD",
          "theater": "professional/domestic/personal",
          "priority": "high/medium/low",
          "analysis": "short insight",
          "score": 0.7
        }}
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        # 1. Clean the response text (sometimes AI adds ```json)
        raw_text = response.text.strip().replace('```json', '').replace('```', '')
        data = json.loads(raw_text)

        # 2. FIX: If data is a list, take the first item
        if isinstance(data, list):
            data = data[0]

        # 3. Parse the date safely
        task_date_str = data.get("scheduled_date")
        try:
            # If AI fails, use today
            final_date = date.fromisoformat(task_date_str) if task_date_str else today_date
        except:
            final_date = today_date

        new_task = TaskEntry(
            user_id=user.id,
            content=data.get("clean_task", request.task),
            theater=data.get("theater", "personal"),
            priority=data.get("priority", "medium"),
            analysis=data.get("analysis", "No analysis available"),
            score=data.get("score", 0.5),
            scheduled_date=final_date, # This is the "Secure" date
            status="pending"
        )

        db.add(new_task)
        db.commit()
        return {"status": "success"}

    except Exception as e:
        print(f"Neural Link Error: {e}")
        return {"status": "error", "message": str(e)}
    finally:
        db.close()

@app.get("/tasks/{username}")
async def get_tasks(username: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return []
        
        # Get ALL tasks for this user so React can sort them into boxes
        tasks = db.query(TaskEntry).filter(TaskEntry.user_id == user.id).all()
        return tasks
    finally:
        db.close()

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
            task.status = "complete"  # <--- MAKE SURE THIS LINE EXISTS
            task.analysis = "✓ Objective Secured"
            db.commit()
            return {"status": "success"}
    finally:
        db.close()

import json

@app.patch("/tasks/{task_id}/migrate")
async def migrate_task(task_id: int, request: dict):
    db = SessionLocal()
    try:
        task = db.query(TaskEntry).filter(TaskEntry.id == task_id).first()
        if task:
            task.scheduled_date = date.fromisoformat(request.get("scheduled_date"))
            task.status = "pending" # Ensure it stays active
            db.commit()
            return {"status": "success"}
    finally:
        db.close()

@app.patch("/tasks/{task_id}/reactivate")
async def reactivate_task(task_id: int):
    db = SessionLocal()
    try:
        task = db.query(TaskEntry).filter(TaskEntry.id == task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
            
        task.status = "pending"
        task.analysis = "Neural Link Restored: Objective back in active feed."
        
        db.commit()
        return {"status": "success"}
    except Exception as e:
        print(f"Reactivate Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

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