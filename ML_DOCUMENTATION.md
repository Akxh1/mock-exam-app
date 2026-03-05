# X-Scaffold ML Pipeline Documentation

## 📋 Overview

This document provides comprehensive documentation for the X-Scaffold Machine Learning pipeline, including dataset generation, model training, and API deployment.

---

## 🎯 Model Architecture

### Algorithm: Bagging Classifier

**Why Bagging?**
Based on research, Bagging (Bootstrap Aggregating) is ideal for educational data because:

1. **Variance Reduction**: Reduces overfitting by training multiple models on different subsets
2. **Robust to Noise**: Educational data often contains measurement noise; bagging smooths this out
3. **Handles Class Imbalance**: Bootstrap sampling naturally helps with uneven class distributions
4. **Stable Predictions**: Ensemble averaging produces more reliable predictions than single trees

**Base Estimator**: Decision Tree Classifier
- Max Depth: 8 (prevents overfitting)
- Min Samples Split: 10
- Min Samples Leaf: 5

**Ensemble Configuration**:
- Number of Estimators: 50
- Max Samples per Estimator: 80%
- Max Features per Estimator: 80%
- Bootstrap Sampling: Enabled
- Out-of-Bag Score: Enabled

---

## 📊 Dataset Specification

### Features (11 Total)

#### Tier 1: Core Features (Used in LMS Calculation)

| Feature | Type | Range | Description | Research Justification |
|---------|------|-------|-------------|------------------------|
| `score_percentage` | Float | 0-100 | Overall exam score | Primary performance indicator (Pardos & Baker, 2014) |
| `hard_question_accuracy` | Float | 0-100 | Accuracy on difficult questions | Deep understanding proxy (Chi et al., 2018) |
| `hint_usage_percentage` | Float | 0-100 | % of questions with hints used | Independence indicator (Aleven et al., 2016) |
| `avg_confidence` | Float | 1-5 | Self-reported confidence | Metacognitive awareness (Tobias & Everson, 2002) |
| `answer_changes_rate` | Float | 0-2 | Answer changes per question | Knowledge stability (Shute, 2008) |
| `tab_switches_rate` | Float | 0-5 | Tab switches per question | Focus indicator (Baker et al., 2004) |

#### Tier 2: Additional ML Predictors

