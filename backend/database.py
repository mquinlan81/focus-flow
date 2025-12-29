from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

DATABASE_URL = "sqlite:///./focusflow.db"

Base = declarative_base()

class TaskEntry(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)           # The raw task text
    theater = Column(String)           # "Professional", "Domestic", "Personal"
    priority = Column(String)          # "High" or "Standard"
    analysis = Column(String)          # The 15-word AI assessment
    score = Column(Float)              # 0.0 to 1.0 urgency
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # This creates the focusflow.db file if it doesn't exist
    Base.metadata.create_all(bind=engine)