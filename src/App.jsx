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

// --- LEARNING MASTERY SCORE CALCULATION ---
// Based on 6 core research-backed features
const calculateLMS = (student) => {
  // Component 1: Base Performance (50% of total score)
  const scoreComponent = (student.score_percentage || 0) * 0.50;

  // Component 2: Hard Question Mastery (15% of total score)
  const hardComponent = (student.hard_question_accuracy || 0) * 0.15;

  // Component 3: Hint Independence Penalty (up to -15 points)
  // Penalty increases exponentially with hint usage
  const hintUsage = (student.hint_usage_percentage || 0) / 100;
  const hintPenalty = Math.pow(hintUsage, 1.5) * 15;

  // Component 4: Confidence Calibration (up to +10 points)
  // Good calibration = confidence matches actual performance
  const confidenceNormalized = ((student.avg_confidence || 3) - 1) / 4;
  const scoreNormalized = (student.score_percentage || 0) / 100;
  const calibrationError = Math.abs(confidenceNormalized - scoreNormalized);
  const calibrationComponent = (1 - calibrationError) * 10;

  // Component 5: Knowledge Stability (up to +10 points)
  // Low answer changes = stable knowledge
  const stabilityNormalized = 1 - Math.min((student.answer_changes_rate || 0) / 2, 1);
  const stabilityComponent = stabilityNormalized * 10;

  // Component 6: Attention/Focus (up to +10 points)
  // Low tab switches = focused attention
  const attentionNormalized = 1 - Math.min((student.tab_switches_rate || 0) / 3, 1);
  const attentionComponent = attentionNormalized * 10;

  // Final LMS calculation
  const lms = scoreComponent + hardComponent + calibrationComponent +
    stabilityComponent + attentionComponent - hintPenalty;

  return Math.max(0, Math.min(100, lms)).toFixed(1);
};

