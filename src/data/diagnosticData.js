// PLACEHOLDER DATA STRUCTURE
// Future: Import from local JSON files like:
// - scareQuestions.json
// - focusedAssessmentQuestions.json
// - resultProfiles.json
// - chapterRecommendations.json

export const scareQuestions = [
  {
    id: 1,
    text: "How often do you experience unclear priorities or mixed messages from leadership?",
    dimension: "Confusion",
    options: [
      { value: 1, label: "Rarely" },
      { value: 2, label: "Occasionally" },
      { value: 3, label: "Frequently" },
      { value: 4, label: "Constantly" }
    ]
  },
  {
    id: 2,
    text: "How overwhelmed do you feel by the pace and pressure of ongoing change?",
    dimension: "Stress",
    options: [
      { value: 1, label: "Manageable" },
      { value: 2, label: "Somewhat overwhelmed" },
      { value: 3, label: "Very overwhelmed" },
      { value: 4, label: "Completely overwhelmed" }
    ]
  },
  {
    id: 3,
    text: "How much resistance or pushback do you encounter when introducing change?",
    dimension: "Resistance",
    options: [
      { value: 1, label: "Minimal" },
      { value: 2, label: "Some resistance" },
      { value: 3, label: "Significant resistance" },
      { value: 4, label: "Strong opposition" }
    ]
  },
  {
    id: 4,
    text: "How often do team members avoid accountability or blame others?",
    dimension: "Ego",
    options: [
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: 5,
    text: "How anxious are people about the outcomes of current initiatives?",
    dimension: "Anxiety",
    options: [
      { value: 1, label: "Calm and confident" },
      { value: 2, label: "Somewhat concerned" },
      { value: 3, label: "Quite anxious" },
      { value: 4, label: "Highly anxious" }
    ]
  }
];

export const focusedAssessmentQuestions = {
  Communicate: [
    {
      id: "c1",
      text: "How clear and consistent is communication about strategic priorities?",
      focusArea: "Communicate",
      chapterRefs: ["chapter-3", "chapter-5"]
    },
    {
      id: "c2",
      text: "Do team members understand the context behind decisions?",
      focusArea: "Communicate",
      chapterRefs: ["chapter-5"]
    },
    {
      id: "c3",
      text: "How transparent is leadership about challenges and constraints?",
      focusArea: "Communicate",
      chapterRefs: ["chapter-3"]
    },
    {
      id: "c4",
      text: "Are messaging and expectations aligned across leadership?",
      focusArea: "Communicate",
      chapterRefs: ["chapter-5", "chapter-7"]
    },
    {
      id: "c5",
      text: "How effectively does communication flow between teams and levels?",
      focusArea: "Communicate",
      chapterRefs: ["chapter-5"]
    }
  ],
  Adjust: [
    {
      id: "a1",
      text: "How quickly does your organization adapt when conditions change?",
      focusArea: "Adjust",
      chapterRefs: ["chapter-4", "chapter-6"]
    },
    {
      id: "a2",
      text: "Are plans flexible enough to accommodate new information?",
      focusArea: "Adjust",
      chapterRefs: ["chapter-6"]
    },
    {
      id: "a3",
      text: "How well does leadership balance stability with agility?",
      focusArea: "Adjust",
      chapterRefs: ["chapter-4"]
    },
    {
      id: "a4",
      text: "Do teams feel empowered to adjust tactics based on feedback?",
      focusArea: "Adjust",
      chapterRefs: ["chapter-6", "chapter-8"]
    },
    {
      id: "a5",
      text: "How effectively are lessons learned incorporated into practice?",
      focusArea: "Adjust",
      chapterRefs: ["chapter-6"]
    }
  ],
  Relate: [
    {
      id: "r1",
      text: "How strong are working relationships across teams and functions?",
      focusArea: "Relate",
      chapterRefs: ["chapter-7"]
    },
    {
      id: "r2",
      text: "Do people trust each other to follow through on commitments?",
      focusArea: "Relate",
      chapterRefs: ["chapter-7"]
    },
    {
      id: "r3",
      text: "How effectively do leaders build genuine connections with their teams?",
      focusArea: "Relate",
      chapterRefs: ["chapter-7", "chapter-9"]
    },
    {
      id: "r4",
      text: "Are conflicts addressed constructively and resolved effectively?",
      focusArea: "Relate",
      chapterRefs: ["chapter-7"]
    },
    {
      id: "r5",
      text: "How well do different parts of the organization collaborate?",
      focusArea: "Relate",
      chapterRefs: ["chapter-7", "chapter-8"]
    }
  ],
  Empower: [
    {
      id: "e1",
      text: "How much ownership do team members have over their work?",
      focusArea: "Empower",
      chapterRefs: ["chapter-8"]
    },
    {
      id: "e2",
      text: "Are decision rights clear and appropriately distributed?",
      focusArea: "Empower",
      chapterRefs: ["chapter-8"]
    },
    {
      id: "e3",
      text: "Do people feel trusted to make important decisions?",
      focusArea: "Empower",
      chapterRefs: ["chapter-8", "chapter-9"]
    },
    {
      id: "e4",
      text: "How effectively does leadership delegate meaningful responsibility?",
      focusArea: "Empower",
      chapterRefs: ["chapter-8"]
    },
    {
      id: "e5",
      text: "Are team members held accountable for outcomes they can control?",
      focusArea: "Empower",
      chapterRefs: ["chapter-8"]
    }
  ],
  "Stay Calm": [
    {
      id: "s1",
      text: "How composed and steady is leadership during high-pressure situations?",
      focusArea: "Stay Calm",
      chapterRefs: ["chapter-9"]
    },
    {
      id: "s2",
      text: "Do leaders model calm, thoughtful responses to setbacks?",
      focusArea: "Stay Calm",
      chapterRefs: ["chapter-9"]
    },
    {
      id: "s3",
      text: "How well does the organization manage stress and prevent burnout?",
      focusArea: "Stay Calm",
      chapterRefs: ["chapter-9", "chapter-10"]
    },
    {
      id: "s4",
      text: "Are decisions made thoughtfully rather than reactively?",
      focusArea: "Stay Calm",
      chapterRefs: ["chapter-9"]
    },
    {
      id: "s5",
      text: "How effectively does leadership maintain perspective during uncertainty?",
      focusArea: "Stay Calm",
      chapterRefs: ["chapter-9", "chapter-10"]
    }
  ]
};

export const scareDimensions = [
  { key: "Stress", label: "Stress", description: "Overwhelmed by constant pressure" },
  { key: "Confusion", label: "Confusion", description: "Unclear priorities and mixed messages" },
  { key: "Anxiety", label: "Anxiety", description: "Fear of failure and unknown outcomes" },
  { key: "Resistance", label: "Resistance", description: "Pushback and lack of buy-in" },
  { key: "Ego", label: "Ego", description: "Defensive reactions and blame" }
];

export const caresDimensions = [
  {
    key: "Communicate",
    label: "Communicate",
    shortLabel: "Communication",
    description: "Clearly and consistently share context",
    longDescription: "Strong communication creates alignment, reduces confusion, and ensures everyone understands the 'why' behind decisions and changes."
  },
  {
    key: "Adjust",
    label: "Adjust",
    shortLabel: "Adjustment",
    description: "Adapt when conditions change",
    longDescription: "Flexibility and responsiveness enable teams to learn quickly, pivot when needed, and stay relevant in dynamic environments."
  },
  {
    key: "Relate",
    label: "Relate",
    shortLabel: "Relationships",
    description: "Build strong working relationships",
    longDescription: "Trust and collaboration form the foundation for effective teamwork, conflict resolution, and sustained high performance."
  },
  {
    key: "Empower",
    label: "Empower",
    shortLabel: "Empowerment",
    description: "Give people ownership and trust",
    longDescription: "Empowerment unlocks initiative, accountability, and engagement by giving people the authority to make meaningful decisions."
  },
  {
    key: "Stay Calm",
    label: "Stay Calm",
    shortLabel: "Composure",
    description: "Lead with composure under pressure",
    longDescription: "Calm leadership provides stability during uncertainty, models resilience, and enables thoughtful rather than reactive decision-making."
  }
];

export function calculateScareScore(answers) {
  return Object.values(answers).reduce((sum, val) => sum + val, 0);
}

export function calculateScareIndex(scareScore) {
  return Math.round((scareScore / 20) * 100);
}

export function determineFocusArea(answers, scareIndex) {
  // Simple logic: find the dimension with highest average score
  const dimensionScores = {};

  scareQuestions.forEach((q, idx) => {
    const answer = answers[q.id] || 0;
    if (!dimensionScores[q.dimension]) {
      dimensionScores[q.dimension] = { total: 0, count: 0 };
    }
    dimensionScores[q.dimension].total += answer;
    dimensionScores[q.dimension].count += 1;
  });

  const dimensionAverages = Object.entries(dimensionScores).map(([dim, data]) => ({
    dimension: dim,
    average: data.total / data.count
  }));

  dimensionAverages.sort((a, b) => b.average - a.average);

  const topDimension = dimensionAverages[0]?.dimension;

  // Map SCARE dimensions to CARES focus areas
  const dimensionToCares = {
    "Confusion": "Communicate",
    "Stress": "Stay Calm",
    "Resistance": "Relate",
    "Ego": "Empower",
    "Anxiety": "Adjust"
  };

  return dimensionToCares[topDimension] || "Communicate";
}

export function getInterpretationBand(scareIndex) {
  if (scareIndex < 30) return { label: "Low Friction", color: "text-green-400" };
  if (scareIndex < 50) return { label: "Moderate Friction", color: "text-primary-300" };
  if (scareIndex < 75) return { label: "Elevated Strain", color: "text-primary-400" };
  return { label: "Critical Intervention Needed", color: "text-primary-500" };
}

export function getRecommendedChapters(focusArea) {
  const recommendations = {
    "Communicate": [
      {
        chapter: "Chapter 3",
        title: "The Communication Imperative",
        summary: "Learn how to create clarity in complex change and ensure your messages land effectively.",
        reason: "Clear communication is the foundation for reducing confusion and building alignment across teams."
      },
      {
        chapter: "Chapter 5",
        title: "Building Alignment",
        summary: "Techniques for ensuring everyone moves in the same direction with shared understanding.",
        reason: "Alignment eliminates the friction caused by mixed messages and unclear priorities."
      },
      {
        chapter: "Chapter 7",
        title: "Transparency Under Pressure",
        summary: "How to maintain open communication when stakes are high and uncertainty is prevalent.",
        reason: "Transparent communication builds trust and helps teams navigate challenges together."
      }
    ],
    "Adjust": [
      {
        chapter: "Chapter 4",
        title: "Adaptive Leadership",
        summary: "Frameworks for making smart adjustments without losing direction or momentum.",
        reason: "Flexibility allows you to respond to changing conditions while maintaining strategic focus."
      },
      {
        chapter: "Chapter 6",
        title: "Learning Velocity",
        summary: "How to accelerate learning cycles and incorporate feedback more effectively.",
        reason: "Fast learning enables rapid adaptation and reduces the cost of course corrections."
      },
      {
        chapter: "Chapter 8",
        title: "Flexible Strategy",
        summary: "Balancing commitment to plans with the agility to pivot when necessary.",
        reason: "Strategic flexibility helps you stay relevant without losing sight of your ultimate goals."
      }
    ],
    "Relate": [
      {
        chapter: "Chapter 7",
        title: "Trust Foundations",
        summary: "Building relationships that withstand pressure and enable authentic collaboration.",
        reason: "Trust reduces resistance and creates the safety needed for teams to perform at their best."
      },
      {
        chapter: "Chapter 9",
        title: "Conflict as Collaboration",
        summary: "Turning disagreements into productive outcomes through constructive engagement.",
        reason: "Healthy conflict resolution strengthens relationships and leads to better decisions."
      },
      {
        chapter: "Chapter 10",
        title: "Cross-Functional Partnership",
        summary: "Breaking down silos and fostering genuine collaboration across boundaries.",
        reason: "Strong partnerships multiply impact and reduce the friction of organizational complexity."
      }
    ],
    "Empower": [
      {
        chapter: "Chapter 8",
        title: "Decision Rights",
        summary: "How to distribute authority effectively and clarify who decides what.",
        reason: "Clear decision rights eliminate bottlenecks and enable faster, more confident action."
      },
      {
        chapter: "Chapter 9",
        title: "Ownership Culture",
        summary: "Creating an environment where people take initiative and drive outcomes.",
        reason: "Ownership reduces resistance by giving people meaningful control over their work."
      },
      {
        chapter: "Chapter 11",
        title: "Accountability Systems",
        summary: "Holding people accountable without micromanaging or creating defensive behaviors.",
        reason: "Healthy accountability builds capability and confidence while maintaining trust."
      }
    ],
    "Stay Calm": [
      {
        chapter: "Chapter 9",
        title: "Composure Under Fire",
        summary: "Techniques for maintaining calm when everything is uncertain and pressure is high.",
        reason: "Your composure sets the tone and gives others permission to think clearly under stress."
      },
      {
        chapter: "Chapter 10",
        title: "Resilience Practice",
        summary: "Building personal and team resilience to sustain performance over time.",
        reason: "Resilience prevents burnout and enables sustained high performance through challenges."
      },
      {
        chapter: "Chapter 12",
        title: "Thoughtful Response",
        summary: "Moving from reactive to reflective leadership in high-stakes situations.",
        reason: "Thoughtful responses lead to better decisions and model the behavior you want to see."
      }
    ]
  };

  return recommendations[focusArea] || recommendations["Communicate"];
}

export const resultProfiles = {
  low: {
    range: [5, 9],
    label: "Low Friction",
    summary: "Your environment shows relatively low transformation friction. Continue strengthening the fundamentals and maintain momentum.",
    recommendation: "Focus on sustaining your current practices while identifying opportunities to deepen capability in your primary CARES dimension."
  },
  moderate: {
    range: [10, 14],
    label: "Moderate Friction",
    summary: "Your environment has moderate friction that could benefit from focused intervention and strategic attention.",
    recommendation: "Target your highest-impact area and implement systematic improvements to reduce friction before it escalates."
  },
  elevated: {
    range: [15, 17],
    label: "Elevated Strain",
    summary: "Your environment is experiencing elevated strain that requires strategic attention and deliberate intervention.",
    recommendation: "Address friction points urgently through your primary CARES focus area to prevent further deterioration."
  },
  critical: {
    range: [18, 20],
    label: "Critical Intervention Needed",
    summary: "Your environment shows critical strain levels requiring immediate, comprehensive intervention across multiple dimensions.",
    recommendation: "Take immediate action starting with your primary CARES focus area, and consider engaging external support for systemic change."
  }
};

export const nextStepResources = [
  {
    id: "toolkit",
    title: "CARES Leadership Toolkit",
    description: "Practical frameworks, templates, and exercises to strengthen your leadership capacity",
    cta: "Download Toolkit",
    icon: "download",
    type: "free"
  },
  {
    id: "workshop",
    title: "CARES Leadership Workshop",
    description: "Join an immersive workshop to transform your approach with your team",
    cta: "Join Workshop Waitlist",
    icon: "calendar",
    type: "paid"
  },
  {
    id: "session",
    title: "1:1 Strategy Session",
    description: "Work directly with Saby to address your specific transformation challenges",
    cta: "Request a Session",
    icon: "user",
    type: "premium"
  }
];
