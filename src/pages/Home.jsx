import heroImg from '../assets/hero.png';

export default function Home({ onStartDiagnostic }) {
  const scareItems = [
    {
      title: "Stress",
      description: "Overwhelmed by constant pressure and change"
    },
    {
      title: "Confusion",
      description: "Unclear priorities and mixed messages"
    },
    {
      title: "Anxiety",
      description: "Fear of failure and unknown outcomes"
    },
    {
      title: "Resistance",
      description: "Pushback and lack of buy-in"
    },
    {
      title: "Ego",
      description: "Defensive reactions and blame"
    }
  ];

  const caresItems = [
    {
      title: "Communicate",
      description: "Clearly and consistently share context"
    },
    {
      title: "Adjust",
      description: "Adapt when conditions change"
    },
    {
      title: "Relate",
      description: "Build strong working relationships"
    },
    {
      title: "Empower",
      description: "Give people ownership and trust"
    },
    {
      title: "Stay Calm",
      description: "Lead with composure under pressure"
    }
  ];

  const audiences = [
    { title: "CIOs", description: "Navigate technology transformation with confidence", icon: "💼" },
    { title: "Transformation Leaders", description: "Lead change initiatives that stick", icon: "🎯" },
    { title: "Program Managers", description: "Deliver complex programs successfully", icon: "📊" },
    { title: "Executive Teams", description: "Build organizational resilience", icon: "🏢" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <img src={heroImg} alt="" className="w-32 h-32 opacity-80" />
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            CARES Leadership
            <span className="block gradient-text">Diagnostic</span>
          </h1>

          <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            A practical leadership diagnostic inspired by the SCARE to CARES framework
            to help leaders identify transformation friction and focus on what to strengthen next.
          </p>

          <p className="text-sm text-gray-400 mb-12 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-primary-500 rounded-full" />
            Designed for leaders navigating transformation, alignment, and change under pressure
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onStartDiagnostic} className="btn-primary text-lg">
              Start Diagnostic →
            </button>
            <a
              href="https://sabywaraich.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg"
            >
              Visit Saby's Website
            </a>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">
              From SCARE to CARES
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Understanding the shift from dysfunction to high performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card card-hover border-red-900/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-3xl font-bold text-red-400">SCARE</h3>
                </div>

                <p className="text-gray-400 mb-8 text-sm">
                  Patterns that create friction, resistance, and burnout
                </p>

                <div className="space-y-4">
                  {scareItems.map((item, idx) => (
                    <div key={idx} className="group">
                      <div className="bg-gray-900/50 border border-red-900/30 rounded-xl p-4 transition-all duration-300 hover:border-red-500/50 hover:bg-red-950/20">
                        <h4 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          {item.title}
                        </h4>
                        <p className="text-gray-400 text-sm pl-3.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card card-hover border-primary-900/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-3xl font-bold text-primary-400">CARES</h3>
                </div>

                <p className="text-gray-400 mb-8 text-sm">
                  Principles that build resilience, alignment, and trust
                </p>

                <div className="space-y-4">
                  {caresItems.map((item, idx) => (
                    <div key={idx} className="group">
                      <div className="bg-gray-900/50 border border-primary-900/30 rounded-xl p-4 transition-all duration-300 hover:border-primary-500/50 hover:bg-primary-950/20">
                        <h4 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                          {item.title}
                        </h4>
                        <p className="text-gray-400 text-sm pl-3.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary-900/10 to-transparent opacity-50" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-6">
              Why This Matters
            </h2>
          </div>

          <div className="card card-hover">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">The Real Challenge</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Transformation often breaks down not because of technology, but because leaders
                    and teams fall into patterns of stress, confusion, resistance, and blame.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">The Path Forward</h3>
                  <p className="text-gray-300 leading-relaxed">
                    This diagnostic helps identify these patterns and point toward practical next steps
                    that strengthen your leadership capacity and organizational resilience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">
              Who It's For
            </h2>
            <p className="text-lg text-gray-400">
              Built for leaders navigating complex change
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((audience, idx) => (
              <div key={idx} className="glass-card card-hover text-center group">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {audience.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {audience.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-600/10 rounded-full blur-3xl" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Begin?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Take 10 minutes to understand your leadership challenges and discover
            your most important focus area.
          </p>
          <button onClick={onStartDiagnostic} className="btn-primary text-lg px-12 py-5 group">
            Start Diagnostic
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
