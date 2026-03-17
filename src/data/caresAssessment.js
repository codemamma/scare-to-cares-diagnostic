export const caresDimensions = {
  stress: {
    letter: 'S',
    title: 'Stress Response Patterns',
    description: 'How you process and manage stress as a leader',
    color: 'bg-blue-600',
    questions: [
      {
        id: 's1',
        text: 'Do I find myself suppressing negative emotions rather than processing them?',
        dimension: 'stress'
      },
      {
        id: 's2',
        text: 'Am I maintaining an appearance of calm while internally panicking?',
        dimension: 'stress'
      },
      {
        id: 's3',
        text: 'Have I stopped sharing vulnerabilities with my team?',
        dimension: 'stress'
      }
    ]
  },
  communication: {
    letter: 'C',
    title: 'Communication Habits',
    description: 'How you share information and engage with your team',
    color: 'bg-purple-600',
    questions: [
      {
        id: 'c1',
        text: 'Do I speak more than I listen in team meetings?',
        dimension: 'communication'
      },
      {
        id: 'c2',
        text: 'Have I stopped asking for feedback because it might surface problems?',
        dimension: 'communication'
      },
      {
        id: 'c3',
        text: 'Do I find myself crafting messages to control rather than inform?',
        dimension: 'communication'
      }
    ]
  },
  adaptation: {
    letter: 'A',
    title: 'Adaptation Approach',
    description: 'How you respond to change and make decisions',
    color: 'bg-indigo-600',
    questions: [
      {
        id: 'a1',
        text: 'Am I making decisions based on fear rather than strategy?',
        dimension: 'adaptation'
      },
      {
        id: 'a2',
        text: 'Do I resist changes that challenge my authority?',
        dimension: 'adaptation'
      },
      {
        id: 'a3',
        text: 'Have I stopped exploring innovative solutions because they feel risky?',
        dimension: 'adaptation'
      }
    ]
  },
  relationships: {
    letter: 'R',
    title: 'Relationship Patterns',
    description: 'How you build and maintain connections with your team',
    color: 'bg-violet-600',
    questions: [
      {
        id: 'r1',
        text: 'Do I keep relationships superficial to maintain control?',
        dimension: 'relationships'
      },
      {
        id: 'r2',
        text: 'Have I stopped investing in team building and personal connections?',
        dimension: 'relationships'
      },
      {
        id: 'r3',
        text: 'Do I view relationship building as a distraction from "real work"?',
        dimension: 'relationships'
      }
    ]
  },
  empowerment: {
    letter: 'E',
    title: 'Empowerment Reality',
    description: 'How you delegate and enable team autonomy',
    color: 'bg-blue-500',
    questions: [
      {
        id: 'e1',
        text: 'Do I delegate tasks but maintain tight control over decisions?',
        dimension: 'empowerment'
      },
      {
        id: 'e2',
        text: 'Have I created additional approval layers while claiming to empower?',
        dimension: 'empowerment'
      },
      {
        id: 'e3',
        text: 'Do I find myself second-guessing team members\' judgments?',
        dimension: 'empowerment'
      }
    ]
  }
};

export const getScoreInterpretation = (score) => {
  if (score <= 3) return {
    level: 'High fear-based patterns',
    description: 'Fear-driven patterns dominate',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  };
  if (score <= 6) return {
    level: 'Mixed, room for growth',
    description: 'Mixed patterns with room for growth',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  };
  if (score <= 10) return {
    level: 'Healthy leadership',
    description: 'Healthy patterns, improvable',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  };
  return {
    level: 'Strong',
    description: 'Exemplary leadership pattern',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  };
};

export const getOverallInterpretation = (overallScore) => {
  if (overallScore <= 3) return {
    range: '0-3:',
    label: 'High fear-based patterns'
  };
  if (overallScore <= 6) return {
    range: '4-6:',
    label: 'Mixed, room for growth'
  };
  return {
    range: '7-10:',
    label: 'Healthy leadership'
  };
};

export const getDimensionInsight = (dimension, score) => {
  const insights = {
    stress: {
      low: 'You may be suppressing emotions and maintaining a facade, which can lead to burnout and disconnection.',
      medium: 'Your stress response shows some healthy patterns, but there\'s room to process emotions more authentically.',
      high: 'You demonstrate healthy stress processing, sharing vulnerabilities and processing emotions constructively.'
    },
    communication: {
      low: 'Your communication may be more control-oriented than clarity-driven, limiting team engagement.',
      medium: 'You balance speaking and listening moderately well, but could invite more feedback and openness.',
      high: 'You excel at listening, seeking feedback, and communicating with transparency and purpose.'
    },
    adaptation: {
      low: 'Fear may be driving your decisions more than strategy, limiting innovation and growth.',
      medium: 'You adapt reasonably well but may resist changes that feel personally challenging.',
      high: 'You approach change strategically, embracing innovation and making decisions from strength.'
    },
    relationships: {
      low: 'Keeping relationships superficial may be limiting trust and team cohesion.',
      medium: 'You invest in relationships but could deepen connections for greater team impact.',
      high: 'You build authentic, meaningful relationships that strengthen team culture and performance.'
    },
    empowerment: {
      low: 'You may be delegating tasks while maintaining tight control, limiting team growth and autonomy.',
      medium: 'You empower your team in some areas but could release more control and trust judgment.',
      high: 'You genuinely empower others, trusting their judgment and enabling true autonomy.'
    }
  };

  if (score <= 4) return insights[dimension].low;
  if (score <= 7) return insights[dimension].medium;
  return insights[dimension].high;
};
