from sqlalchemy import Column, Integer, String, Text
from .database import Base

class WikiQuiz(Base):
    __tablename__ = "wiki_quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String)
    title = Column(String)
    summary = Column(Text)
    quiz = Column(Text)           # store as string
    related_topics = Column(Text) # store as string
