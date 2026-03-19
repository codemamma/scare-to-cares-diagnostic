export function calculatePrimaryGap(assessment) {
  const scores = [
    { dimension: 'Communication', score: assessment.communication_score },
    { dimension: 'Adaptation', score: assessment.adaptation_score },
    { dimension: 'Relationships', score: assessment.relationships_score },
    { dimension: 'Stress Response', score: assessment.stress_response_score },
    { dimension: 'Alignment', score: assessment.alignment_score }
  ];

  const lowestScore = scores.reduce((min, current) =>
    current.score < min.score ? current : min
  );

  return lowestScore.dimension;
}

export function formatRecommendedChapters(chapters) {
  if (!chapters || chapters.length === 0) {
    return { short: '', full: [] };
  }

  if (typeof chapters[0] === 'string') {
    return {
      short: chapters.join(', '),
      full: chapters.map(ch => ({ chapter: ch, title: '', reason: '' }))
    };
  }

  const short = chapters.map(ch => ch.chapter).join(', ');
  return { short, full: chapters };
}

export function formatRecommendedActions(actions) {
  if (!actions || actions.length === 0) {
    return { short: '', full: [] };
  }

  if (typeof actions[0] === 'string') {
    return {
      short: actions.join(', '),
      full: actions.map(action => ({ action, label: action, reason: '' }))
    };
  }

  const short = actions.map(a => a.label || a.title || a.action).join(', ');
  const full = actions.map(a => ({
    action: a.action || '',
    label: a.label || a.title || '',
    description: a.description || '',
    reason: a.reason || ''
  }));

  return { short, full };
}

export function formatActionLabel(actionType) {
  const labels = {
    'toolkit': 'Get Toolkit',
    'workshop': 'Book Workshop',
    'strategy_session': '1:1 Strategy Session'
  };

  return labels[actionType] || actionType;
}

export function getLastAction(actions) {
  if (!actions || actions.length === 0) {
    return null;
  }

  const sorted = [...actions].sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  );

  return sorted[0];
}

export function formatDateTime(dateString) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}
