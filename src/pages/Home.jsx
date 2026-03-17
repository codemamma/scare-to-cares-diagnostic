import bookCover from '../assets/WhatsApp_Image_2026-03-16_at_12.27.48_PM.jpeg';

export default function Home({ onStartDiagnostic }) {
  const scareItems = [
    {
      letter: "S",
      title: "Stress",
      description: "Overwhelmed by constant pressure and change"
    },
    {
      letter: "C",
      title: "Confusion",
      description: "Unclear priorities and mixed messages"
    },
    {
      letter: "A",
      title: "Anxiety",
      description: "Fear of failure and unknown outcomes"
    },
    {
      letter: "R",
      title: "Resistance",
      description: "Pushback and lack of buy-in"
    },
    {
      letter: "E",
      title: "Ego",
      description: "Defensive reactions and blame"
    }
  ];

  const caresItems = [
    {
      letter: "C",
      title: "Communicate",
      description: "Clearly and consistently share context"
    },
    {
      letter: "A",
      title: "Adjust",
      description: "Adapt when conditions change"
    },
    {
      letter: "R",
      title: "Relate",
      description: "Build strong working relationships"
    },
    {
      letter: "E",
      title: "Empower",
      description: "Give people ownership and trust"
    },
    {
      letter: "S",
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
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight overflow-visible">
            CARES Leadership
            <span className="block gradient-text pb-2">Diagnostic</span>
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
            <div className="card border-gray-800/50 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-4xl font-bold text-gray-300 mb-8 tracking-wider">SCARE</h3>

                <div className="space-y-6">
                  {scareItems.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-start">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-400">{item.letter}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-white mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card border-primary-800/50 relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-primary-950/30 to-black/90">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-4xl font-bold text-primary-400 mb-8 tracking-wider">CARES</h3>

                <div className="space-y-6">
                  {caresItems.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-start">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary-400">{item.letter}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-white mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
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

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              About the Framework
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Based on the book "SCARE to CARES: Leading Digital Transformation without Chaos"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-600/20 to-primary-400/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={bookCover}
                alt="SCARE to CARES Book by Saby Waraich"
                className="relative w-full max-w-md mx-auto rounded-xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            <div className="space-y-6">
              <div className="card">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Leading Digital Transformation without Chaos
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Written by <span className="text-primary-400 font-semibold">Saby Waraich</span>,
                  Leadership Expert & Keynote Speaker
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  With a foreword by <span className="text-white font-semibold">Jack Canfield</span>,
                  bestselling author of Chicken Soup for the Soul.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  This diagnostic tool brings the frameworks from the book to life,
                  helping you identify patterns and strengthen your leadership capacity.
                </p>
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
