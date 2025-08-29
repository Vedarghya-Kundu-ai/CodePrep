from fastapi import FastAPI, Depends
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import SessionLocal, QuestionDB

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schemas
class QuestionCreate(BaseModel):   # ✅ input schema
    user: str
    question: str

class QuestionResponse(BaseModel):  # ✅ output schema
    id: int
    user: str
    question: str

    class Config:
        from_attributes = True


@app.post("/add_question", response_model=QuestionResponse)
def add_question(question: QuestionCreate, db: Session = Depends(get_db)):
    db_question = QuestionDB(user=question.user, question=question.question)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


@app.get("/questions/{user}", response_model=List[QuestionResponse])
def get_questions(user: str, db: Session = Depends(get_db)):
    return db.query(QuestionDB).filter(QuestionDB.user == user).all()


@app.delete("/questions/{user}/{id}")
def delete_question(user: str, id: int, db: Session = Depends(get_db)):
    db_question = db.query(QuestionDB).filter(
        QuestionDB.user == user, QuestionDB.id == id
    ).first()
    if db_question:
        db.delete(db_question)
        db.commit()
        return {"success": True}
    else:
        return {"success": False}