| Feature | Type | Range | Description | Research Justification |
|---------|------|-------|-------------|------------------------|
| `avg_time_per_question` | Float | 5-300s | Average seconds per question | Processing speed (D'Mello & Graesser, 2012) |
| `review_percentage` | Float | 0-100 | % of questions marked for review | Metacognition (Pintrich, 2002) |
| `avg_first_action_latency` | Float | 0.5-30s | Seconds before first click | Cognitive load (Sweller, 2011) |
| `clicks_per_question` | Float | 1-20 | Total clicks per question | Engagement intensity (Cocea & Weibelzahl, 2009) |
| `performance_trend` | Float | -50 to +50 | Score change 1st→2nd half | Fatigue/improvement (Roscoe et al., 2014) |

### Target Variable

| Variable | Type | Values | Description |
|----------|------|--------|-------------|
| `mastery_level` | Integer | 0, 1, 2, 3 | Classification target |
| `mastery_level_name` | String | at_risk, developing, proficient, advanced | Human-readable label |
| `learning_mastery_score` | Float | 0-100 | LMS score (for reference) |

### Mastery Level Classification

| Level | LMS Range | Description | Intervention Priority |
|-------|-----------|-------------|----------------------|
| 0 - At Risk | 0-35 | Significant struggle, needs immediate support | 🔴 HIGH |
| 1 - Developing | 36-55 | Partial understanding, moderate support needed | 🟠 MEDIUM |
| 2 - Proficient | 56-75 | Good understanding, occasional guidance | 🔵 LOW |
| 3 - Advanced | 76-100 | Excellent mastery, minimal intervention | 🟢 NONE |

---

## 🔄 Data Generation Process

### Student Archetypes

The synthetic dataset is generated using 4 student archetypes based on educational research:

#### Archetype 1: At-Risk (15% of dataset)
- Low scores (μ=35, σ=12)
- High hint usage (μ=65%, σ=15%)
- Low confidence (μ=2.0, σ=0.5)
- Erratic behavior (high answer changes, tab switches)
- Negative performance trend

#### Archetype 2: Developing (35% of dataset)
- Moderate scores (μ=55, σ=10)
- Moderate hint usage (μ=40%, σ=15%)
- Average confidence (μ=2.8, σ=0.5)
- Some inconsistency in behavior
- Slight negative trend

#### Archetype 3: Proficient (35% of dataset)
- Good scores (μ=72, σ=8)
- Low hint usage (μ=20%, σ=12%)
- Good confidence (μ=3.6, σ=0.5)
- Stable behavior
- Slight positive trend

#### Archetype 4: Advanced (15% of dataset)
- Excellent scores (μ=88, σ=7)
- Minimal hint usage (μ=8%, σ=8%)
- High confidence (μ=4.3, σ=0.4)
- Efficient behavior
- Strong positive trend

### LMS Calculation Formula

```
LMS = 0.50×S + 0.15×Hd + 10×Ccal + 10×Ks + 10×Af − 15×Hu^1.5
```

Where:
- **S** = score_percentage (0-100)
- **Hd** = hard_question_accuracy / 100 (normalized)
- **Ccal** = Calibration bonus (1 if confidence matches performance, 0 otherwise)
- **Ks** = Knowledge stability (1 if low answer changes, 0 if high)
- **Af** = Attention factor (1 if low tab switches, 0 if high)
- **Hu** = hint_usage_percentage / 100 (normalized)

---

## 🧪 Model Training Process

### Pipeline Steps

```
1. Load Dataset (xscaffold_student_dataset.csv)
       ↓
2. Train/Test Split (80/20, stratified)
       ↓
3. Feature Scaling (StandardScaler)
       ↓
4. Train Bagging Classifier (50 estimators)
       ↓
5. Evaluate (Accuracy, F1, Confusion Matrix)
       ↓
6. Cross-Validation (5-fold stratified)
       ↓
7. Feature Importance Analysis (Gini + Permutation)
       ↓
8. Save Model Artifacts
```

### Expected Performance Metrics

Based on the synthetic dataset design, expected metrics are:

| Metric | Expected Value |
|--------|----------------|
| Test Accuracy | 85-92% |
| F1 Macro | 0.83-0.90 |
| Cross-Val Mean | 0.84-0.91 |
| Overfitting Gap | < 5% |

### Output Artifacts

| File | Description |
|------|-------------|
| `xscaffold_bagging_model.pkl` | Trained Bagging Classifier |
| `xscaffold_scaler.pkl` | StandardScaler for feature normalization |
| `feature_names.json` | Feature order and class names |
| `model_metrics.json` | Performance metrics |
| `feature_importance.json` | Feature importance rankings |
| `model_config.json` | Hyperparameters and config |

---

## 🔮 SHAP Integration (XAI)

### What is SHAP?

SHAP (SHapley Additive exPlanations) provides:
- **Local explanations**: Why THIS student got THIS prediction
- **Global explanations**: Which features matter most overall
- **Additive contributions**: Each feature's exact contribution to the prediction

### SHAP Output Format

For each prediction, the API returns:

```json
{
  "explanation": {
    "contributions": {
      "score_percentage": {"value": 0.234, "direction": "positive"},
      "hint_usage_percentage": {"value": -0.156, "direction": "negative"},
      ...
    },
    "top_positive": ["score_percentage", "avg_confidence", "hard_question_accuracy"],
    "top_negative": ["hint_usage_percentage", "tab_switches_rate"],
    "natural_language": "Positive factors: score_percentage (+0.234), avg_confidence (+0.089). Areas for improvement: hint_usage_percentage (-0.156)."
  }
}
```

### Natural Language Generation

The `natural_language` field is designed to be passed directly to the LLM for hint generation:

```php
// HintController.php
$xai_analysis = $prediction['explanation']['natural_language'];
// "Positive factors: score_percentage (+0.234)..."
```

---

## 🚀 API Reference

### Endpoints

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model": "xscaffold_bagging_model",
  "features_count": 11,
  "classes": ["at_risk", "developing", "proficient", "advanced"],
  "shap_available": true
}
```

#### `POST /predict`
Single student prediction with SHAP explanation.

**Request:**
```json
{
  "score_percentage": 72.5,
  "hard_question_accuracy": 65.0,
  "hint_usage_percentage": 18.0,
  "avg_confidence": 3.8,
  "answer_changes_rate": 0.35,
  "tab_switches_rate": 0.9,
  "avg_time_per_question": 82.0,
  "review_percentage": 38.0,
  "avg_first_action_latency": 4.8,
  "clicks_per_question": 4.5,
  "performance_trend": 7.5
}
```

**Response:**
```json
{
  "prediction": {
    "mastery_level": 2,
    "mastery_level_name": "proficient",
    "confidence": 0.8734,
    "probabilities": {
      "at_risk": 0.0234,
      "developing": 0.0832,
      "proficient": 0.8734,
      "advanced": 0.0200
    }
  },
  "explanation": {
    "contributions": {...},
    "top_positive": ["score_percentage", "avg_confidence"],
    "top_negative": ["hint_usage_percentage"],
    "natural_language": "Positive factors: score_percentage (+0.234)..."
  }
}
```

#### `POST /batch_predict`
Batch predictions for multiple students.

**Request:**
```json
{
  "students": [
    {"score_percentage": 72.5, ...},
    {"score_percentage": 45.0, ...}
  ]
}
```

---

## 📦 Setup Instructions

### 1. Install Python Dependencies

```bash
cd ml_model
pip install -r requirements.txt
```

### 2. Generate Dataset

```bash
python generate_dataset.py
```

This creates `xscaffold_student_dataset.csv` with 2000 student records.

### 3. Train Model

```bash
python train_model.py
```

This trains the Bagging Classifier and saves all artifacts.

### 4. Start API Server

```bash
python api.py
```

The API will be available at `http://localhost:5000`.

