import { useState, useEffect } from 'react';
import {
  scareQuestions,
  focusedAssessmentQuestions,
  calculateScareScore,
  calculateScareIndex,
  determineFocusArea,
  scareDimensions,
  caresDimensions,
  getRecommendedChapters,
  resultProfiles,
  nextStepResources
} from '../data/diagnosticData';
import LeadCaptureModal from '../components/LeadCaptureModal';
import { captureLeadAndEvent } from '../services/eventTracking';
import * as analytics from '../services/analytics';

export default function Diagnostic() {
  const [stage, setStage] = useState('intro');
  const [scareResponses, setScareResponses] = useState({});
  const [scareScore, setScareScore] = useState(null);
  const [scareIndex, setScareIndex] = useState(null);
  const [focusArea, setFocusArea] = useState(null);
  const [focusedResponses, setFocusedResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [emailData, setEmailData] = useState({
    firstName: '',
    email: '',
    role: '',
    company: '',
    challenge: ''
  });
  const [dimensionScores, setDimensionScores] = useState({});
  const [leadId, setLeadId] = useState(null);
  const [showToolkitModal, setShowToolkitModal] = useState(false);
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);

  useEffect(() => {
    if (stage === 'assessment') {
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

    const dimensions = {};
    scareQuestions.forEach((q) => {
      if (scareResponses[q.id]) {
        dimensions[q.dimension] = scareResponses[q.id];
      }
    });

    setDimensionScores(dimensions);
    setScareScore(score);
    setScareIndex(index);
    setFocusArea(focus);
    setStage('score');

    analytics.trackDiagnosticComplete(score, focus);
  };

  const handleFocusedResponse = (questionId, value) => {
    setFocusedResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleFocusedNext = () => {
    const questions = focusedAssessmentQuestions[focusArea];
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setStage('email');
    }
  };

  const handleFocusedPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const result = await captureLeadAndEvent(
      {
        email: emailData.email,
        name: emailData.firstName,
        role: emailData.role,
        company: emailData.company,
      },
      {
        action_type: 'diagnostic_completed',
        scare_score: scareScore,
        scare_index: scareIndex,
        focus_area: focusArea,
        metadata: {
          challenge: emailData.challenge,
        },
      }
    );

    if (result.success) {
      setLeadId(result.leadId);
    }

    setStage('recommendations');
  };

  const handleToolkitDownload = async (formData) => {
    analytics.trackActionClick('toolkit_download', scareScore, focusArea);

    const result = await captureLeadAndEvent(
      {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        company: formData.company,
      },
      {
        action_type: 'toolkit_download',
        scare_score: scareScore,
        scare_index: scareIndex,
        focus_area: focusArea,
      }
    );

    if (result.success) {
      setLeadId(result.leadId);
      analytics.trackLeadCapture('toolkit_download', formData.email);
      window.open('https://sabywaraich.com/resources', '_blank');
    }

    setShowToolkitModal(false);
  };

  const handleWorkshopWaitlist = async (formData) => {
    analytics.trackActionClick('workshop_waitlist', scareScore, focusArea);

    const result = await captureLeadAndEvent(
      {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        company: formData.company,
      },
      {
        action_type: 'workshop_waitlist',
        scare_score: scareScore,
        scare_index: scareIndex,
        focus_area: focusArea,
      }
    );

    if (result.success) {
      analytics.trackLeadCapture('workshop_waitlist', formData.email);
    }

    setShowWorkshopModal(false);
    alert('Thank you for your interest! We\'ll be in touch soon with workshop details.');
  };

  const handleCoachingRequest = async () => {
    analytics.trackActionClick('coaching_request', scareScore, focusArea);

    if (leadId) {
      const result = await captureLeadAndEvent(
        {
          email: emailData.email,
          name: emailData.firstName,
          role: emailData.role,
          company: emailData.company,
        },
        {
          action_type: 'coaching_request',
          scare_score: scareScore,
          scare_index: scareIndex,
          focus_area: focusArea,
        }
      );

      if (result.success) {
        analytics.trackLeadCapture('coaching_request', emailData.email);
      }
    }

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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/10 border border-primary-600/30 rounded-full mb-6">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm font-medium text-primary-400">3-minute diagnostic</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            SCARE to CARES Diagnostic
          </h1>
          <p className="text-xl text-gray-400 mb-4">
            Identify your transformation friction points and discover which CARES practice will unlock your next breakthrough.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">What You'll Discover</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-sm font-semibold">1</div>
              <div>
                <h3 className="font-medium text-white mb-1">Your SCARE Score</h3>
                <p className="text-sm text-gray-400">An early signal of transformation friction in your environment</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-sm font-semibold">2</div>
              <div>
                <h3 className="font-medium text-white mb-1">Your Primary Focus Area</h3>
                <p className="text-sm text-gray-400">Which CARES dimension matters most for your current context</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-sm font-semibold">3</div>
              <div>
                <h3 className="font-medium text-white mb-1">Personalized Recommendations</h3>
                <p className="text-sm text-gray-400">Specific chapters, tools, and next steps for your situation</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStage('assessment')}
          className="btn-primary w-full"
        >
          Start Diagnostic
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Based on the SCARE to CARES framework by Saby Waraich
        </p>
      </div>
    </section>
  );

  const renderAssessment = () => {
    const allAnswered = scareQuestions.every(q => scareResponses[q.id]);

    return (
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">Step 1 of 3</span>
              <span className="text-sm font-medium text-primary-400">Quick Assessment</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: '33%' }}></div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Quick SCARE Assessment
            </h1>
            <p className="text-gray-400">
              Answer these 5 questions to identify friction points in your transformation environment
            </p>
          </div>

          <div className="space-y-8">
            {scareQuestions.map((question, index) => (
              <div key={question.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-sm font-semibold">
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
                          ? 'border-primary-600 bg-primary-600/10'
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
                          ? 'border-primary-600'
                          : 'border-gray-600'
                      }`}>
                        {scareResponses[question.id] === option.value && (
                          <div className="w-3 h-3 rounded-full bg-primary-600"></div>
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
              Calculate My Score
            </button>
          </div>
        </div>
      </section>
    );
  };

  const renderScore = () => {
    const profile = getProfileData();

    return (
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">Step 2 of 3</span>
              <span className="text-sm font-medium text-primary-400">Results Analysis</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: '66%' }}></div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Your SCARE Score
            </h1>
            <p className="text-gray-400">
              An early signal of transformation friction
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary-600/20 to-primary-800/20 border border-primary-600/30 rounded-lg p-8 mb-8">
            <div className="text-center">
              <div className="text-7xl font-bold text-white mb-2">{scareScore}</div>
              <div className="text-xl text-gray-300 mb-4">out of 20</div>
              <div className="inline-block px-4 py-2 bg-white/10 rounded-full">
                <span className="text-sm font-medium text-white">{profile.label}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">SCARE Index</h2>
            <div className="mb-6">
              <div className="flex items-end justify-between mb-2">
                <span className="text-4xl font-bold text-white">{scareIndex}</span>
                <span className="text-gray-400">/ 100</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
                  style={{ width: `${scareIndex}%` }}
                ></div>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{profile.summary}</p>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Dimension Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(dimensionScores).map(([dimension, score]) => (
                  <div key={dimension}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300 capitalize">{dimension}</span>
                      <span className="text-sm text-gray-400">{score}/4</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 transition-all duration-500"
                        style={{ width: `${(score / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">What This Suggests</h2>
            <p className="text-gray-300 mb-4">{profile.recommendation}</p>
            <p className="text-sm text-gray-400">
              The next step will identify which CARES practice is most relevant for your context.
            </p>
          </div>

          <button
            onClick={() => setStage('focus')}
            className="btn-primary w-full"
          >
            Discover Your Focus Area
          </button>
        </div>
      </section>
    );
  };

  const renderFocus = () => {
    const area = caresDimensions.find(d => d.key === focusArea);

    return (
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Primary Focus Area
            </h1>
            <p className="text-gray-400">
              Based on your SCARE profile, this is where to focus your energy
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary-600/20 to-primary-800/20 border border-primary-600/30 rounded-lg p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">{area.label}</h2>
              <p className="text-lg text-gray-300">{area.description}</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Why This Matters Now</h3>
            <p className="text-gray-300 mb-6">
              Your SCARE assessment indicates that strengthening this dimension will have the greatest impact on reducing transformation friction in your environment.
            </p>
            <p className="text-gray-300">
              The next section will help you assess how well you are currently practicing this dimension and identify specific opportunities for growth.
            </p>
          </div>

          <button
            onClick={() => setStage('focused')}
            className="btn-primary w-full"
          >
            Continue to Focused Assessment
          </button>
        </div>
      </section>
    );
  };

  const renderFocusedAssessment = () => {
    const questions = focusedAssessmentQuestions[focusArea];
    const currentQuestion = questions[currentQuestionIndex];
    const hasResponse = focusedResponses[currentQuestion.id] !== undefined;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">Step 3 of 3</span>
              <span className="text-sm font-medium text-primary-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${66 + (progress * 0.34)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {caresDimensions.find(d => d.key === focusArea)?.label}
            </h1>
            <p className="text-gray-400">
              Focused assessment
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-xl font-medium text-white mb-6">{currentQuestion.text}</h2>

            <div className="space-y-3">
              {[
                { value: 1, label: "Needs significant improvement" },
                { value: 2, label: "Needs some improvement" },
                { value: 3, label: "Generally effective" },
                { value: 4, label: "Very effective" }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    focusedResponses[currentQuestion.id] === option.value
                      ? 'border-primary-600 bg-primary-600/10'
                      : 'border-gray-800 hover:border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.value}
                    checked={focusedResponses[currentQuestion.id] === option.value}
                    onChange={() => handleFocusedResponse(currentQuestion.id, option.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    focusedResponses[currentQuestion.id] === option.value
                      ? 'border-primary-600'
                      : 'border-gray-600'
                  }`}>
                    {focusedResponses[currentQuestion.id] === option.value && (
                      <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                    )}
                  </div>
                  <span className="text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleFocusedPrevious}
              disabled={currentQuestionIndex === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleFocusedNext}
              disabled={!hasResponse}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next'}
            </button>
          </div>
        </div>
      </section>
    );
  };

  const renderEmail = () => (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600/20 rounded-full mb-6">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Your Personalized Action Plan
          </h1>
          <p className="text-lg text-gray-400">
            Receive tailored recommendations, chapter insights, and next-step resources based on your unique profile.
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                required
                value={emailData.firstName}
                onChange={(e) => setEmailData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-600"
                placeholder="Your first name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                value={emailData.email}
                onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-600"
                placeholder="your.email@company.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                  Role *
                </label>
                <input
                  type="text"
                  id="role"
                  required
                  value={emailData.role}
                  onChange={(e) => setEmailData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-600"
                  placeholder="e.g., CIO, VP Engineering"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  required
                  value={emailData.company}
                  onChange={(e) => setEmailData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-600"
                  placeholder="Your organization"
                />
              </div>
            </div>

            <div>
              <label htmlFor="challenge" className="block text-sm font-medium text-gray-300 mb-2">
                Biggest Leadership Challenge <span className="text-gray-500">(optional)</span>
              </label>
              <textarea
                id="challenge"
                rows={4}
                value={emailData.challenge}
                onChange={(e) => setEmailData(prev => ({ ...prev, challenge: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-600 resize-none"
                placeholder="What's the biggest challenge you're facing in your transformation work?"
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="btn-primary w-full">
                Get My Action Plan
              </button>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Your information will be used to personalize your experience and send you relevant resources. We respect your privacy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );

  const renderRecommendations = () => {
    const area = caresDimensions.find(d => d.key === focusArea);
    const recommendations = getRecommendedChapters(focusArea);
    const profile = getProfileData();

    return (
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Personalized Action Plan
            </h1>
            <p className="text-lg text-gray-400">
              Based on your SCARE to CARES assessment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-sm font-medium text-gray-400 mb-2">SCARE Score</div>
              <div className="text-4xl font-bold text-white mb-1">{scareScore}</div>
              <div className="text-sm text-gray-500">out of 20</div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-sm font-medium text-gray-400 mb-2">SCARE Index</div>
              <div className="text-4xl font-bold text-white mb-1">{scareIndex}</div>
              <div className="text-sm text-gray-500">/ 100</div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-sm font-medium text-gray-400 mb-2">Profile</div>
              <div className="text-lg font-semibold text-white">{profile.label}</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-600/20 to-primary-800/20 border border-primary-600/30 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Primary Focus Area</h2>
            <h3 className="text-xl font-semibold text-primary-300 mb-4">{area.label}</h3>
            <p className="text-gray-300">{area.description}</p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Recommended Companion Resources</h2>
            <p className="text-gray-400 mb-8">
              These chapters from the book will help you strengthen your {area.shortLabel.toLowerCase()} practice and reduce transformation friction.
            </p>

            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-400">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-primary-400 mb-1">{rec.chapter}</div>
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
            <h2 className="text-2xl font-bold text-white mb-6">Practical Next Steps</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Free Leadership Toolkit</h3>
                <p className="text-sm text-gray-400 mb-4">Templates, worksheets, and practical frameworks you can use immediately</p>
                <button
                  onClick={() => {
                    analytics.trackModalOpen('toolkit_modal');
                    setShowToolkitModal(true);
                  }}
                  className="btn-secondary text-sm w-full"
                >
                  Download Toolkit
                </button>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Join Workshop Waitlist</h3>
                <p className="text-sm text-gray-400 mb-4">Get early access to cohort-based workshops on the CARES framework</p>
                <button
                  onClick={() => {
                    analytics.trackModalOpen('workshop_modal');
                    setShowWorkshopModal(true);
                  }}
                  className="btn-secondary text-sm w-full"
                >
                  Join Waitlist
                </button>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Book 1:1 Strategy Session</h3>
                <p className="text-sm text-gray-400 mb-4">Work directly with Saby to address your specific transformation challenges</p>
                <button
                  onClick={handleCoachingRequest}
                  className="btn-primary text-sm w-full"
                >
                  Schedule Call
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Want to Learn More?</h2>
            <p className="text-gray-400 mb-6">
              Return to the homepage to explore the full CARES framework and discover how it can transform your leadership approach.
            </p>
            <button onClick={() => window.location.href = '/'} className="btn-primary">
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
      {stage === 'assessment' && renderAssessment()}
      {stage === 'score' && renderScore()}
      {stage === 'focus' && renderFocus()}
      {stage === 'focused' && renderFocusedAssessment()}
      {stage === 'email' && renderEmail()}
      {stage === 'recommendations' && renderRecommendations()}

      <LeadCaptureModal
        isOpen={showToolkitModal}
        onClose={() => {
          analytics.trackModalClose('toolkit_modal');
          setShowToolkitModal(false);
        }}
        onSubmit={handleToolkitDownload}
        title="Download Leadership Toolkit"
        description="Get instant access to templates, worksheets, and frameworks to strengthen your leadership practice."
        submitButtonText="Download"
      />

      <LeadCaptureModal
        isOpen={showWorkshopModal}
        onClose={() => {
          analytics.trackModalClose('workshop_modal');
          setShowWorkshopModal(false);
        }}
        onSubmit={handleWorkshopWaitlist}
        title="Join Workshop Waitlist"
        description="Be the first to know when we launch cohort-based workshops on the CARES framework."
        submitButtonText="Join Waitlist"
      />
    </div>
  );
}
