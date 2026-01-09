import GenerateQuiz from "./GenerateQuiz";

function App() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>DeepKlarity Wiki Quiz Generator</h1>
        <p style={styles.subtitle}>
          Paste a Wikipedia article link and instantly generate smart quiz
          questions 📚
        </p>

        <GenerateQuiz />

        <footer style={styles.footer}>
          © {new Date().getFullYear()} DeepKlarity • Built with React & FastAPI
        </footer>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "40px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "900px",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#2c3e50",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#555",
    fontSize: "16px",
  },
  footer: {
    marginTop: "40px",
    textAlign: "center",
    fontSize: "13px",
    color: "#888",
  },
};

export default App;
