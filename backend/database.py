from sqlalchemy import create_all, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

# This creates the 'focusflow.db' file automatically!
DATABASE_URL = "sqlite:///./focusflow.db"

Base = declarative_base()

class TaskEntry(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    category = Column(String)  # "Work", "Home", "Personal"
    location_context = Column(String)  # "Office", "Remote", "Gym"
    priority_level = Column(Integer)  # 1-4 (The Matrix Quadrant)
    score = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Database Engine setup
from sqlalchemy import create_engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)