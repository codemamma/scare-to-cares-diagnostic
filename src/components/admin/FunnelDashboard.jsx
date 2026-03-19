export default function FunnelDashboard({ stats }) {
  const kpis = [
    {
      label: 'Total Assessments',
      value: stats.totalAssessments,
      color: 'bg-blue-50 border-blue-200 text-blue-900'
    },
    {
      label: 'Reports Sent',
      value: stats.reportsSent,
      color: 'bg-green-50 border-green-200 text-green-900'
    },
    {
      label: 'Action Clicked',
      value: stats.actionClicked,
      color: 'bg-purple-50 border-purple-200 text-purple-900'
    },
    {
      label: 'Strategy Session Clicks',
      value: stats.strategySessionClicks,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900'
    },
    {
      label: 'Workshop Clicks',
      value: stats.workshopClicks,
      color: 'bg-violet-50 border-violet-200 text-violet-900'
    },
    {
      label: 'Toolkit Clicks',
      value: stats.toolkitClicks,
      color: 'bg-sky-50 border-sky-200 text-sky-900'
    }
  ];

  const clickThroughRate = stats.totalAssessments > 0
    ? Math.round((stats.actionClicked / stats.totalAssessments) * 100)
    : 0;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Funnel Metrics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className={`p-6 border-2 rounded-lg ${kpi.color}`}
          >
            <div className="text-sm font-medium opacity-80 mb-1">
              {kpi.label}
            </div>
            <div className="text-3xl font-bold">
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {stats.totalAssessments > 0 && (
        <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-center">
          <span className="text-sm font-medium text-gray-700">
            Click-Through Rate:{' '}
          </span>
          <span className="text-lg font-bold text-gray-900">
            {clickThroughRate}%
          </span>
          <span className="text-sm text-gray-600 ml-2">
            ({stats.actionClicked} of {stats.totalAssessments} assessments)
          </span>
        </div>
      )}
    </div>
  );
}
