import { useState, useEffect } from 'react';
import FunnelDashboard from '../components/admin/FunnelDashboard';
import AssessmentsTable from '../components/admin/AssessmentsTable';

export default function AdminAssessments() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({
    totalAssessments: 0,
    reportsSent: 0,
    actionClicked: 0,
    strategySessionClicks: 0,
    workshopClicks: 0,
    toolkitClicks: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const assessmentsResponse = await fetch(
        `${supabaseUrl}/rest/v1/assessments?select=*&order=created_at.desc`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      if (!assessmentsResponse.ok) {
        throw new Error('Failed to fetch assessments');
      }

      const assessmentsData = await assessmentsResponse.json();

      const actionsResponse = await fetch(
        `${supabaseUrl}/rest/v1/assessment_actions?select=*&order=created_at.desc`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      if (!actionsResponse.ok) {
        throw new Error('Failed to fetch actions');
      }

      const actionsData = await actionsResponse.json();

      const assessmentsWithActions = assessmentsData.map(assessment => ({
        ...assessment,
        actions: actionsData.filter(action => action.assessment_id === assessment.id)
      }));

      setAssessments(assessmentsWithActions);

      const totalAssessments = assessmentsData.length;
      const reportsSent = assessmentsData.filter(a => a.report_sent).length;

      const assessmentsWithActions_set = new Set(
        actionsData.map(action => action.assessment_id)
      );
      const actionClicked = assessmentsWithActions_set.size;

      const strategySessionClicks = actionsData.filter(
        a => a.action_type === 'strategy_session'
      ).length;

      const workshopClicks = actionsData.filter(
        a => a.action_type === 'workshop'
      ).length;

      const toolkitClicks = actionsData.filter(
        a => a.action_type === 'toolkit'
      ).length;

      setStats({
        totalAssessments,
        reportsSent,
        actionClicked,
        strategySessionClicks,
        workshopClicks,
        toolkitClicks
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Assessment Leads Dashboard
            </h1>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Back to Home
            </button>
          </div>
          <p className="text-gray-600">
            View and manage all assessment submissions and track engagement metrics
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading assessments...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-900 font-semibold">Error loading data</p>
            <p className="text-red-700 mt-2">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <FunnelDashboard stats={stats} />
            <AssessmentsTable assessments={assessments} />
          </>
        )}
      </div>
    </div>
  );
}
