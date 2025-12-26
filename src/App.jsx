import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { getRandomQuestions } from './questions';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ArrowRight, Brain, Clock, AlertCircle, Lightbulb, X } from 'lucide-react';
import './App.css';

// --- CONFIGURATION ---
// --- CONFIGURATION ---
// SHOW_ML_FEATURES is now dynamic state in App component

// --- SHARED LAYOUT ---
const Layout = ({ children, userName }) => (
  <div className="app-container">
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'var(--primary)',
          padding: '6px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <BookOpen size={20} color="white" />
        </div>
        <h1 style={{ lineHeight: 1.2 }}>
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>University of Westminster</span>
          Research Study
        </h1>
      </div>
      {userName && (
        <div style={{
          background: 'var(--bg-color)',
          padding: '0.4rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{userName}</span>
        </div>
      )}
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
            This assessment covers <strong>Foundational Mathematics for Computing</strong>. Your response data will support the development of a machine learning model for learning level classification, contributing to research in adaptive educational scaffolding.
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
                <strong>Static Hints</strong>
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

        <motion.div variants={itemVariants} className="consent-text">
          <p>By clicking start, you consent to your interaction data being anonymously recorded for research purposes.</p>
        </motion.div>

        <motion.div variants={itemVariants} style={{ marginTop: '1rem', textAlign: 'center' }}>
          <span
            onClick={() => navigate('/admin')}
            style={{ fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Researcher Access
          </span>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

// --- PAGE: ADMIN EXPORT ---
const AdminPanel = ({ showFeatures, setShowFeatures }) => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // Pre-calculated SHA-256 hash 
  const TARGET_HASH = "c2a73ff57426f8144bd6dd624d19026ec1020713737fd838558991b0dbab9850";

  const handleLogin = async (e) => {
    e.preventDefault();

    // Hash the input password using Web Crypto API
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === TARGET_HASH) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect Access Code");
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "exam_submissions"));
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      if (data.length === 0) {
        alert("No data to export.");
        setLoading(false);
        return;
      }

      // 1. Get headers (keys from first object, sorted preferred)
      // Ensure student_name and timestamp are first
      const predefinedHeaders = [
        "student_name", "timestamp", "score_percentage",
        "avg_time_per_question", "avg_confidence", "tab_switches_rate",
        "answer_changes_rate", "review_percentage", "avg_first_action_latency",
        "clicks_per_question", "performance_trend", "hard_question_accuracy",
        "hint_usage_percentage"
      ];

      // CSV Header Row
      let csvContent = "data:text/csv;charset=utf-8," + predefinedHeaders.join(",") + "\n";

      // CSV Rows
      data.forEach(row => {
        let rowString = predefinedHeaders.map(header => {
          let val = row[header];
          // Handle timestamp object from Firestore
          if (header === 'timestamp' && val && val.seconds) {
            return new Date(val.seconds * 1000).toISOString();
          }
          if (val === null || val === undefined) return "";
          return JSON.stringify(val); // Escape commas/quotes
        }).join(",");
        csvContent += rowString + "\n";
      });

      // Trigger Download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "student_research_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Export Error:", error);
      alert("Failed to export data.");
    }
    setLoading(false);
  };

  const toggleFeatures = () => {
    const newValue = !showFeatures;
    setShowFeatures(newValue);
    localStorage.setItem("SHOW_ML_FEATURES", JSON.stringify(newValue));
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="card-glass" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Researcher Access</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <input
                type="password"
                placeholder="Enter Access Code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ textAlign: 'center' }}
              />
            </div>
            <button className="btn-primary" type="submit" style={{ width: '100%' }}>
              Login
            </button>
          </form>
          <div style={{ marginTop: '1.5rem' }}>
            <a href="/" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>← Back to Home</a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card-glass" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>Researcher Dashboard</h2>
          <button onClick={() => setIsAuthenticated(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Logout</button>
        </div>

        {/* SETTINGS SECTION */}
        <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', color: '#475569', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Configuration</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, color: 'var(--primary)' }}>Show ML Features to Students</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>If disabled, students will only see their final score.</div>
            </div>
            <button
              onClick={toggleFeatures}
              style={{
                background: showFeatures ? 'var(--green, #22c55e)' : '#cbd5e1',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'background 0.3s'
              }}
            >
              {showFeatures ? "ENABLED" : "DISABLED"}
            </button>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Export aggregated student performance data for Google Sheets/Excel analysis.
        </p>
        <button
          className="btn-primary"
          onClick={handleExport}
          disabled={loading}
          style={{ background: 'var(--secondary)', width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}
        >
          {loading ? <Clock size={20} className="spin" /> : <BookOpen size={20} />}
          {loading ? "Exporting..." : "Download Data (CSV)"}
        </button>
        <div style={{ marginTop: '2rem' }}>
          <a href="/" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>← Back to Home</a>
        </div>
      </div>
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

  // --- SECURITY: PREVENT BACK NAVIGATION ---
  useEffect(() => {
    // Push a dummy state so there's something to "go back" to
    window.history.pushState(null, document.title, window.location.href);

    const handlePopState = (event) => {
      // If user presses back, force reload to home (Forfeit)
      // We use window.location.href to force a full reload and clear state
      window.history.pushState(null, document.title, window.location.href);
      if (window.confirm("Going back will forfeit your exam. Are you sure?")) {
        window.location.href = '/';
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
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
    // Allowed to skip questions now
    // if (!selectedOption) return alert("Please select an answer.");

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

    // 9. Performance Trend (Score 2nd Half - Score 1st Half -> Normalized by half length)
    // Dynamic split based on length
    const midpoint = Math.floor(totalQ / 2);
    const firstHalf = log.slice(0, midpoint);
    const secondHalf = log.slice(midpoint, totalQ);

    const scoreFirst = firstHalf.reduce((acc, q) => acc + q.is_correct, 0);
    const accuracyFirst = scoreFirst / firstHalf.length;

    const scoreSecond = secondHalf.reduce((acc, q) => acc + q.is_correct, 0);
    const accuracySecond = scoreSecond / secondHalf.length;

    const trend = parseFloat((accuracySecond - accuracyFirst).toFixed(2));

    // 10. Hard Question Accuracy (Difficulty > 1)
    const hardQuestions = log.filter(q => q.difficulty > 1);
    const hardCorrect = hardQuestions.reduce((acc, q) => acc + q.is_correct, 0);
    const hardAccuracy = hardQuestions.length > 0 ? parseFloat((hardCorrect / hardQuestions.length).toFixed(2)) : 0;

    return {
      // 1. Normalized Score (Percentage 0-100)
      score_percentage: parseFloat(((sum('is_correct') / totalQ) * 100).toFixed(1)),

      // 2. Avg Time per Question (Seconds)
      avg_time_per_question: mean('response_time'),

      // 3. Avg Confidence (1-5)
      avg_confidence: mean('confidence_score'),

      // 4. Tab Switches Rate (Per Question)
      tab_switches_rate: parseFloat((sum('tab_switches') / totalQ).toFixed(2)),

      // 5. Answer Changes Rate (Per Question)
      answer_changes_rate: parseFloat((sum('answer_changes') / totalQ).toFixed(2)),

      // 6. Review Percentage (% of questions marked)
      review_percentage: parseFloat(((sum('review_flag') / totalQ) * 100).toFixed(1)),

      // 7. Processing Speed (Avg First Click Latency)
      avg_first_action_latency: mean('first_click_latency'),

      // 8. Interaction Intensity (Clicks Per Question)
      clicks_per_question: parseFloat((sum('total_clicks') / totalQ).toFixed(1)),

      // 9. Endurance Trend (-1.0 to 1.0)
      performance_trend: trend,

      // 10. Advanced Mastery (Percentage 0-100)
      hard_question_accuracy: parseFloat((hardAccuracy * 100).toFixed(1)),

      // 11. Hint Usage Percentage (% of questions with hints used)
      hint_usage_percentage: parseFloat(((hintsViewed.size / totalQ) * 100).toFixed(1))
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

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '250px' }}>
            <label className="review-label" style={{ marginBottom: '4px' }}>
              <input
                type="checkbox"
                style={{ width: '16px', height: '16px' }}
                checked={markedForReview}
                onChange={(e) => setMarkedForReview(e.target.checked)}
              />
              Mark for Review
            </label>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', lineHeight: '1.2' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>Tip:</span> If you are unsure, mark this instead of guessing randomly. This helps accurate analysis.
            </div>
          </div>

          <button className="btn-primary" onClick={handleNext}>
            {currentQIndex === 9 ? "Submit" : "Next"}
          </button>
        </div>
      </motion.div>
    </Layout>
  );
};

// --- PAGE 3: RESULTS ---
const Results = ({ showFeatures }) => {
  const { state } = useLocation();
  if (!state) return <Layout>No results found.</Layout>;

  const { features } = state;

  const featureExplanations = [
    { label: "Score %", value: features.score_percentage + "%", desc: "Percentage of correct answers." },
    { label: "Avg. Time / Question", value: features.avg_time_per_question + "s", desc: "Mean time spent per item." },
    { label: "Confidence", value: features.avg_confidence + "/5", desc: "Mean self-reported confidence." },
    { label: "Focus Rate", value: features.tab_switches_rate, desc: "Avg tab switches per question." },
    { label: "Uncertainty Rate", value: features.answer_changes_rate, desc: "Avg answer changes per question." },
    { label: "Review %", value: features.review_percentage + "%", desc: "% of questions marked for review." },
    { label: "Processing Speed", value: features.avg_first_action_latency + "s", desc: "Mean latency to first interaction." },
    { label: "Interaction Intensity", value: features.clicks_per_question, desc: "Avg clicks per question." },
    { label: "Endurance Trend", value: features.performance_trend > 0 ? "+" + features.performance_trend : features.performance_trend, desc: "Accuracy Change (2nd Half - 1st Half)." },
    { label: "Advanced Mastery", value: features.hard_question_accuracy + "%", desc: "% Correct on Difficulty > 1." },
    { label: "Scaffolding Use", value: features.hint_usage_percentage + "%", desc: "% of questions where hint was used." }
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
            Thank you, {state.name || "Student"}. {showFeatures ? "Here is your ML Feature Profile." : "Assessment recorded."}
          </p>
        </div>

        {/* CONDITIONALLY RENDER FEATURES */}
        {showFeatures ? (
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
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>Score: {features.score_percentage}%</h2>
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

const App = () => {
  // Initialize State from LocalStorage (default to false if not found)
  const [showFeatures, setShowFeatures] = useState(() => {
    const saved = localStorage.getItem("SHOW_ML_FEATURES");
    return saved !== null ? JSON.parse(saved) : false;
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/results" element={<Results showFeatures={showFeatures} />} />
        <Route path="/admin" element={<AdminPanel showFeatures={showFeatures} setShowFeatures={setShowFeatures} />} />
      </Routes>
    </Router>
  );
};

export default App;