import random

QUESTION_TEMPLATES = [
    "Which of the following statements is mentioned in the article?",
    "According to the article, which statement is correct?",
    "Which fact is stated in the article?",
    "What does the article mention about this topic?",
    "Which statement accurately reflects the article content?"
]

def generate_quiz(text, count=5):
    # Split into meaningful sentences
    sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 50]

    if len(sentences) < count:
        count = len(sentences)

    random.shuffle(sentences)

    quiz = []

    for i in range(count):
        correct = sentences[i]

        # Pick wrong options
        distractors = random.sample(
            [s for s in sentences if s != correct],
            min(3, len(sentences) - 1)
        )

        options = distractors + [correct]
        random.shuffle(options)

        question_text = random.choice(QUESTION_TEMPLATES)

        quiz.append({
            "question": question_text,
            "options": options,
            "answer": correct,
            "difficulty": random.choice(["easy", "medium", "hard"]),
            "explanation": "This statement is directly mentioned in the article."
        })

    return {
        "quiz": quiz,
        "related_topics": [
            "Computer Science",
            "Artificial Intelligence",
            "Cryptography",
            "History of Computing",
            "Algorithms"
        ]
    }
