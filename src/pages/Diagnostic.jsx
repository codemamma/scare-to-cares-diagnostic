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
    <div className="min-h-screen bg-black py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-12">
          <div className="glass-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">Step {step} of {totalSteps}</span>
              <span className="text-sm font-semibold text-primary-400">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 h-3 rounded-full transition-all duration-500 shadow-lg shadow-primary-500/20"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="card card-hover animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Quick SCARE Assessment</h2>
              <p className="text-gray-400">Answer 5 quick questions to get your initial score</p>
            </div>

            <div className="space-y-8">
              {scareQuestions.map((question, qIdx) => (
                <div key={question.id} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-primary-400">{qIdx + 1}</span>
                    </div>
                    <p className="text-lg text-white font-medium leading-relaxed pt-1">
                      {question.text}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-11">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleScareAnswer(question.id, option.value)}
                        className={`p-4 rounded-xl border-2 transition-all font-medium text-center ${
                          scareAnswers[question.id] === option.value
                            ? 'border-primary-500 bg-primary-900/40 text-white shadow-lg shadow-primary-500/20'
                            : 'border-gray-700/50 bg-gray-800/30 text-gray-300 hover:border-primary-500/50 hover:bg-gray-800/50'
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
              className="btn-primary w-full mt-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Continue to Analysis →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="card">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Your SCARE Analysis</h2>
                <p className="text-gray-400">Here's what your assessment reveals</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 p-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-600/10 rounded-full blur-2xl" />
                  <div className="relative z-10 text-center">
                    <div className="text-6xl font-bold text-white mb-2">{scareScore}</div>
                    <div className="text-sm text-gray-400 mb-1">out of 20</div>
                    <div className="text-lg text-gray-300 font-semibold">SCARE Score</div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/40 to-primary-800/40 border border-primary-700/50 p-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
                  <div className="relative z-10 text-center">
                    <div className="text-6xl font-bold text-primary-300 mb-2">{scareIndex}</div>
                    <div className="text-sm text-gray-400 mb-1">out of 100</div>
                    <div className="text-lg text-gray-300 font-semibold">SCARE Index</div>
                  </div>
                </div>
              </div>

              <div className="glass-card mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-lg font-bold ${getInterpretationBand(scareIndex).color}`}>
                    {getInterpretationBand(scareIndex).label}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  This indicates the level of friction in your current environment
                </p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-2xl font-bold text-white mb-6">Diagnostic Dimensions</h3>
              <div className="space-y-5">
                {scareDimensions.map((dim) => {
                  const question = scareQuestions.find(q => q.dimension === dim.key);
                  const score = scareAnswers[question?.id] || 0;
                  const percentage = (score / 4) * 100;

                  return (
                    <div key={dim.key} className="glass-card">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white font-semibold text-lg">{dim.label}</span>
                        <span className="text-gray-400 font-mono text-sm bg-gray-800/50 px-3 py-1 rounded-lg">
                          {score} / 4
                        </span>
                      </div>
                      <div className="w-full bg-gray-800/50 rounded-full h-3 mb-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary-600 to-primary-400 h-3 rounded-full transition-all duration-700 shadow-lg shadow-primary-500/20"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-400">{dim.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={() => setStep(3)} className="btn-primary w-full">
              Identify Focus Area →
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="card card-hover animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Primary CARES Focus Area</h2>
              <p className="text-gray-400">Based on your assessment, here's where to focus</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/40 to-primary-800/40 border border-primary-700/50 p-10 mb-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
              <div className="relative z-10 text-center">
                <div className="inline-block px-6 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full mb-6">
                  <span className="text-sm font-semibold text-primary-300">Your Focus Area</span>
                </div>
                <div className="text-5xl font-bold gradient-text mb-6">{focusArea}</div>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  {caresDimensions.find(d => d.key === focusArea)?.longDescription}
                </p>
              </div>
            </div>

            <div className="glass-card mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Why This Matters</h3>
              <p className="text-gray-300 leading-relaxed">
                Based on your SCARE assessment, strengthening <span className="text-primary-400 font-semibold">{focusArea}</span> will
                have the greatest impact on reducing friction and building resilience in your leadership
                and organization.
              </p>
            </div>

            <button onClick={() => setStep(4)} className="btn-primary w-full">
              Continue to Focused Assessment →
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="card card-hover animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Focused Assessment</h2>
              <p className="text-primary-400 font-semibold">{focusArea}</p>
            </div>

            {(() => {
              const questions = focusedAssessmentQuestions[focusArea];
              const currentQuestion = questions[currentQuestionIndex];
              const currentAnswer = focusedAnswers[currentQuestion.id];

              return (
                <>
                  <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-3">
                      <span className="font-medium">Question {currentQuestionIndex + 1} of {questions.length}</span>
                      <span className="font-mono">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-800/50 rounded-full h-2 mb-10 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary-600 to-primary-400 h-2 rounded-full transition-all duration-500 shadow-lg shadow-primary-500/20"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                      />
                    </div>

                    <div className="glass-card mb-8">
                      <p className="text-2xl text-white font-semibold leading-relaxed">
                        {currentQuestion.text}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { value: 1, label: "Needs significant improvement", emoji: "🔴" },
                        { value: 2, label: "Needs some improvement", emoji: "🟡" },
                        { value: 3, label: "Generally effective", emoji: "🟢" },
                        { value: 4, label: "Very effective", emoji: "✨" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFocusedAnswer(option.value)}
                          className={`w-full p-5 rounded-xl border-2 text-left transition-all group ${
                            currentAnswer === option.value
                              ? 'border-primary-500 bg-primary-900/40 text-white shadow-lg shadow-primary-500/20'
                              : 'border-gray-700/50 bg-gray-800/30 text-gray-300 hover:border-primary-500/50 hover:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{option.emoji}</span>
                            <span className="font-medium text-lg">{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={previousFocusedQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="btn-secondary flex-1 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={nextFocusedQuestion}
                      disabled={!currentAnswer}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment →' : 'Next →'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="card">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Your Leadership Insight</h2>
                <p className="text-gray-400">Summary of your assessment results</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="glass-card text-center">
                  <div className="text-4xl font-bold text-white mb-2">{scareScore}</div>
                  <div className="text-xs text-gray-500 mb-1">out of 20</div>
                  <div className="text-sm text-gray-400">SCARE Score</div>
                </div>
                <div className="glass-card text-center">
                  <div className="text-4xl font-bold text-primary-400 mb-2">{scareIndex}</div>
                  <div className="text-xs text-gray-500 mb-1">out of 100</div>
                  <div className="text-sm text-gray-400">SCARE Index</div>
                </div>
                <div className="glass-card text-center border-primary-700/50">
                  <div className="text-2xl font-bold text-primary-400 mb-2">{focusArea}</div>
                  <div className="text-xs text-gray-500 mb-1">primary area</div>
                  <div className="text-sm text-gray-400">Focus Area</div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/30 to-primary-800/30 border border-primary-700/50 p-8">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-2xl" />
                <div className="relative z-10">
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
              </div>
            </div>

            <button onClick={() => setStep(6)} className="btn-primary w-full">
              Get Your Action Plan →
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="card card-hover animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Get Your Personalized Action Plan</h2>
              <p className="text-gray-400">Receive detailed insights and recommendations</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder="e.g., CIO, Program Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Biggest Leadership Challenge (optional)
                </label>
                <textarea
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                  placeholder="Share your current challenge..."
                />
              </div>

              <button type="submit" className="btn-primary w-full mt-4">
                Get My Action Plan →
              </button>
            </form>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-8 animate-fade-in">
            <div className="card">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Your CARES Action Plan</h2>
                <p className="text-gray-300">Based on your diagnostic, these are the most relevant next steps for you.</p>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/30 to-primary-800/30 border border-primary-700/50 p-8 mb-8">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="inline-block px-4 py-1.5 bg-primary-500/20 border border-primary-500/30 rounded-full mb-3">
                    <span className="text-xs font-semibold text-primary-300">YOUR FOCUS</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{focusArea}</h3>
                  <p className="text-gray-300">
                    {caresDimensions.find(d => d.key === focusArea)?.longDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-2xl font-bold text-white mb-6">Recommended Insights</h3>
              <div className="space-y-4">
                {getRecommendedChapters(focusArea).map((rec, idx) => (
                  <div key={idx} className="glass-card card-hover group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-primary-400 mb-2">{rec.chapter}</div>
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                          {rec.title}
                        </h4>
                        <p className="text-gray-400 text-sm">{rec.description}</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 ml-4">
                        <span className="text-primary-400">→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card card-hover group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                    <span className="text-xl">🛠️</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">CARES Leadership Toolkit</h3>
                </div>
                <p className="text-gray-400 mb-6 text-sm">
                  Practical frameworks and templates to strengthen your leadership capacity.
                </p>
                <button className="btn-secondary w-full">
                  Download Toolkit
                </button>
              </div>

              <div className="glass-card card-hover group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                    <span className="text-xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">CARES Workshop</h3>
                </div>
                <p className="text-gray-400 mb-6 text-sm">
                  Join a deep-dive workshop to transform your approach to leading change.
                </p>
                <button className="btn-secondary w-full">
                  Join Waitlist
                </button>
              </div>

              <div className="glass-card card-hover group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Strategy Session</h3>
                </div>
                <p className="text-gray-400 mb-6 text-sm">
                  Work directly with Saby Waraich to address your specific challenges.
                </p>
                <button className="btn-secondary w-full">
                  Request a 1:1
                </button>
              </div>

              <div className="glass-card card-hover border-primary-700/50 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Companion App</h3>
                </div>
                <p className="text-gray-400 mb-6 text-sm">
                  Access additional insights and tools from the CARES framework.
                </p>
                <button className="btn-secondary w-full opacity-60 cursor-not-allowed">
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
