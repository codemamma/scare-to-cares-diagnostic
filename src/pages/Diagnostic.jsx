import { useState } from 'react';
import {
  scareQuestions,
  focusedAssessmentQuestions,
  calculateScareScore,
  calculateScareIndex,
  determineFocusArea,
  getInterpretationBand,
  scareDimensions,
  caresDimensions,
  getRecommendedChapters
} from '../data/diagnosticData';

export default function Diagnostic() {
  const [step, setStep] = useState(1);
  const [scareAnswers, setScareAnswers] = useState({});
  const [focusedAnswers, setFocusedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scareScore, setScareScore] = useState(0);
  const [scareIndex, setScareIndex] = useState(0);
  const [focusArea, setFocusArea] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [challenge, setChallenge] = useState('');

  const totalSteps = 7;

  const handleScareAnswer = (questionId, value) => {
    setScareAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const completeScareQuestions = () => {
    const score = calculateScareScore(scareAnswers);
    const index = calculateScareIndex(score);
    const focus = determineFocusArea(scareAnswers, index);

    setScareScore(score);
    setScareIndex(index);
    setFocusArea(focus);
    setStep(2);
  };

  const handleFocusedAnswer = (value) => {
    const questions = focusedAssessmentQuestions[focusArea];
    const currentQuestion = questions[currentQuestionIndex];

    setFocusedAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const nextFocusedQuestion = () => {
    const questions = focusedAssessmentQuestions[focusArea];
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep(5);
    }
  };

  const previousFocusedQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email && firstName) {
      setStep(7);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {step} of {totalSteps}</span>
            <span className="text-sm text-gray-400">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-600 to-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="card">
            <h2 className="text-3xl font-bold text-white mb-4">Quick SCARE Assessment</h2>
            <p className="text-gray-300 mb-8">
              Answer these 5 questions to get your initial SCARE Score (1-20).
            </p>

            <div className="space-y-8">
              {scareQuestions.map((question) => (
                <div key={question.id} className="border-b border-gray-800 pb-8 last:border-0">
                  <p className="text-lg text-white mb-4 font-medium">
                    {question.text}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleScareAnswer(question.id, option.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          scareAnswers[question.id] === option.value
                            ? 'border-primary-500 bg-primary-900/30 text-white'
                            : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={completeScareQuestions}
              disabled={Object.keys(scareAnswers).length < scareQuestions.length}
              className="btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Analysis
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <h2 className="text-3xl font-bold text-white mb-4">Your SCARE Analysis</h2>

            <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-800 rounded-xl p-8 mb-8">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-white mb-2">{scareScore} / 20</div>
                <div className="text-xl text-gray-300">SCARE Score</div>
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">{scareIndex} / 100</div>
                <div className="text-xl text-gray-300 mb-4">SCARE Index</div>
                <div className={`text-lg font-semibold ${getInterpretationBand(scareIndex).color}`}>
                  {getInterpretationBand(scareIndex).label}
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6">Diagnostic Dimensions</h3>
            <div className="space-y-4 mb-8">
              {scareDimensions.map((dim) => {
                const question = scareQuestions.find(q => q.dimension === dim.key);
                const score = scareAnswers[question?.id] || 0;
                const percentage = (score / 4) * 100;

                return (
                  <div key={dim.key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium">{dim.label}</span>
                      <span className="text-gray-400">{score} / 4</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-red-600 to-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{dim.description}</p>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setStep(3)} className="btn-primary w-full">
              Identify Focus Area
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <h2 className="text-3xl font-bold text-white mb-4">Primary CARES Focus Area</h2>

            <div className="bg-gradient-to-br from-primary-900/30 to-primary-800/30 border border-primary-700 rounded-xl p-8 mb-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-400 mb-4">{focusArea}</div>
                <p className="text-xl text-gray-300">
                  {caresDimensions.find(d => d.key === focusArea)?.longDescription}
                </p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Why This Matters</h3>
              <p className="text-gray-300 leading-relaxed">
                Based on your SCARE assessment, strengthening <span className="text-primary-400 font-semibold">{focusArea}</span> will
                have the greatest impact on reducing friction and building resilience in your leadership
                and organization.
              </p>
            </div>

            <button onClick={() => setStep(4)} className="btn-primary w-full">
              Continue to Focused Assessment
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="card">
            <h2 className="text-3xl font-bold text-white mb-2">Focused Assessment</h2>
            <p className="text-primary-400 font-semibold mb-8">{focusArea}</p>

            {(() => {
              const questions = focusedAssessmentQuestions[focusArea];
              const currentQuestion = questions[currentQuestionIndex];
              const currentAnswer = focusedAnswers[currentQuestion.id];

              return (
                <>
                  <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
                      <div
                        className="bg-gradient-to-r from-primary-600 to-primary-500 h-2 rounded-full transition-all"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                      />
                    </div>

                    <p className="text-2xl text-white mb-8 leading-relaxed">
                      {currentQuestion.text}
                    </p>

                    <div className="space-y-3">
                      {[
                        { value: 1, label: "Needs significant improvement" },
                        { value: 2, label: "Needs some improvement" },
                        { value: 3, label: "Generally effective" },
                        { value: 4, label: "Very effective" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFocusedAnswer(option.value)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            currentAnswer === option.value
                              ? 'border-primary-500 bg-primary-900/30 text-white'
                              : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={previousFocusedQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextFocusedQuestion}
                      disabled={!currentAnswer}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {step === 5 && (
          <div className="card">
            <h2 className="text-3xl font-bold text-white mb-8">Your Leadership Insight</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{scareScore} / 20</div>
                <div className="text-sm text-gray-400">SCARE Score</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{scareIndex} / 100</div>
                <div className="text-sm text-gray-400">SCARE Index</div>
              </div>
              <div className="bg-gray-900 border border-primary-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-primary-400 mb-2">{focusArea}</div>
                <div className="text-sm text-gray-400">Focus Area</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-900/20 to-primary-800/20 border border-primary-800 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Summary</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your assessment indicates {getInterpretationBand(scareIndex).label.toLowerCase()} in your
                current leadership environment. The most impactful area for you to strengthen is{' '}
                <span className="text-primary-400 font-semibold">{focusArea}</span>.
              </p>
              <p className="text-gray-300 leading-relaxed">
                {caresDimensions.find(d => d.key === focusArea)?.longDescription}
              </p>
            </div>

            <button onClick={() => setStep(6)} className="btn-primary w-full">
              Get Your Action Plan
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="card">
            <h2 className="text-3xl font-bold text-white mb-4">Get Your Personalized Action Plan</h2>
            <p className="text-gray-300 mb-8">
              Enter your details to receive your CARES action plan and recommendations.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Biggest Leadership Challenge (optional)
                </label>
                <textarea
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Get My Action Plan
              </button>
            </form>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-3xl font-bold text-white mb-4">Your CARES Action Plan</h2>
              <p className="text-gray-300 mb-8">
                Based on your diagnostic, these are the most relevant next steps for you.
              </p>

              <div className="bg-gradient-to-br from-primary-900/20 to-primary-800/20 border border-primary-800 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Your Focus: {focusArea}</h3>
                <p className="text-gray-300">
                  {caresDimensions.find(d => d.key === focusArea)?.longDescription}
                </p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-2xl font-bold text-white mb-6">Recommended Insights</h3>
              <div className="space-y-4">
                {getRecommendedChapters(focusArea).map((rec, idx) => (
                  <div key={idx} className="bg-gray-900 border border-gray-800 rounded-lg p-6 card-hover">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm text-primary-400 font-semibold mb-1">{rec.chapter}</div>
                        <h4 className="text-xl font-bold text-white mb-2">{rec.title}</h4>
                        <p className="text-gray-400">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card card-hover">
                <h3 className="text-xl font-bold text-white mb-3">CARES Leadership Toolkit</h3>
                <p className="text-gray-400 mb-6">
                  Practical frameworks and templates to strengthen your leadership capacity.
                </p>
                <button className="btn-secondary w-full">
                  Download Toolkit
                </button>
              </div>

              <div className="card card-hover">
                <h3 className="text-xl font-bold text-white mb-3">CARES Workshop</h3>
                <p className="text-gray-400 mb-6">
                  Join a deep-dive workshop to transform your approach to leading change.
                </p>
                <button className="btn-secondary w-full">
                  Join Waitlist
                </button>
              </div>

              <div className="card card-hover">
                <h3 className="text-xl font-bold text-white mb-3">Strategy Session with Saby</h3>
                <p className="text-gray-400 mb-6">
                  Work directly with Saby Waraich to address your specific challenges.
                </p>
                <button className="btn-secondary w-full">
                  Request a 1:1
                </button>
              </div>

              <div className="card card-hover border-primary-800">
                <h3 className="text-xl font-bold text-white mb-3">Explore the Companion App</h3>
                <p className="text-gray-400 mb-6">
                  Access additional insights and tools from the CARES framework.
                </p>
                <button className="btn-secondary w-full">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
