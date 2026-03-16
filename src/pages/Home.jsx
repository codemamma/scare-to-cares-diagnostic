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
    { title: "CIOs", description: "Navigate technology transformation with confidence" },
    { title: "Transformation Leaders", description: "Lead change initiatives that stick" },
    { title: "Program Managers", description: "Deliver complex programs successfully" },
    { title: "Executive Teams", description: "Build organizational resilience" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            CARES Leadership Diagnostic
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            A practical leadership diagnostic inspired by the SCARE to CARES framework
            to help leaders identify transformation friction and focus on what to strengthen next.
          </p>
          <p className="text-sm text-gray-400 mb-10">
            Designed for leaders navigating transformation, alignment, and change under pressure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onStartDiagnostic} className="btn-primary">
              Start Diagnostic
            </button>
            <a
              href="https://sabywaraich.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Visit Saby's Website
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            From SCARE to CARES
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="card border-red-900/50">
              <h3 className="text-3xl font-bold text-red-400 mb-8">SCARE</h3>
              <div className="space-y-6">
                {scareItems.map((item, idx) => (
                  <div key={idx} className="border-l-4 border-red-500 pl-4">
                    <h4 className="text-xl font-semibold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card border-primary-900/50">
              <h3 className="text-3xl font-bold text-primary-400 mb-8">CARES</h3>
              <div className="space-y-6">
                {caresItems.map((item, idx) => (
                  <div key={idx} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="text-xl font-semibold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Why This Matters
          </h2>
          <div className="card card-hover">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Transformation often breaks down not because of technology, but because leaders
              and teams fall into patterns of stress, confusion, resistance, and blame.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              This diagnostic helps identify these patterns and point toward practical next steps
              that strengthen your leadership capacity and organizational resilience.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Who It's For
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((audience, idx) => (
              <div key={idx} className="card card-hover text-center">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {audience.title}
                </h3>
                <p className="text-gray-400">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Begin?
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            Take 10 minutes to understand your leadership challenges and discover
            your most important focus area.
          </p>
          <button onClick={onStartDiagnostic} className="btn-primary text-lg">
            Start Diagnostic
          </button>
        </div>
      </section>
    </div>
  );
}
