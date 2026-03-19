import { useState } from 'react';
import {
  calculatePrimaryGap,
  formatRecommendedChapters,
  formatRecommendedActions,
  formatActionLabel,
  getLastAction,
  formatDateTime,
  formatDate
} from '../../utils/adminHelpers';

function ExpandedRow({ assessment, actions }) {
  const sortedActions = [...actions].sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  );

  const chapters = formatRecommendedChapters(assessment.recommended_chapters);
  const recommendedActions = formatRecommendedActions(assessment.recommended_actions);

  return (
    <td colSpan="13" className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Action History</h4>
          {sortedActions.length > 0 ? (
            <div className="space-y-2">
              {sortedActions.map((action) => (
                <div
                  key={action.id}
                  className="flex justify-between items-start text-sm border-l-4 border-blue-500 pl-3 py-1"
                >
                  <span className="font-medium text-gray-900">
                    {formatActionLabel(action.action_type)}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {formatDateTime(action.created_at)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No actions taken yet</p>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Recommended Chapters</h4>
          {chapters.full.length > 0 ? (
            <div className="space-y-3">
              {chapters.full.map((ch, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-medium text-blue-900">{ch.chapter}</div>
                  {ch.title && (
                    <div className="text-gray-900">{ch.title}</div>
                  )}
                  {ch.reason && (
                    <div className="text-gray-600 text-xs mt-1">{ch.reason}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No chapters recommended</p>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Recommended Actions</h4>
          {recommendedActions.full.length > 0 ? (
            <div className="space-y-3">
              {recommendedActions.full.map((action, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-medium text-purple-900">
                    {action.label || action.action}
                  </div>
                  {action.description && (
                    <div className="text-gray-700 text-xs">{action.description}</div>
                  )}
                  {action.reason && (
                    <div className="text-gray-600 text-xs mt-1">{action.reason}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No actions recommended</p>
          )}
        </div>
      </div>
    </td>
  );
}

function AssessmentRow({ assessment, actions }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const primaryGap = calculatePrimaryGap(assessment);
  const chapters = formatRecommendedChapters(assessment.recommended_chapters);
  const recommendedActions = formatRecommendedActions(assessment.recommended_actions);
  const lastAction = getLastAction(actions);

  return (
    <>
      <tr
        className="hover:bg-gray-50 cursor-pointer border-b border-gray-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="px-6 py-4 text-sm text-gray-900">
          {assessment.email}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">
          {assessment.name || '—'}
        </td>
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          {assessment.overall_score}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">
          {assessment.communication_score}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">
          {assessment.adaptation_score}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">
          {assessment.relationships_score}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">
          {assessment.stress_response_score}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">
          {assessment.alignment_score}
        </td>
        <td className="px-6 py-4 text-sm">
          <span className="inline-block px-2 py-1 bg-orange-100 text-orange-900 rounded text-xs font-medium">
            {primaryGap}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
          {chapters.short || '—'}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
          {recommendedActions.short || '—'}
        </td>
        <td className="px-6 py-4 text-sm">
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              assessment.report_sent
                ? 'bg-green-100 text-green-900'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {assessment.report_sent ? 'Yes' : 'No'}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">
          {lastAction ? formatActionLabel(lastAction.action_type) : '—'}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
          {formatDate(assessment.created_at)}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <ExpandedRow assessment={assessment} actions={actions} />
        </tr>
      )}
    </>
  );
}

export default function AssessmentsTable({ assessments }) {
  if (!assessments || assessments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-gray-200">
        <p className="text-gray-500 text-lg">No assessments found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Assessment Leads ({assessments.length})
        </h2>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Overall
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Comm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Adapt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Relate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Stress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Align
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Primary Gap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Chapters
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Report
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Last Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assessments.map((assessment) => (
              <AssessmentRow
                key={assessment.id}
                assessment={assessment}
                actions={assessment.actions || []}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
