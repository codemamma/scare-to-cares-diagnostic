import { useState, useEffect } from 'react';
import {
  scareQuestions,
  calculateScareScore,
  calculateScareIndex,
  determineFocusArea,
  resultProfiles,
  getRecommendedChapters
} from '../data/diagnosticData';
import { caresDimensions, getScoreInterpretation, getDimensionInsight } from '../data/caresAssessment';
import * as analytics from '../services/analytics';

export default function Diagnostic() {
  const [stage, setStage] = useState('intro');
  const [scareResponses, setScareResponses] = useState({});
  const [scareScore, setScareScore] = useState(null);
  const [scareIndex, setScareIndex] = useState(null);
  const [focusArea, setFocusArea] = useState(null);

  const [caresResponses, setCaresResponses] = useState({});
  const [caresScores, setCaresScores] = useState({});
  const [currentDimension, setCurrentDimension] = useState('stress');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [email, setEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const dimensionOrder = ['stress', 'communication', 'adaptation', 'relationships', 'empowerment'];

  useEffect(() => {
    if (stage === 'scare-assessment') {
      analytics.trackDiagnosticStart();
    }
  }, [stage]);

  const handleScareResponse = (questionId, value) => {
    setScareResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleScareSubmit = () => {
    const score = calculateScareScore(scareResponses);
    const index = calculateScareIndex(score);
    const focus = determineFocusArea(scareResponses, index);

    setScareScore(score);
    setScareIndex(index);
    setFocusArea(focus);
    setStage('scare-results');
  };

  const handleCaresResponse = (questionId, value) => {
    setCaresResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCaresNext = () => {
    const dimension = caresDimensions[currentDimension];
    const questions = dimension.questions;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const currentDimensionIndex = dimensionOrder.indexOf(currentDimension);

      if (currentDimensionIndex < dimensionOrder.length - 1) {
        setCurrentDimension(dimensionOrder[currentDimensionIndex + 1]);
        setCurrentQuestionIndex(0);
      } else {
        calculateCaresScores();
        setStage('cares-results');
      }
    }
  };

  const handleCaresPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      const currentDimensionIndex = dimensionOrder.indexOf(currentDimension);
      if (currentDimensionIndex > 0) {
        const prevDimension = dimensionOrder[currentDimensionIndex - 1];
        setCurrentDimension(prevDimension);
        setCurrentQuestionIndex(caresDimensions[prevDimension].questions.length - 1);
      }
    }
  };

  const calculateCaresScores = () => {
    const scores = {};

    dimensionOrder.forEach(dim => {
      const questions = caresDimensions[dim].questions;
      const responses = questions.map(q => caresResponses[q.id] || 0);
      const average = responses.reduce((sum, val) => sum + val, 0) / questions.length;
      scores[dim] = Number(average.toFixed(1));
    });

    setCaresScores(scores);

    analytics.trackEvent('cares_assessment_completed', {
      stress_score: scores.stress,
      communication_score: scores.communication,
      adaptation_score: scores.adaptation,
      relationship_score: scores.relationships,
      empowerment_score: scores.empowerment
    });

    const lowestDimension = Object.entries(scores).reduce((min, [key, val]) =>
      val < min.val ? { key, val } : min,
      { key: dimensionOrder[0], val: scores[dimensionOrder[0]] }
    );

    analytics.trackEvent('focus_area_detected', {
      focus_area: lowestDimension.key
    });
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      analytics.trackLeadCapture('email_report', email);
      setShowEmailModal(false);
      setStage('final-recommendations');
    }
  };

  const handleToolkitClick = () => {
    analytics.trackActionClick('toolkit_download', scareScore, focusArea);
    window.open('https://sabywaraich.com/resources', '_blank');
  };

  const handleWorkshopClick = () => {
    analytics.trackActionClick('workshop_waitlist', scareScore, focusArea);
    window.open('https://sabywaraich.com/workshop', '_blank');
  };

  const handleCoachingClick = () => {
    analytics.trackActionClick('coaching_request', scareScore, focusArea);
    window.open('https://calendly.com/sabywaraich', '_blank');
  };

  const getProfileData = () => {
    if (!scareScore) return resultProfiles.moderate;

    for (const profile of Object.values(resultProfiles)) {
      if (scareScore >= profile.range[0] && scareScore <= profile.range[1]) {
        return profile;
      }
    }
    return resultProfiles.moderate;
  };

  const renderIntro = () => (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600/10 border border-slate-600/30 rounded-full mb-6">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm font-medium text-slate-400">10-minute leadership diagnostic</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Leadership Pattern Assessment
          </h1>
          <p className="text-xl text-gray-400 mb-4">
            A structured diagnostic to identify your leadership strengths and growth opportunities across the CARES framework.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">What You'll Discover</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-600/20 flex items-center justify-center text-slate-400 text-sm font-semibold">1</div>
              <div>
                <h3 className="font-medium text-white mb-1">Your SCARE Score</h3>
                <p className="text-sm text-gray-400">Initial assessment of transformation friction in your environment</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-600/20 flex items-center justify-center text-slate-400 text-sm font-semibold">2</div>
              <div>
                <h3 className="font-medium text-white mb-1">CARES Leadership Profile</h3>
                <p className="text-sm text-gray-400">Comprehensive evaluation across five critical leadership dimensions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-600/20 flex items-center justify-center text-slate-400 text-sm font-semibold">3</div>
              <div>
                <h3 className="font-medium text-white mb-1">Personalized Action Plan</h3>
                <p className="text-sm text-gray-400">Targeted recommendations and resources for your development</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStage('scare-assessment')}
          className="btn-primary w-full"
        >
          Begin Assessment
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Based on the SCARE to CARES framework by Saby Waraich
        </p>
      </div>
    </section>
  );

  const renderScareAssessment = () => {
    const allAnswered = scareQuestions.every(q => scareResponses[q.id]);

    return (
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">Step 1 of 4</span>
              <span className="text-sm font-medium text-slate-400">Initial Assessment</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-slate-600 transition-all duration-300" style={{ width: '25%' }}></div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Quick SCARE Assessment
            </h1>
            <p className="text-gray-400">
              Answer these questions to establish your baseline transformation environment
            </p>
          </div>

          <div className="space-y-8">
            {scareQuestions.map((question, index) => (
              <div key={question.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600/20 flex items-center justify-center text-slate-400 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-medium text-white pt-1">{question.text}</h3>
                </div>

                <div className="space-y-2 ml-11">
                  {question.options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        scareResponses[question.id] === option.value
                          ? 'border-slate-600 bg-slate-600/10'
                          : 'border-gray-800 hover:border-gray-700 bg-gray-800/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={scareResponses[question.id] === option.value}
                        onChange={() => handleScareResponse(question.id, option.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        scareResponses[question.id] === option.value
                          ? 'border-slate-600'
                          : 'border-gray-600'
                      }`}>
                        {scareResponses[question.id] === option.value && (
                          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                        )}
                      </div>
                      <span className="text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStage('intro')}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              onClick={handleScareSubmit}
              disabled={!allAnswered}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </section>
    );
  };

  const renderScareResults = () => {
    const profile = getProfileData();

    return (
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">Step 2 of 4</span>
              <span className="text-sm font-medium text-slate-400">Initial Results</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-slate-600 transition-all duration-300" style={{ width: '50%' }}></div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Your SCARE Score
            </h1>
            <p className="text-gray-400">
              A snapshot of transformation friction in your environment
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-600/20 to-slate-800/20 border border-slate-600/30 rounded-lg p-8 mb-8">
            <div className="text-center">
              <div className="text-7xl font-bold text-white mb-2">{scareScore}</div>
              <div className="text-xl text-gray-300 mb-4">out of 20</div>
              <div className="inline-block px-4 py-2 bg-white/10 rounded-full">
                <span className="text-sm font-medium text-white">{profile.label}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">What This Suggests</h2>
            <p className="text-gray-300 mb-4">{profile.summary}</p>
            <p className="text-sm text-gray-400">
              The next assessment will evaluate your leadership patterns across five critical dimensions to identify specific growth opportunities.
            </p>
          </div>

          <button
            onClick={() => setStage('cares-assessment')}
            className="btn-primary w-full"
          >
            Continue to Leadership Assessment
          </button>
        </div>
      </section>
    );
  };

  const renderCaresAssessment = () => {
    const dimension = caresDimensions[currentDimension];
    const currentQuestion = dimension.questions[currentQuestionIndex];
    const hasResponse = caresResponses[currentQuestion.id] !== undefined;

    const totalQuestions = dimensionOrder.reduce((sum, dim) => sum + caresDimensions[dim].questions.length, 0);
    const completedQuestions = dimensionOrder.reduce((sum, dim, idx) => {
      const dimIndex = dimensionOrder.indexOf(currentDimension);
      if (idx < dimIndex) {
        return sum + caresDimensions[dim].questions.length;
      } else if (idx === dimIndex) {
        return sum + currentQuestionIndex;
      }
      return sum;
    }, 0);

    const progress = ((completedQuestions + 1) / totalQuestions) * 100;

    return (
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">Step 3 of 4</span>
              <span className="text-sm font-medium text-slate-400">
                {dimension.letter} - {dimension.title}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-600 transition-all duration-300"
                style={{ width: `${50 + (progress * 0.25)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-600/20 rounded-full mb-4">
              <span className="text-3xl font-bold text-slate-400">{dimension.letter}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {dimension.title}
            </h1>
            <p className="text-gray-400">
              {dimension.description}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white">{currentQuestion.text}</h2>
              <span className="text-sm text-gray-500">
                {currentQuestionIndex + 1}/{dimension.questions.length}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Fear-Based</span>
                <span>Healthy</span>
              </div>
              <div className="grid grid-cols-11 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleCaresResponse(currentQuestion.id, value)}
                    className={`aspect-square rounded-lg border-2 transition-all ${
                      caresResponses[currentQuestion.id] === value
                        ? 'border-slate-600 bg-slate-600 text-white'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50 text-gray-400'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleCaresPrevious}
              disabled={currentDimension === 'stress' && currentQuestionIndex === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleCaresNext}
              disabled={!hasResponse}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentDimension === 'empowerment' && currentQuestionIndex === dimension.questions.length - 1
                ? 'Complete Assessment'
                : 'Next'}
            </button>
          </div>
        </div>
      </section>
    );
  };

  const renderCaresResults = () => {
    const lowestScore = Object.entries(caresScores).reduce((min, [key, val]) =>
      val < min.val ? { key, val } : min,
      { key: dimensionOrder[0], val: caresScores[dimensionOrder[0]] }
    );

    const highestScore = Object.entries(caresScores).reduce((max, [key, val]) =>
      val > max.val ? { key, val } : max,
      { key: dimensionOrder[0], val: caresScores[dimensionOrder[0]] }
    );

    return (
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">Step 4 of 4</span>
              <span className="text-sm font-medium text-slate-400">Your Leadership Profile</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-slate-600 transition-all duration-300" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your CARES Leadership Profile
            </h1>
            <p className="text-gray-400">
              A comprehensive view of your leadership patterns
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {dimensionOrder.map(dim => {
              const dimension = caresDimensions[dim];
              const score = caresScores[dim];
              const interpretation = getScoreInterpretation(score);

              return (
                <div key={dim} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-600/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-400">{dimension.letter}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{dimension.title}</h3>
                        <p className="text-sm text-gray-400">{dimension.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{score}</div>
                      <div className="text-xs text-gray-500">/ 10</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Fear-Based</span>
                      <span>Healthy</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                        style={{ width: `${(score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className={`text-sm font-semibold mb-1 ${interpretation.color}`}>
                      {interpretation.level}
                    </div>
                    <p className="text-sm text-gray-300">
                      {getDimensionInsight(dim, score)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-600/30 rounded-lg p-6">
              <h3 className="text-sm font-medium text-red-400 uppercase tracking-wider mb-2">Primary Focus Area</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-red-400">
                    {caresDimensions[lowestScore.key].letter}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {caresDimensions[lowestScore.key].title}
                  </h4>
                  <p className="text-sm text-gray-300">Score: {lowestScore.val}/10</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                You are currently experiencing the most friction in this dimension.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-600/30 rounded-lg p-6">
              <h3 className="text-sm font-medium text-green-400 uppercase tracking-wider mb-2">Leadership Strength</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-green-400">
                    {caresDimensions[highestScore.key].letter}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {caresDimensions[highestScore.key].title}
                  </h4>
                  <p className="text-sm text-gray-300">Score: {highestScore.val}/10</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                Your strongest leadership pattern is in this dimension.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEmailModal(true)}
            className="btn-primary w-full"
          >
            Get Full Report & Recommendations
          </button>
        </div>
      </section>
    );
  };

  const renderEmailModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">
          Get Your Full Report
        </h2>
        <p className="text-gray-400 mb-6">
          Enter your email to receive your complete CARES leadership assessment, personalized recommendations, and chapter suggestions.
        </p>
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-600 mb-4"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowEmailModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Send Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderFinalRecommendations = () => {
    const lowestScore = Object.entries(caresScores).reduce((min, [key, val]) =>
      val < min.val ? { key, val } : min,
      { key: dimensionOrder[0], val: caresScores[dimensionOrder[0]] }
    );

    const profile = getProfileData();
    const recommendations = getRecommendedChapters(lowestScore.key);

    return (
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Personalized Action Plan
            </h1>
            <p className="text-lg text-gray-400">
              Based on your complete CARES leadership assessment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-sm font-medium text-gray-400 mb-2">SCARE Score</div>
              <div className="text-4xl font-bold text-white mb-1">{scareScore}</div>
              <div className="text-sm text-gray-500">{profile.label}</div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-sm font-medium text-gray-400 mb-2">Focus Area</div>
              <div className="text-3xl font-bold text-white mb-1">
                {caresDimensions[lowestScore.key].letter}
              </div>
              <div className="text-sm text-gray-500">{caresDimensions[lowestScore.key].title}</div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-sm font-medium text-gray-400 mb-2">Score</div>
              <div className="text-4xl font-bold text-white mb-1">{lowestScore.val}</div>
              <div className="text-sm text-gray-500">/ 10</div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Recommended Chapters</h2>
            <p className="text-gray-400 mb-8">
              These chapters from SCARE to CARES will help you strengthen your {caresDimensions[lowestScore.key].title.toLowerCase()}.
            </p>

            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-600/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-400">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-400 mb-1">{rec.chapter}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{rec.title}</h3>
                      <p className="text-gray-400 mb-3">{rec.summary}</p>
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                        <p className="text-sm text-gray-300"><span className="font-medium text-white">Why this matters:</span> {rec.reason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-slate-600/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Get the Book</h3>
                <p className="text-sm text-gray-400 mb-4">Complete leadership toolkit with frameworks and practical exercises</p>
                <button
                  onClick={handleToolkitClick}
                  className="btn-primary text-sm w-full"
                >
                  Access Toolkit
                </button>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-slate-600/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Join Workshop</h3>
                <p className="text-sm text-gray-400 mb-4">Cohort-based training on the CARES framework with peer leaders</p>
                <button
                  onClick={handleWorkshopClick}
                  className="btn-secondary text-sm w-full"
                >
                  Join Waitlist
                </button>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-slate-600/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">1:1 Strategy Session</h3>
                <p className="text-sm text-gray-400 mb-4">Work directly with Saby on your specific transformation challenges</p>
                <button
                  onClick={handleCoachingClick}
                  className="btn-primary text-sm w-full"
                >
                  Book with Saby
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Continue Exploring</h2>
            <p className="text-gray-400 mb-6">
              Return to the homepage to learn more about the CARES framework and leadership transformation.
            </p>
            <button onClick={() => window.location.href = '/'} className="btn-secondary">
              Return to Home
            </button>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {stage === 'intro' && renderIntro()}
      {stage === 'scare-assessment' && renderScareAssessment()}
      {stage === 'scare-results' && renderScareResults()}
      {stage === 'cares-assessment' && renderCaresAssessment()}
      {stage === 'cares-results' && renderCaresResults()}
      {stage === 'final-recommendations' && renderFinalRecommendations()}
      {showEmailModal && renderEmailModal()}
    </div>
  );
}
