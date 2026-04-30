import { useState } from "react";
import { Link } from "react-router-dom";
import "./delusionalQuiz.css";
import type { Answer, Question, ResultData, Phase } from "./types";
import { getResult } from "./data";
import { useQuizQuestions } from "./useQuizQuestions";

// ─── SOUS-COMPOSANTS ──────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="dq-progress">
      <div className="dq-progress_fill" style={{ width: `${(current / total) * 100}%` }} />
      <span className="dq-progress_label">{current}/{total}</span>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="dq-card">
      <div className="dq-eyebrow">✦ delulu profiling ✦</div>
      <h1 className="dq-title">
        <span>How</span>
        <span className="dq-title__accent">Delusional</span>
        <span>Are You?</span>
      </h1>
      <p className="dq-intro-sub">
        10 questions. 4 profils differents.<br />
        Find out where you land on the spectrum from{" "}
        <em>well-adjusted human</em> to <em>certified ideological bunker-dweller</em>.
      </p>
      <div className="dq-disclaimer">⚠ Not a real diagnosis. Mostly.</div>
      <button className="dq-btn" onClick={onStart}>Debuter son diagnostic →</button>
    </div>
  );
}

function QuestionCard({ question, index, total, onAnswer }: {
  question: Question; index: number; total: number; onAnswer: (points: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [leaving, setLeaving] = useState(false);

  const handleSelect = (i: number): void => {
    setSelected(i);
  };

  const handleNext = (): void => {
    if (selected === null) return;
    setLeaving(true);
    setTimeout(() => onAnswer(question.answer[selected].points), 300);
  };

  return (
    <div className={`dq-card${leaving ? " dq-card--exit" : ""}`}>
      <ProgressBar current={index + 1} total={total} />
      <div className="dq-qnum">Q{index + 1}</div>
      <p className="dq-question">{question.text}</p>
      <div className="dq-answers">
        {question.answer.map((ans: Answer, i: number) => (
          <button
            key={i}
            className={["dq-answer", selected === i ? "dq-answer--selected" : "", selected !== null && selected !== i ? "dq-answer--dimmed" : ""].filter(Boolean).join(" ")}
            onClick={() => handleSelect(i)}
          >
            <span className="dq-answer__letter">{String.fromCharCode(65 + i)}</span>
            <span>{ans.text}</span>
          </button>
        ))}
      </div>
      <button
        className={`dq-btn${selected === null ? " dq-btn--disabled" : ""}`}
        onClick={handleNext}
        disabled={selected === null}
      >
        {index + 1 === total ? "Voir mon diag →" : "la suite →"}
      </button>
    </div>
  );
}

function Result({ totalPoints, onRestart }: { totalPoints: number; onRestart: () => void }) {
  const result: ResultData = getResult(totalPoints);
  const pct = Math.round((totalPoints / 300) * 100);

  return (
    <div className="dq-card">
    <div className="dq-result-header">
      <div className="dq-result-tag">{result.tag}</div>
      <h2 className="dq-result-title" style={{ color: result.color }}>{result.label}</h2>
      <div className="dq-result-score">{totalPoints} / 300 pts</div>
    </div>
      <p className="dq-result-desc">{result.description}</p>
      <div className="dq-bar-wrap">
        <div className="dq-bar-track">
          <div className="dq-bar-fill" style={{ width: `${pct}%`, background: result.color }} />
        </div>
        <div className="dq-bar-labels"><span>Sane</span><span>Delulu</span></div>
      </div>
      <button className="dq-btn dq-btn--ghost" onClick={onRestart}>↺ Recommencer le test</button>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function DelusionalQuiz() {
  const { questions, loading } = useQuizQuestions();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const handleStart = () => { setCurrentQ(0); setTotalPoints(0); setPhase("quiz"); };

  const handleAnswer = (pts: number) => {
    const newTotal = totalPoints + pts;
    if (currentQ + 1 >= questions.length) {
      setTotalPoints(newTotal); setPhase("result");
    } else {
      setTotalPoints(newTotal); setCurrentQ((q) => q + 1);
    }
  };

  return (
    <div className="dq-root">
      <div className="dq-noise" />
      <div className="dq-grid" />
      <header className="dq-page-header">
        <Link className="dq-home-link" to="/">../home/</Link>
      </header>
      <main className="dq-content">
        {phase === "intro" && <Intro onStart={handleStart} />}
        {phase === "quiz" && loading && (
          <div className="dq-card dq-loading"><div className="dq-spinner" /><p>Loading...</p></div>
        )}
        {phase === "quiz" && !loading && questions.length > 0 && (
          <QuestionCard key={currentQ} question={questions[currentQ]} index={currentQ} total={questions.length} onAnswer={handleAnswer} />
        )}
        {phase === "result" && (
          <Result totalPoints={totalPoints} onRestart={() => setPhase("intro")} />
        )}
      </main>
    </div>
  );
}