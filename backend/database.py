from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime

DATABASE_URL = "sqlite:///./focusflow.db"
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    profession = Column(String)
    legacy_knowledge = Column(String, default="[]") 
    theme_preference = Column(String, default="system")
    
    # This helps SQLAlchemy find all tasks belonging to this user easily
    tasks = relationship("TaskEntry", back_populates="owner")

class TaskEntry(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    theater = Column(String)
    priority = Column(String)
    analysis = Column(String)
    score = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # THE LINK:
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="tasks")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)