### 5. Test Prediction

```bash
python predict.py
```

Or with custom features:
```bash
python predict.py --features '{"score_percentage": 72.5, ...}'
```

---

## 🔗 Laravel Integration

### Calling the ML API from Laravel

```php
// In StudentModulePerformance controller or HintController

use Illuminate\Support\Facades\Http;

$features = [
    'score_percentage' => $performance->score_percentage,
    'hard_question_accuracy' => $performance->hard_question_accuracy,
    // ... all 11 features
];

$response = Http::post('http://localhost:5000/predict', $features);

if ($response->successful()) {
    $prediction = $response->json();
    
    // Store prediction
    $performance->predicted_level = $prediction['prediction']['mastery_level'];
    $performance->shap_values = json_encode($prediction['explanation']['contributions']);
    $performance->save();
    
    // Pass XAI to LLM for hint generation
    $xai_analysis = $prediction['explanation']['natural_language'];
}
```

---

## 📚 Research Citations

1. Pardos, Z. A., & Baker, R. S. (2014). Affective states and state tests. *ACM Conference on Learning @ Scale*.
2. Chi, M., et al. (2018). Learning from worked examples: A deep comprehension approach. *Educational Psychology Review*.
3. Aleven, V., et al. (2016). Help seeking and help design in interactive learning environments. *Review of Educational Research*.
4. Baker, R. S., et al. (2004). Off-task behavior in the cognitive tutor classroom. *CHI 2004*.
5. D'Mello, S., & Graesser, A. (2012). Dynamics of affective states during complex learning. *Learning and Instruction*.

---

## 📝 Changelog

### v1.0.0 (January 2026)
- Initial release
- Bagging Classifier with 50 estimators
- 11-feature dataset based on project requirements
- SHAP integration for XAI
- Flask API for serving predictions
- Comprehensive documentation

---

*X-Scaffold Research Project*  
*Final Year Project • Computing Mathematics Education*
