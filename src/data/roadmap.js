import { Code, Brain } from 'lucide-react';

export const roadmapPhases = [
  {
    title: "Phase 1: Foundation Building (Month 1-2)",
    description: "Master core CS fundamentals and basic quant concepts",
    color: "from-blue-500 to-blue-700",
    weeks: [
      {
        title: "Week 1-2: DSA Mastery & Math Foundation",
        focus: "Competitive Programming + Linear Algebra",
        days: [
          {
            day: "Day 1-2",
            categories: [
              {
                name: "Competitive Programming",
                icon: <Code className="w-4 h-4" />,
                color: "border-red-400",
                tasks: [
                  { text: "Solve 5 Array problems (LeetCode Medium)", time: 90, difficulty: "medium" },
                  { text: "CodeChef Long Challenge participation", time: 120, difficulty: "hard" },
                  { text: "Study advanced STL containers", time: 45, difficulty: "easy" }
                ]
              },
              {
                name: "Mathematics",
                icon: <Brain className="w-4 h-4" />,
                color: "border-purple-400", 
                tasks: [
                  { text: "Linear Algebra: Vector spaces (Khan Academy)", time: 60, difficulty: "medium" },
                  { text: "Matrix operations practice (15 problems)", time: 45, difficulty: "easy" },
                  { text: "Eigenvalues/eigenvectors theory", time: 30, difficulty: "hard" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export const companyTargets = {
  lft: [
    { name: "Graviton Research Capital", difficulty: "Medium", focus: "Systematic Trading" },
    { name: "Edelweiss Financial Services", difficulty: "Easy", focus: "Quantitative Research" },
    { name: "IIFL Securities", difficulty: "Easy", focus: "Algorithmic Trading" },
    { name: "Motilal Oswal", difficulty: "Medium", focus: "Portfolio Management" },
    { name: "Kotak Securities", difficulty: "Medium", focus: "Derivatives Trading" }
  ],
  hft: [
    { name: "Jump Trading (India)", difficulty: "Extreme", focus: "High-Frequency Trading" },
    { name: "Tower Research Capital", difficulty: "Extreme", focus: "Low-Latency Systems" },
    { name: "Optiver (India Office)", difficulty: "Hard", focus: "Market Making" },
    { name: "WorldQuant India", difficulty: "Hard", focus: "Quantitative Research" },
    { name: "DE Shaw India", difficulty: "Extreme", focus: "Systematic Trading" }
  ]
}; 