import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getRandomQuestions } from './questions';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ArrowRight, Brain, Clock, AlertCircle, Lightbulb, X } from 'lucide-react';
import './App.css';

// --- CONFIGURATION ---
const SHOW_ML_FEATURES = false; // Set to false to hide ML profile and show only score

// --- SHARED LAYOUT ---
const Layout = ({ children, userName }) => (
  <div className="app-container">
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <BookOpen size={24} color="white" />
        <h1>University of Westminster | Research Portal</h1>
      </div>
      {userName && <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>Student: {userName}</div>}
    </header>
    <main className="content">
      <AnimatePresence mode='wait'>
        {children}
      </AnimatePresence>
    </main>
  </div>
);

// --- HINT SIDEBAR COMPONENT ---
const HintSidebar = ({ isOpen, onClose, hint }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`hint-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="hint-header">
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lightbulb color="var(--secondary)" size={24} /> Hint
          </h3>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        <div className="hint-content">
          {hint}
        </div>
        <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: '#64748b' }}>
          Note: Using hints contributes to your learning profile analysis.
        </div>
      </div>
    </>
  );
};

// --- PAGE 1: HOME ---
const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleStart = () => {
    if (!name.trim()) {
      alert("Please enter your name to continue.");
      return;
    }
    navigate('/exam', { state: { name } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggeredChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      <motion.div
        className="home-view"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
      >
        <motion.div className="card-glass hero-card" variants={itemVariants}>
          <div className="hero-icon-container">
            <Brain size={48} color="var(--primary)" />
          </div>
          <h2 className="hero-title">Adaptive Scaffolding in Compute Education</h2>
          <h3 className="hero-subtitle">University of Westminster Research Study</h3>

          <p className="hero-description">
            Welcome to this interactive assessment designed to analyze student learning patterns
            and the effectiveness of AI-driven scaffolding in foundational computing mathematics.
          </p>

          <div className="info-grid">
            <div className="info-item">
              <CheckCircle className="info-icon" size={20} />
              <div>
                <strong>Participation</strong>
                <span>Anonymous & Voluntary</span>
              </div>
            </div>
            <div className="info-item">
              <Clock className="info-icon" size={20} />
              <div>
                <strong>Duration</strong>
                <span>5 - 10 Minutes</span>
              </div>
            </div>
            <div className="info-item">
              <Lightbulb className="info-icon" size={20} />
              <div>
                <strong>Adaptive Hints</strong>
                <span>Available on demand</span>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Participant Name / ID</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button className="btn-primary btn-large" onClick={handleStart}>
            Begin Assessment <ArrowRight size={20} />
          </button>
        </motion.div>

        <motion.div className="consent-text" variants={itemVariants}>
          <AlertCircle size={14} style={{ marginRight: '5px' }} />
          By proceeding, you consent to the anonymous collection of interaction data (clicks, timing, hint usage) for research analysis.
        </motion.div>
      </motion.div>
    </Layout>
  );
};

// --- PAGE 2: EXAM ---
const Exam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const studentName = location.state?.name || "Anonymous";

  const [questions, setQuestions] = useState([]); // This will be the full list
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Current Question State
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(3);
  const [markedForReview, setMarkedForReview] = useState(false);
  const [showHintSidebar, setShowHintSidebar] = useState(false);

  // Analytics
  const [analyticsLog, setAnalyticsLog] = useState([]);
  const [hintsViewed, setHintsViewed] = useState(new Set()); // Track unique questions where hint was used
  const [isSubmitting, setIsSubmitting] = useState(false); // New loading state

  const startTimeRef = useRef(Date.now());
  const firstClickRef = useRef(null);
  const tabSwitchesRef = useRef(0);
  const answerChangesRef = useRef(0);
  const totalClicksRef = useRef(0);

  useEffect(() => {
    setQuestions(getRandomQuestions(10));
  }, []);

  useEffect(() => {
    const handleBlur = () => { tabSwitchesRef.current += 1; };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      startTimeRef.current = Date.now();
      firstClickRef.current = null;
      answerChangesRef.current = 0;
      totalClicksRef.current = 0;
      setSelectedOption(null);
      setMarkedForReview(false);
      setConfidence(3);
      setShowHintSidebar(false);
    }
  }, [currentQIndex, questions]);

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

  const openHint = () => {
    setShowHintSidebar(true);
    const currentQ = questions[currentQIndex];
    setHintsViewed(prev => new Set(prev).add(currentQ.id));
  };

  const handleNext = async () => {
    if (!selectedOption) return alert("Please select an answer.");

    const currentQ = questions[currentQIndex];
    const timeSpent = (Date.now() - startTimeRef.current) / 1000;

    const questionData = {
      question_id: currentQ.id,
      topic: currentQ.topic,
      difficulty: currentQ.difficulty,
      selected_answer: selectedOption,
      is_correct: selectedOption === currentQ.correctAnswer ? 1 : 0,
      response_time: timeSpent,
      tab_switches: tabSwitchesRef.current,
      answer_changes: answerChangesRef.current,
      total_clicks: totalClicksRef.current,
      first_click_latency: firstClickRef.current || timeSpent,
      review_flag: markedForReview ? 1 : 0,
      confidence_score: parseInt(confidence)
    };

    const newLog = [...analyticsLog, questionData];
    setAnalyticsLog(newLog);
    tabSwitchesRef.current = 0;

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      await submitData(newLog);
    }
  };

  const calculateFeatures = (log) => {
    const totalQ = log.length;

    // Helper sums
    const sum = (field) => log.reduce((acc, curr) => acc + curr[field], 0);
    const mean = (field) => parseFloat((sum(field) / totalQ).toFixed(2));

    // 9. Performance Trend (Last 5 accuracy - First 5 accuracy)
    const firstHalf = log.slice(0, 5);
    const secondHalf = log.slice(5, 10);
    const scoreFirst = firstHalf.reduce((acc, q) => acc + q.is_correct, 0);
    const scoreSecond = secondHalf.reduce((acc, q) => acc + q.is_correct, 0);
    const trend = scoreSecond - scoreFirst; // Positive means improvement

    // 10. Hard Question Accuracy (Difficulty > 1)
    const hardQuestions = log.filter(q => q.difficulty > 1);
    const hardCorrect = hardQuestions.reduce((acc, q) => acc + q.is_correct, 0);
    const hardAccuracy = hardQuestions.length > 0 ? parseFloat((hardCorrect / hardQuestions.length).toFixed(2)) : 0;

    return {
      final_score: sum('is_correct'),
      avg_time_per_question: mean('response_time'),
      avg_confidence: mean('confidence_score'),
      total_tab_switches: sum('tab_switches'),
      total_answer_changes: sum('answer_changes'),
      total_review_checks: sum('review_flag'),
      avg_first_action_latency: mean('first_click_latency'),
      total_clicks: sum('total_clicks'),
      performance_trend: trend,
      hard_question_accuracy: hardAccuracy,
      total_hints_used: hintsViewed.size // Feature 11
    };
  };

  const submitData = async (finalLog) => {
    setIsSubmitting(true);
    try {
      const features = calculateFeatures(finalLog);

      await addDoc(collection(db, "exam_submissions"), {
        student_name: studentName,
        timestamp: new Date(),
        ...features // Spread the 10 features flat
      });

      navigate('/results', { state: { features, name: studentName } });
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error submitting. Check console.");
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) return <Layout><div>Loading questions...</div></Layout>;

  // Loading Screen Override
  if (isSubmitting) {
    return (
      <Layout userName={studentName}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          color: 'var(--primary)'
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Brain size={64} />
          </motion.div>
          <h3 style={{ marginTop: '2rem' }}>Analyzing Performance...</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Calculating ML Data Profile</p>
        </div>
      </Layout>
    );
  }

  const q = questions[currentQIndex];

  return (
    <Layout userName={studentName}>
      <HintSidebar
        isOpen={showHintSidebar}
        onClose={() => setShowHintSidebar(false)}
        hint={q.hint || "No hint available for this question."}
      />
      <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
        <div className="progress-bar-container">
          <div
            className="progress-fill"
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
          <span>Question {currentQIndex + 1} of {questions.length}</span>
          <span>{q.topic} • Difficulty: {q.difficulty}</span>
        </div>
      </div>

      <motion.div
        key={currentQIndex}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="card-glass"
        onClick={handleContainerClick}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 className="question-text" style={{ flex: 1 }}>{q.question}</h3>
          <button className="hint-toggle-btn" onClick={openHint}>
            <Lightbulb size={18} /> Hint
          </button>
        </div>

        <div className="options-grid">
          {q.options.map(opt => (
            <button
              key={opt}
              className={`option-btn ${selectedOption === opt ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(opt)}
            >
              <div className="option-circle"></div>
              {opt}
            </button>
          ))}
        </div>

        <div className="controls-bar">
          <div className="confidence-selector">
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Confidence: {confidence}/5
            </label>
            <input
              type="range" min="1" max="5"
              className="confidence-slider"
              value={confidence} onChange={(e) => setConfidence(e.target.value)}
            />
          </div>

          <label className="review-label">
            <input
              type="checkbox"
              style={{ width: '16px', height: '16px' }}
              checked={markedForReview}
              onChange={(e) => setMarkedForReview(e.target.checked)}
            />
            Mark for Review
          </label>

          <button className="btn-primary" onClick={handleNext}>
            {currentQIndex === 9 ? "Submit" : "Next"}
          </button>
        </div>
      </motion.div>
    </Layout>
  );
};

