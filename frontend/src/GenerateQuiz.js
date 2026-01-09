import { useState } from "react";

function GenerateQuiz() {
  const [url, setUrl] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [dark, setDark] = useState(false);

  const theme = dark ? darkTheme : lightTheme;

  const generateQuiz = async () => {
    if (!url) {
      setError("Please paste a Wikipedia URL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setData(null);
      setAnswers({});
      setSubmitted(false);

      const response = await fetch(
        `http://127.0.0.1:8000/generate?url=${encodeURIComponent(
          url
        )}&count=5&difficulty=${difficulty}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error();

      const result = await response.json();
      setData(result);
    } catch {
      setError("Backend not reachable. Make sure it runs on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const selectOption = (qIndex, option) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: option });
  };

  const submitQuiz = () => setSubmitted(true);

  const score =
    data?.quiz.filter(
      (q, i) => answers[i] && answers[i] === q.answer
    ).length || 0;

  return (
    <div style={{ ...styles.page, background: theme.bg, color: theme.text }}>
      {/* Header */}
      <div style={styles.header}>
        <h1>DeepKlarity Wiki Quiz</h1>
        <button
          onClick={() => setDark(!dark)}
          style={{ ...styles.toggle, background: theme.card, color: theme.text }}
        >
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <input
          placeholder="Paste Wikipedia URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ ...styles.input, background: theme.card, color: theme.text }}
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ ...styles.select, background: theme.card, color: theme.text }}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button onClick={generateQuiz} style={styles.button}>
          Generate Quiz
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p style={styles.loading}>Generating quiz…</p>}

      {/* Quiz */}
      {data && (
        <>
          <h2>{data.title}</h2>
          <p style={styles.summary}>{data.summary}</p>

          {data.quiz.map((q, i) => (
            <div
              key={i}
              style={{ ...styles.card, background: theme.card }}
            >
              <h4>
                Q{i + 1}. {q.question}
              </h4>

              <ul style={styles.options}>
                {q.options.map((opt, j) => {
                  const selected = answers[i] === opt;
                  const correct = submitted && opt === q.answer;
                  const wrong =
                    submitted && selected && opt !== q.answer;

                  return (
                    <li
                      key={j}
                      onClick={() => selectOption(i, opt)}
                      style={{
                        ...styles.option,
                        background: selected
                          ? theme.selected
                          : theme.card,
                        borderColor: correct
                          ? "#22c55e"
                          : wrong
                          ? "#ef4444"
                          : theme.border,
                      }}
                    >
                      {opt}
                    </li>
                  );
                })}
              </ul>

              {submitted && (
                <p style={styles.answer}>
                  ✅ Correct answer: {q.answer}
                </p>
              )}
            </div>
          ))}

          {!submitted && (
            <button onClick={submitQuiz} style={styles.submit}>
              Submit Quiz
            </button>
          )}

          {submitted && (
            <div style={styles.result}>
              🎯 Score: <b>{score}</b> / {data.quiz.length}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* THEMES */
const lightTheme = {
  bg: "#f4f6f8",
  card: "#ffffff",
  text: "#1f2937",
  border: "#d1d5db",
  selected: "#dbeafe",
};

const darkTheme = {
  bg: "#0f172a",
  card: "#1e293b",
  text: "#f8fafc",
  border: "#334155",
  selected: "#1d4ed8",
};

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    padding: "25px",
    transition: "0.3s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  toggle: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
  },
  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
  },
  button: {
    padding: "12px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  card: {
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid",
    transition: "0.3s",
  },
  options: {
    listStyle: "none",
    padding: 0,
  },
  option: {
    padding: "10px",
    borderRadius: "6px",
    border: "2px solid",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "0.2s",
  },
  submit: {
    padding: "14px 20px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
  result: {
    marginTop: "25px",
    padding: "15px",
    background: "#0ea5e9",
    color: "#fff",
    borderRadius: "10px",
    fontSize: "18px",
    textAlign: "center",
  },
  summary: {
    marginBottom: "25px",
  },
  answer: {
    color: "#22c55e",
    fontWeight: "bold",
  },
  loading: {
    color: "#94a3b8",
  },
  error: {
    color: "#ef4444",
  },
};

export default GenerateQuiz;
