import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getRandomQuestions } from './questions';
import './App.css'; // Standard CSS

// --- PAGE 1: HOME ---
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h1>University of Westminster - Research Project</h1>
      <div className="card">
        <h2>Adaptive Scaffolding in LMS</h2>
        <p>
          Thank you for participating in this research. The goal is to develop an AI
          system that can predict student performance and provide personalized help.
        </p>
        <p><strong>Your Role:</strong> Complete a 10-question mock exam on "Mathematics of Computing".</p>
        <p><strong>Data Collected:</strong> Your answers, response time, and interaction patterns (clicks, focus).</p>
        <p><em>All data is anonymous and used solely for training our ML model.</em></p>
        <button className="btn-primary" onClick={() => navigate('/exam')}>Start Exam</button>
      </div>
    </div>
  );
};

// --- PAGE 2: EXAM (THE CORE LOGIC) ---
const Exam = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Current Question State
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(3);
  const [markedForReview, setMarkedForReview] = useState(false);

  // Analytics State
  const [analyticsLog, setAnalyticsLog] = useState([]);
  const startTimeRef = useRef(Date.now());
  const firstClickRef = useRef(null);
  const tabSwitchesRef = useRef(0);
  const answerChangesRef = useRef(0);
  const totalClicksRef = useRef(0);

  // Load Questions on Mount
  useEffect(() => {
    setQuestions(getRandomQuestions(10));
  }, []);

  // Track Tab Switches (Blur)
  useEffect(() => {
    const handleBlur = () => { tabSwitchesRef.current += 1; };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  // Reset Analytics when Question Changes
  useEffect(() => {
    if (questions.length > 0) {
      startTimeRef.current = Date.now();
      firstClickRef.current = null;
      answerChangesRef.current = 0;
      totalClicksRef.current = 0; // Reset for this question
      setSelectedOption(null);
      setMarkedForReview(false);
      setConfidence(3);
    }
  }, [currentQIndex, questions]);

  // Handle Interactions
  const handleContainerClick = () => {
    totalClicksRef.current += 1;
    if (!firstClickRef.current) {
      firstClickRef.current = (Date.now() - startTimeRef.current) / 1000;
    }
  };

  const handleOptionSelect = (opt) => {
    if (selectedOption !== null && selectedOption !== opt) {
      answerChangesRef.current += 1;
    }
    setSelectedOption(opt);
  };

  const handleNext = async () => {
    if (!selectedOption) return alert("Please select an answer.");

    const currentQ = questions[currentQIndex];
    const timeSpent = (Date.now() - startTimeRef.current) / 1000;

    // --- CAPTURE THE 10 FEATURES ---
    const questionData = {
      // 1. Context
      question_id: currentQ.id,
      topic: currentQ.topic,
      difficulty: currentQ.difficulty,

      // 2. Performance
      selected_answer: selectedOption,
      is_correct: selectedOption === currentQ.correctAnswer ? 1 : 0,

      // 3. Behavioral / Temporal
      response_time: timeSpent, // Feature: Time
      tab_switches: tabSwitchesRef.current, // Feature: Focus
      answer_changes: answerChangesRef.current, // Feature: Uncertainty
      total_clicks: totalClicksRef.current, // Feature: Frustration
      first_click_latency: firstClickRef.current || timeSpent, // Feature: Processing Speed
      review_flag: markedForReview ? 1 : 0, // Feature: Metacognition
      confidence_score: parseInt(confidence) // Feature: Self-Assessment
    };

    const newLog = [...analyticsLog, questionData];
    setAnalyticsLog(newLog);

    // Reset global tab switches for next question to keep data clean per-question
    tabSwitchesRef.current = 0;

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Submit to Firebase
      await submitData(newLog);
    }
  };

  const submitData = async (finalLog) => {
    try {
      // Calculate final score
      const score = finalLog.filter(l => l.is_correct).length;

      // Save to Firestore
      await addDoc(collection(db, "exam_submissions"), {
        timestamp: new Date(),
        score: score,
        total_questions: 10,
        analytics: finalLog // This contains all 10 ML features for every question
      });

      // Pass results to next page
      navigate('/results', { state: { score, total: 10 } });
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error submitting. Check console.");
    }
  };

  if (questions.length === 0) return <div>Loading Exam...</div>;

  const q = questions[currentQIndex];

  return (
    <div className="exam-container" onClick={handleContainerClick}>
      <div className="progress-bar">Question {currentQIndex + 1} of 10</div>

      <div className="question-card">
        <h3>{q.question}</h3>
        <div className="options">
          {q.options.map(opt => (
            <label key={opt} className={`option-label ${selectedOption === opt ? 'selected' : ''}`}>
              <input
                type="radio"
                name="option"
                value={opt}
                checked={selectedOption === opt}
                onChange={() => handleOptionSelect(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className="controls">
        <div className="confidence-selector">
          <label>Confidence Level: </label>
          <input
            type="range" min="1" max="5"
            value={confidence} onChange={(e) => setConfidence(e.target.value)}
          />
          <span>{confidence}/5</span>
        </div>

        <label className="review-check">
          <input
            type="checkbox"
            checked={markedForReview}
            onChange={(e) => setMarkedForReview(e.target.checked)}
          />
          Mark for Review
        </label>

        <button className="btn-next" onClick={handleNext}>
          {currentQIndex === 9 ? "Submit Exam" : "Next Question"}
        </button>
      </div>
    </div>
  );
};

// --- PAGE 3: RESULTS ---
import { useLocation } from 'react-router-dom';

const Results = () => {
  const { state } = useLocation();
  return (
    <div className="container">
      <h1>Exam Completed</h1>
      <div className="card results-card">
        <h2>Your Score: {state.score} / {state.total}</h2>
        <p>Thank you! Your interaction data has been securely saved.</p>
        <p>This data will train the "Adaptive Scaffolding" engine to help future students.</p>
        <button onClick={() => window.location.href = '/'}>Back to Home</button>
      </div>
    </div>
  );
};

// --- MAIN APP ROUTER ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;