// --- PAGE 3: RESULTS ---
const Results = () => {
  const { state } = useLocation();
  if (!state) return <Layout>No results found.</Layout>;

  const { features } = state;

  const featureExplanations = [
    { label: "Final Score", value: features.final_score + "/10", desc: "Total correct answers." },
    { label: "Avg. Time / Question", value: features.avg_time_per_question + "s", desc: "Average time spent before submitting." },
    { label: "Self-Reported Confidence", value: features.avg_confidence + "/5", desc: "Average confidence level selected." },
    { label: "Focus (Tab Switches)", value: features.total_tab_switches, desc: "Times the exam tab lost focus." },
    { label: "Answer Changes", value: features.total_answer_changes, desc: "Times you switched your selected answer." },
    { label: "Metacognition (Reviews)", value: features.total_review_checks, desc: "Questions marked for review." },
    { label: "Processing Speed", value: features.avg_first_action_latency + "s", desc: "Avg time before first interaction (click)." },
    { label: "Interaction Cost", value: features.total_clicks, desc: "Total clicks on the page." },
    { label: "Endurance (Trend)", value: features.performance_trend > 0 ? "+" + features.performance_trend : features.performance_trend, desc: "Score difference (Last 5 - First 5)." },
    { label: "Advanced Mastery", value: (features.hard_question_accuracy * 100) + "%", desc: "Accuracy on Hard/Medium questions." },
    { label: "Hints Used", value: features.total_hints_used, desc: "Total hints accessed during exam." }
  ];

  return (
    <Layout>
      <motion.div
        className="card-glass"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <CheckCircle size={64} color="var(--green, #22c55e)" style={{ marginBottom: '1rem' }} />
          <h1>Submission Complete</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Thank you, {state.name || "Student"}. {SHOW_ML_FEATURES ? "Here is your ML Feature Profile." : "Assessment recorded."}
          </p>
        </div>

        {/* CONDITIONALLY RENDER FEATURES */}
        {SHOW_ML_FEATURES ? (
          <>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Extracted Features (Input for ML Model)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
              {featureExplanations.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.5)', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)', margin: '0.2rem 0' }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', margin: '3rem 0' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>Score: {features.final_score} / 10</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Your performance data has been securely saved for analysis.</p>
          </div>
        )}

        <button
          className="btn-primary"
          style={{ marginTop: '2rem', width: '100%' }}
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </button>
      </motion.div>
    </Layout>
  );
};

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