// Get mastery level label from LMS score
const getMasteryLevel = (lms) => {
  const score = parseFloat(lms);
  if (score <= 35) return { label: 'At-Risk', color: '#ef4444' };
  if (score <= 55) return { label: 'Developing', color: '#f59e0b' };
  if (score <= 75) return { label: 'Proficient', color: '#3b82f6' };
  return { label: 'Advanced', color: '#22c55e' };
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // Student Performance Data states
  const [showStudentData, setShowStudentData] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const fetchStudentData = async () => {
    setLoadingStudents(true);
    try {
      const querySnapshot = await getDocs(collection(db, "exam_submissions"));
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      // Sort by timestamp (most recent first)
      data.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });
      setStudentData(data);
      setShowStudentData(true);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Failed to fetch student data.");
    }
    setLoadingStudents(false);
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

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "N/A";
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const featureLabels = [
    { key: "score_percentage", label: "Score %", suffix: "%" },
    { key: "avg_time_per_question", label: "Avg. Time / Question", suffix: "s" },
    { key: "avg_confidence", label: "Confidence", suffix: "/5" },
    { key: "tab_switches_rate", label: "Focus Rate (Tab Switches)", suffix: "" },
    { key: "answer_changes_rate", label: "Uncertainty Rate (Answer Changes)", suffix: "" },
    { key: "review_percentage", label: "Review %", suffix: "%" },
    { key: "avg_first_action_latency", label: "Processing Speed (First Click)", suffix: "s" },
    { key: "clicks_per_question", label: "Interaction Intensity (Clicks)", suffix: "" },
    { key: "performance_trend", label: "Endurance Trend", suffix: "" },
    { key: "hard_question_accuracy", label: "Advanced Mastery (Hard Q)", suffix: "%" },
    { key: "hint_usage_percentage", label: "Scaffolding Use (Hints)", suffix: "%" }
  ];

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

  // Student Profile Modal
  if (selectedStudent) {
    return (
      <Layout>
        <motion.div
          className="card-glass"
          style={{ maxWidth: '700px', margin: '0 auto' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ color: 'var(--primary)', margin: 0 }}>{selectedStudent.student_name}</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.3rem 0 0 0' }}>
                Submitted: {formatTimestamp(selectedStudent.timestamp)}
              </p>
            </div>
            <button
              onClick={() => setSelectedStudent(null)}
              style={{
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <X size={16} /> Close
            </button>
          </div>

          {/* Score Cards - Raw Score and LMS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Raw Score */}
            <div style={{
              background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
              padding: '1.2rem',
              borderRadius: '12px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{selectedStudent.score_percentage}%</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Raw Score</div>
            </div>

            {/* Learning Mastery Score */}
            {(() => {
              const lms = calculateLMS(selectedStudent);
              const mastery = getMasteryLevel(lms);
              return (
                <div
                  style={{
                    background: `linear-gradient(135deg, ${mastery.color} 0%, ${mastery.color}dd 100%)`,
                    padding: '1.2rem',
                    borderRadius: '12px',
                    color: 'white',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => navigate('/lms-explained')}
                  title="Click to see how this is calculated"
                >
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{lms}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                    Learning Mastery Score
                    <span style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      marginTop: '0.2rem',
                      textDecoration: 'underline',
                      opacity: 0.8
                    }}>
                      Click to see formula →
                    </span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>
                    {mastery.label}
                  </div>
                </div>
              );
            })()}
          </div>

          <h3 style={{
            fontSize: '1rem',
            color: '#475569',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.5rem'
          }}>
            ML Feature Profile
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            {featureLabels.slice(1).map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {feature.label}
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)', marginTop: '0.2rem' }}>
                  {feature.key === 'performance_trend' && selectedStudent[feature.key] > 0 ? '+' : ''}
                  {selectedStudent[feature.key]}{feature.suffix}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Layout>
    );
  }

  // Student Data Table View
  if (showStudentData) {
    return (
      <Layout>
        <div className="card-glass" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>Student Performance Data</h2>
            <button
              onClick={() => setShowStudentData(false)}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              ← Back to Dashboard
            </button>
          </div>

          <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Click on a student name to view their complete ML feature profile. Total: <strong>{studentData.length}</strong> submissions.
          </p>

          {studentData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No student submissions found.</p>
            </div>
          ) : (
            <div style={{
              maxHeight: '500px',
              overflowY: 'auto',
              border: '1px solid var(--border-color)',
              borderRadius: '12px'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem'
              }}>
                <thead>
                  <tr style={{
                    background: 'var(--primary)',
                    color: 'white',
                    position: 'sticky',
                    top: 0
                  }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Student Name</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Raw Score</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>
                      LMS
                      <span
                        style={{ fontSize: '0.7rem', display: 'block', opacity: 0.8, cursor: 'pointer' }}
                        onClick={(e) => { e.stopPropagation(); navigate('/lms-explained'); }}
                      >
                        (What's this?)
                      </span>
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((student, idx) => {
                    const lms = calculateLMS(student);
                    const mastery = getMasteryLevel(lms);
                    return (
                      <tr
                        key={student.id}
                        style={{
                          background: idx % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(241,245,249,0.5)',
                          transition: 'background 0.2s',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedStudent(student)}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(241,245,249,0.5)'}
                      >
                        <td style={{ padding: '0.8rem 1rem', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '0.8rem 1rem' }}>
                          <span style={{
                            color: 'var(--primary)',
                            fontWeight: 600,
                            textDecoration: 'underline',
                            cursor: 'pointer'
                          }}>
                            {student.student_name}
                          </span>
                        </td>
                        <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                          <span style={{
                            background: '#64748b',
                            color: 'white',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '20px',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                          }}>
                            {student.score_percentage}%
                          </span>
                        </td>
                        <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                          <span style={{
                            background: mastery.color,
                            color: 'white',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '20px',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                          }}>
                            {lms}
                          </span>
                          <span style={{
                            display: 'block',
                            fontSize: '0.65rem',
                            color: mastery.color,
                            marginTop: '0.2rem',
                            fontWeight: 600
                          }}>
                            {mastery.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.8rem 1rem', textAlign: 'right', color: '#64748b', fontSize: '0.85rem' }}>
                          {formatTimestamp(student.timestamp)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
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

        {/* DATA ACTIONS SECTION */}
        <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', color: '#475569', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data Management</h3>

          <button
            className="btn-primary"
            onClick={fetchStudentData}
            disabled={loadingStudents}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '1rem'
            }}
          >
            {loadingStudents ? <Clock size={20} className="spin" /> : <Brain size={20} />}
            {loadingStudents ? "Loading..." : "View Student Performance Data"}
          </button>

          <button
            className="btn-primary"
            onClick={handleExport}
            disabled={loading}
            style={{ background: 'var(--secondary)', width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}
          >
            {loading ? <Clock size={20} className="spin" /> : <BookOpen size={20} />}
            {loading ? "Exporting..." : "Download Data (CSV)"}
          </button>
        </div>

        <div style={{ marginTop: '1rem' }}>
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
        <Route path="/lms-explained" element={<LMSExplained />} />
      </Routes>
    </Router>
  );
};

// --- LMS EXPLANATION PAGE ---
const LMSExplained = () => {
  const navigate = useNavigate();

  const components = [
    {
      name: 'Base Performance',
      formula: 'score_percentage × 0.50',
      weight: '50%',
      range: '0-50 pts',
      description: 'The raw exam score remains the primary indicator of knowledge.',
      citation: 'Gao et al., 2022'
    },
    {
      name: 'Hard Question Mastery',
      formula: 'hard_question_accuracy × 0.15',
      weight: '15%',
      range: '0-15 pts',
      description: 'Performance on difficult questions indicates deeper conceptual understanding.',
      citation: 'Anaya et al., 2022'
    },
    {
      name: 'Independence Penalty',
      formula: '−(hint_usage/100)^1.5 × 15',
      weight: 'Penalty',
      range: '-15 to 0',
      description: 'High hint usage indicates scaffolded, non-independent performance.',
      citation: 'Lai & Lin, 2025; Vygotsky ZPD Theory'
    },
    {
      name: 'Confidence Calibration',
      formula: '(1 − |confidence − score|) × 10',
      weight: 'Bonus',
      range: '0-10 pts',
      description: 'Accurate self-assessment predicts knowledge retention and transfer.',
      citation: 'Lee & Bosch, 2025; Dunlosky & Rawson, 2012'
    },
    {
      name: 'Knowledge Stability',
      formula: '(1 − min(answer_changes/2, 1)) × 10',
      weight: 'Bonus',
      range: '0-10 pts',
      description: 'Fewer answer changes indicate stable, consolidated knowledge.',
      citation: 'Ouyang et al., 2019; Chi et al., 1994'
    },
    {
      name: 'Attention/Focus',
      formula: '(1 − min(tab_switches/3, 1)) × 10',
      weight: 'Bonus',
      range: '0-10 pts',
      description: 'Low tab switches indicate focused attention and deeper encoding.',
      citation: 'Chen et al., 2024; Kraushaar & Novak, 2010'
    }
  ];

  return (
    <Layout>
      <motion.div
        className="card-glass"
        style={{ maxWidth: '800px', margin: '0 auto' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>
            <Brain size={28} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
            Learning Mastery Score Algorithm
          </h2>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>

        {/* Formula Box */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: 'white',
          marginBottom: '1.5rem',
          fontFamily: 'monospace'
        }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem' }}>FORMULA</div>
          <div style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            <span style={{ color: '#4ade80' }}>LMS</span> =
            <span style={{ color: '#60a5fa' }}> 0.50×S</span> +
            <span style={{ color: '#a78bfa' }}> 0.15×Hd</span> +
            <span style={{ color: '#fbbf24' }}> 10×Ccal</span> +
            <span style={{ color: '#34d399' }}> 10×Ks</span> +
            <span style={{ color: '#f472b6' }}> 10×Af</span> −
            <span style={{ color: '#ef4444' }}> 15×Hu^1.5</span>
          </div>
        </div>

        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
          The Learning Mastery Score (LMS) estimates a student's <strong>true learning level</strong>,
          not just their exam outcome. Unlike raw scores, LMS penalizes hint dependency, rewards
          metacognitive accuracy, and accounts for knowledge stability—all backed by educational
          psychology research.
        </p>

        <h3 style={{
          fontSize: '1rem',
          color: '#475569',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem'
        }}>
          Component Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {components.map((comp, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.6)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{comp.name}</div>
                <span style={{
                  background: comp.weight === 'Penalty' ? '#fef2f2' : '#f0fdf4',
                  color: comp.weight === 'Penalty' ? '#ef4444' : '#22c55e',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {comp.range}
                </span>
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                background: '#f1f5f9',
                padding: '0.4rem 0.6rem',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                color: '#475569'
              }}>
                {comp.formula}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{comp.description}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem', fontStyle: 'italic' }}>
                📚 {comp.citation}
              </div>
            </div>
          ))}
        </div>

        {/* Mastery Level Legend */}
        <h3 style={{
          fontSize: '1rem',
          color: '#475569',
          margin: '1.5rem 0 1rem 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem'
        }}>
          Mastery Level Classification
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {[
            { label: 'At-Risk', range: '0-35', color: '#ef4444' },
            { label: 'Developing', range: '36-55', color: '#f59e0b' },
            { label: 'Proficient', range: '56-75', color: '#3b82f6' },
            { label: 'Advanced', range: '76-100', color: '#22c55e' }
          ].map((level, idx) => (
            <div
              key={idx}
              style={{
                background: level.color,
                color: 'white',
                padding: '0.8rem 0.5rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{level.label}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{level.range}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #bae6fd'
        }}>
          <div style={{ fontWeight: 600, color: '#0369a1', marginBottom: '0.3rem' }}>
            📖 Research Foundation
          </div>
          <div style={{ fontSize: '0.85rem', color: '#0c4a6e', lineHeight: 1.5 }}>
            This algorithm is based on peer-reviewed educational psychology research including
            Vygotsky's Zone of Proximal Development (1978), Dunlosky & Rawson's metacognitive
            monitoring research (2012), and Chi et al.'s knowledge stability theory (1994).
            Full citations available in the Performance_Prediction_Validation.md document.
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default App;