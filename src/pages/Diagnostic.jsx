import { useState, useEffect } from 'react';
import { caresDimensions, getScoreInterpretation, getOverallInterpretation } from '../data/caresAssessment';
import { getRecommendedChapters } from '../data/diagnosticData';
import * as analytics from '../services/analytics';

export default function Diagnostic() {
  const [stage, setStage] = useState('assessment');
  const [caresResponses, setCaresResponses] = useState({});
  const [dimensionScores, setDimensionScores] = useState({});
  const [email, setEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [submissionState, setSubmissionState] = useState({
    loading: false,
    success: false,
    error: null,
    assessmentId: null
  });

  const dimensionOrder = ['stress', 'communication', 'adaptation', 'relationships', 'empowerment'];

  useEffect(() => {
    analytics.trackDiagnosticStart();

    // Initialize all dimension scores to 5.0
    const initialScores = {};
    dimensionOrder.forEach(dimKey => {
      initialScores[dimKey] = 5.0;
    });
    setDimensionScores(initialScores);
  }, []);

  const calculateDimensionScore = (dimensionKey) => {
    return dimensionScores[dimensionKey] || 5.0;
  };

  const calculateOverallScore = () => {
    const scores = dimensionOrder.map(dim => calculateDimensionScore(dim));
    const sum = scores.reduce((sum, val) => sum + val, 0);
    const average = sum / scores.length;
    return Math.round(average * 10) / 10;
  };

  const handleCaresResponse = (questionId, value) => {
    setCaresResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleComplete = () => {
    const overallScore = calculateOverallScore();

    const scores = {};
    dimensionOrder.forEach(dim => {
      scores[dim] = calculateDimensionScore(dim);
    });

    analytics.trackEvent('cares_assessment_completed', {
      stress_score: scores.stress,
      communication_score: scores.communication,
      adaptation_score: scores.adaptation,
      relationship_score: scores.relationships,
      empowerment_score: scores.empowerment,
      overall_score: overallScore
    });

    const lowestDimension = Object.entries(scores).reduce((min, [key, val]) =>
      val < min.val ? { key, val } : min,
      { key: dimensionOrder[0], val: scores[dimensionOrder[0]] }
    );

    analytics.trackEvent('focus_area_detected', {
      focus_area: lowestDimension.key
    });

    setShowEmailModal(true);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmissionState({ loading: true, success: false, error: null, assessmentId: null });

    try {
      analytics.trackLeadCapture('email_report', email);

      const overallScore = calculateOverallScore();
      const scores = {};
      dimensionOrder.forEach(dim => {
        scores[dim] = calculateDimensionScore(dim);
      });

      const lowestScore = Object.entries(scores).reduce((min, [key, val]) =>
        val < min.val ? { key, val } : min,
        { key: dimensionOrder[0], val: scores[dimensionOrder[0]] }
      );

      const recommendations = getRecommendedChapters(lowestScore.key);

      const payload = {
        email,
        overallScore: parseFloat(overallScore.toFixed(1)),
        categoryScores: {
          communication: scores.communication,
          adaptation: scores.adaptation,
          relationships: scores.relationships,
          stressResponse: scores.stress,
          alignment: scores.empowerment,
        },
        recommendedChapters: recommendations,
        recommendedActions: [
          { title: 'Get the Toolkit', description: 'Complete toolkit with frameworks and exercises' },
          { title: 'Book Workshop', description: 'Cohort-based CARES framework training' },
          { title: '1:1 Strategy Session', description: 'Work directly with Saby Waraich' }
        ]
      };

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-assessment`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setSubmissionState({
          loading: false,
          success: true,
          error: null,
          assessmentId: result.assessmentId
        });
        setShowEmailModal(false);
        setStage('final');
      } else {
        setSubmissionState({
          loading: false,
          success: false,
          error: result.message || 'Failed to submit assessment',
          assessmentId: null
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionState({
        loading: false,
        success: false,
        error: 'Network error. Please try again.',
        assessmentId: null
      });
    }
  };

  const handleToolkitClick = () => {
    window.open('https://sabywaraich.com/resources', '_blank');
  };

  const handleGetBookClick = () => {
    window.open('https://forms.gle/YOUR_TOOLKIT_FORM_ID', '_blank');
  };

  const handleWorkshopClick = () => {
    window.open('https://forms.gle/YOUR_WORKSHOP_FORM_ID', '_blank');
  };

  const handleOldWorkshopClick = () => {
    window.open('https://sabywaraich.com/workshop', '_blank');
  };

  const handleCoachingClick = () => {
    window.open('https://calendly.com/sabywaraich', '_blank');
  };

  const allQuestionsAnswered = () => {
    return true;
  };

  const renderAssessment = () => {
    const overallScore = calculateOverallScore();
    const overallInterpretation = getOverallInterpretation(overallScore);

    return (
      <section className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {dimensionOrder.map((dimKey) => {
                const dimension = caresDimensions[dimKey];
                const dimensionScore = calculateDimensionScore(dimKey);

                return (
                  <div key={dimKey} className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-xl ${dimension.color} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-2xl font-bold text-white">{dimension.letter}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{dimension.title}</h2>
                    </div>

                    <div className="space-y-6">
                      {dimension.questions.map((question) => (
                        <div key={question.id}>
                          <p className="text-gray-700 mb-4">{question.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">SCORE</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {dimensionScore.toFixed(1)}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={dimensionScore}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value);
                          setDimensionScores(prev => ({ ...prev, [dimKey]: newValue }));
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #EAB308 0%, #EAB308 ${(dimensionScore / 10) * 100}%, #E5E7EB ${(dimensionScore / 10) * 100}%, #E5E7EB 100%)`
                        }}
                      />

                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>0 (Fear-Based)</span>
                        <span>10 (Healthy)</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={handleComplete}
                disabled={!allQuestionsAnswered()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Assessment
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-blue-700 mb-6">Overall SCARE Score</h3>

                  <div className="bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl p-8 mb-6 text-center">
                    <div className="text-7xl font-bold text-white mb-2">
                      {overallScore.toFixed(1)}
                    </div>
                    <div className="text-white text-lg font-medium">out of 10</div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-700">0-3:</span>
                        <span className="text-sm text-gray-700">High fear-based patterns</span>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-700">4-6:</span>
                        <span className="text-sm text-gray-700">Mixed, room for growth</span>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-700">7-10:</span>
                        <span className="text-sm text-gray-700">Healthy leadership</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderEmailModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Get Your Full Report
        </h2>
        <p className="text-gray-600 mb-6">
          Enter your email to receive your complete CARES leadership assessment, personalized recommendations, and chapter suggestions.
        </p>

        {submissionState.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{submissionState.error}</p>
          </div>
        )}

        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={submissionState.loading}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4 disabled:opacity-50"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowEmailModal(false)}
              disabled={submissionState.loading}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submissionState.loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {submissionState.loading ? 'Sending...' : 'Send Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderFinal = () => {
    const overallScore = calculateOverallScore();
    const scores = {};
    dimensionOrder.forEach(dim => {
      scores[dim] = calculateDimensionScore(dim);
    });

    const lowestScore = Object.entries(scores).reduce((min, [key, val]) =>
      val < min.val ? { key, val } : min,
      { key: dimensionOrder[0], val: scores[dimensionOrder[0]] }
    );

    const recommendations = getRecommendedChapters(lowestScore.key);

    return (
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Your Leadership Profile
            </h1>
            <p className="text-xl text-gray-600">
              Personalized insights and next steps
            </p>
          </div>

          {submissionState.success && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800 font-medium">
                  Your report has been sent to your email.
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-12 mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Ready to Transform Your Leadership?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Dive deeper into the SCARE to CARES framework and learn how to lead digital transformation without fear, confusion, or burnout.
            </p>
            <button
              onClick={handleToolkitClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all"
            >
              Order on Amazon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <p className="text-sm text-gray-500 mt-4 italic">
              As an Amazon Associate I earn from qualifying purchases.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Chapters</h2>
            <p className="text-gray-600 mb-8">
              Based on your assessment, these chapters will help you strengthen your {caresDimensions[lowestScore.key].title.toLowerCase()}.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                  <div className="text-sm font-semibold text-blue-600 mb-2">{rec.chapter}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{rec.title}</h3>
                  <p className="text-gray-600 text-sm">{rec.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get the Toolkit</h3>
                <p className="text-sm text-gray-600 mb-4">Complete toolkit with frameworks and exercises</p>
                <button
                  onClick={handleGetBookClick}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  More Details →
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Workshop</h3>
                <p className="text-sm text-gray-600 mb-4">Cohort-based CARES framework training</p>
                <button
                  onClick={handleWorkshopClick}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  More Details →
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1:1 Strategy Session</h3>
                <p className="text-sm text-gray-600 mb-4">Work directly with Saby Waraich</p>
                <button
                  onClick={handleCoachingClick}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Book Session →
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Return to Home
            </button>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {stage === 'assessment' && renderAssessment()}
      {stage === 'final' && renderFinal()}
      {showEmailModal && renderEmailModal()}
    </div>
  );
}
