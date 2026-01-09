from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

from .database import SessionLocal, engine
from .models import Base, WikiQuiz
from .scraper import scrape_wikipedia
from .llm import generate_quiz

# ✅ CREATE APP FIRST (IMPORTANT)
app = FastAPI(title="DeepKlarity Wiki Quiz API")

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ DB INIT
Base.metadata.create_all(bind=engine)

# ✅ DB DEPENDENCY
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ ROOT CHECK
@app.get("/")
def root():
    return {"message": "DeepKlarity Wiki Quiz API is running"}

# ✅ GENERATE QUIZ
@app.post("/generate")
def generate(
    url: str,
    count: int = 5,
    db: Session = Depends(get_db)
):
    try:
        data = scrape_wikipedia(url)
        quiz_data = generate_quiz(data["content"], count)

        quiz = WikiQuiz(
            url=url,
            title=data["title"],
            summary=data["content"][:300],
            quiz=json.dumps(quiz_data["quiz"]),
            related_topics=json.dumps(quiz_data["related_topics"])
        )

        db.add(quiz)
        db.commit()
        db.refresh(quiz)

        return {
            "id": quiz.id,
            "url": quiz.url,
            "title": quiz.title,
            "summary": quiz.summary,
            "quiz": quiz_data["quiz"],
            "related_topics": quiz_data["related_topics"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ HISTORY
@app.get("/history")
def history(db: Session = Depends(get_db)):
    quizzes = db.query(WikiQuiz).all()
    return [
        {
            "id": q.id,
            "url": q.url,
            "title": q.title,
            "summary": q.summary
        }
        for q in quizzes
    ]
