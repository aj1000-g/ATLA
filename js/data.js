/**
 * ALTA - Mock Data Store
 * Comprehensive realistic data for Student Dashboard, AI Learning, Games, and Analytics
 */

const ALTA_DATA = {
  user: {
    name: "Alex Johnson",
    username: "@alexj_dev",
    email: "alex.johnson@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    level: 12,
    levelTitle: "Logic Architect",
    xp: 4250,
    xpToNext: 5000,
    tokens: 1450,
    streak: 14,
    preferredLanguage: "Python",
    joinedDate: "October 1, 2026",
    role: "Full-Stack Apprentice",
    bio: "Passionate CS student mastering algorithmic reasoning and independent problem-solving."
  },

  quotes: [
    {
      quote: "First, solve the problem. Then, write the code.",
      author: "John Johnson",
      tip: "Before typing a single line, explain your logic in plain English to your rubber duck or AI mentor."
    },
    {
      quote: "The secret to building complex logic is decomposing it into atomic truths.",
      author: "Edsger W. Dijkstra",
      tip: "Notice patterns: if you are comparing pairs, ask whether sorting or hashing reduces quadratic time."
    },
    {
      quote: "Experience is the name everyone gives to their mistakes.",
      author: "Oscar Wilde",
      tip: "Embrace edge cases like empty arrays, zero targets, and duplicates early in your mental dry-run."
    }
  ],

  weeklyActivity: {
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    minutes: [45, 60, 30, 90, 50, 75, 40],
    problemsSolved: [2, 3, 1, 4, 2, 3, 2]
  },

  skills: [
    { name: "Logic & Conditionals", mastery: 92, status: "Mastered", color: "#10B981" },
    { name: "Array Manipulation", mastery: 85, status: "Advanced", color: "#00F2FE" },
    { name: "Hash Maps & Sets", mastery: 78, status: "Proficient", color: "#A855F7" },
    { name: "Time & Space Complexity", mastery: 68, status: "Developing", color: "#3B82F6" },
    { name: "Recursion & Trees", mastery: 45, status: "Learning", color: "#F59E0B" }
  ],

  recentActivities: [
    {
      id: "act-1",
      title: "Foundational: Hash Map Lookup Efficiency",
      category: "Learn with AI",
      time: "2 hours ago",
      tokens: "+30",
      status: "Completed",
      accuracy: "100%"
    },
    {
      id: "act-2",
      title: "Array Quest: Level 3 Binary Partition",
      category: "Game Zone",
      time: "Yesterday",
      tokens: "+25",
      status: "Won",
      accuracy: "95%"
    },
    {
      id: "act-3",
      title: "Original Problem: Valid Palindrome II",
      category: "Practice Arena",
      time: "2 days ago",
      tokens: "+60",
      status: "Solved (Hint-Free)",
      accuracy: "100%"
    },
    {
      id: "act-4",
      title: "Diagnostic: Two Sum Approach Reasoning",
      category: "AI Diagnostic",
      time: "3 days ago",
      tokens: "+15",
      status: "Passed",
      accuracy: "90%"
    }
  ],

  badges: [
    {
      id: "b1",
      title: "First Problem Solved",
      tier: "Common",
      icon: "🎯",
      description: "Successfully solved your first logic challenge independently.",
      earnedDate: "Oct 04, 2026",
      unlocked: true,
      progress: 100
    },
    {
      id: "b2",
      title: "7-Day Streak",
      tier: "Common",
      icon: "🔥",
      description: "Maintained a continuous daily coding streak for 7 consecutive days.",
      earnedDate: "Oct 11, 2026",
      unlocked: true,
      progress: 100
    },
    {
      id: "b3",
      title: "Logic Builder",
      tier: "Rare",
      icon: "🧩",
      description: "Completed 15 foundational logic and conditional reasoning exercises.",
      earnedDate: "Oct 22, 2026",
      unlocked: true,
      progress: 100
    },
    {
      id: "b4",
      title: "Hint-Free Hero",
      tier: "Epic",
      icon: "⚡",
      description: "Solved 10 original problems without unlocking any hints.",
      earnedDate: "Nov 01, 2026",
      unlocked: true,
      progress: 100
    },
    {
      id: "b5",
      title: "Array Explorer",
      tier: "Rare",
      icon: "📊",
      description: "Mastered pointer arithmetic, in-place swaps, and sliding windows.",
      earnedDate: "Nov 03, 2026",
      unlocked: true,
      progress: 100
    },
    {
      id: "b6",
      title: "Debugging Expert",
      tier: "Rare",
      icon: "🐞",
      description: "Diagnosed and resolved 20 intentional edge-case bugs.",
      earnedDate: null,
      unlocked: false,
      progress: 65,
      progressLabel: "13 / 20 bugs resolved"
    },
    {
      id: "b7",
      title: "30-Day Consistency",
      tier: "Epic",
      icon: "🛡️",
      description: "Demonstrated 30 days of genuine active logic practice.",
      earnedDate: null,
      unlocked: false,
      progress: 47,
      progressLabel: "14 / 30 active days"
    },
    {
      id: "b8",
      title: "90-Day Achiever",
      tier: "Legendary",
      icon: "👑",
      description: "Complete all 90-Day Challenge milestones and capstone assessment.",
      earnedDate: null,
      unlocked: false,
      progress: 42,
      progressLabel: "38 / 90 challenge days"
    }
  ],

  leaderboard: {
    podium: [
      {
        rank: 1,
        name: "Sofia Vance",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        level: 19,
        tokens: 3840,
        independentRate: "94.8%",
        streak: 42,
        badge: "Grandmaster"
      },
      {
        rank: 2,
        name: "Chen Wei",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        level: 17,
        tokens: 3410,
        independentRate: "91.2%",
        streak: 35,
        badge: "Algorithmic Master"
      },
      {
        rank: 3,
        name: "Marcus Brody",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        level: 16,
        tokens: 3120,
        independentRate: "89.5%",
        streak: 28,
        badge: "Code Virtuoso"
      }
    ],
    rankings: [
      { rank: 4, name: "Elena Rostova", level: 15, tokens: 2890, independentRate: "88.0%", streak: 21 },
      { rank: 5, name: "Devon Clark", level: 14, tokens: 2650, independentRate: "86.5%", streak: 19 },
      { rank: 6, name: "Aisha Patel", level: 13, tokens: 2100, independentRate: "85.0%", streak: 17 },
      { rank: 7, name: "Alex Johnson (You)", level: 12, tokens: 1450, independentRate: "84.2%", streak: 14, isUser: true },
      { rank: 8, name: "Liam O'Connor", level: 11, tokens: 1320, independentRate: "81.0%", streak: 12 },
      { rank: 9, name: "Zara Kim", level: 10, tokens: 1180, independentRate: "79.5%", streak: 9 },
      { rank: 10, name: "Tariq Mansoor", level: 9, tokens: 980, independentRate: "78.0%", streak: 8 }
    ]
  },

  challenge90Days: {
    startDate: "October 1, 2026",
    currentDay: 38,
    activeDays: 36,
    streak: 14,
    totalCodingTasksCompleted: 48,
    originalProblemsSolved: 18,
    independentSolvingPerformance: 84.2,
    skillImprovementPercent: "+42%",
    finalAssessmentStatus: "Unlocked at Day 80",
    eligibilityStatus: "In Progress", // "Not Eligible", "In Progress", "Eligible"
    milestones: [
      { week: 1, title: "Algorithmic Intuition & Logic Foundations", status: "completed", tasks: 6 },
      { week: 2, title: "Array Traversal & In-Place Pointer Manipulation", status: "completed", tasks: 7 },
      { week: 3, title: "Hash Tables, Space-Time Tradeoffs & Lookup Sets", status: "completed", tasks: 8 },
      { week: 4, title: "Two-Pointer Strategy & Sliding Windows", status: "completed", tasks: 8 },
      { week: 5, title: "Stack & Queue Mechanics in Logic Framing", status: "completed", tasks: 7 },
      { week: 6, title: "Binary Search & Divide-and-Conquer Mental Models", status: "in-progress", tasks: 5 },
      { week: 7, title: "Recursion Trees & Backtracking Deconstruction", status: "locked", tasks: 6 },
      { week: 8, title: "Dynamic Programming Memoization vs Tabulation", status: "locked", tasks: 7 },
      { week: 9, title: "Graph Traversal BFS & DFS Decomposition", status: "locked", tasks: 6 },
      { week: 10, title: "Advanced Data Structures & Heap Priority", status: "locked", tasks: 6 },
      { week: 11, title: "Complex Transfer Problems & Stress Testing", status: "locked", tasks: 8 },
      { week: 12, title: "Capstone Blind Assessment & Certification Defense", status: "locked", tasks: 4 }
    ]
  },

  tokenTransactions: [
    { id: "tx-1", desc: "Independently solved 'Two Sum' with Hash Map", amount: "+50", date: "Today, 11:20 AM", type: "earn" },
    { id: "tx-2", desc: "Completed Foundational Task: Pair Comparison", amount: "+25", date: "Today, 10:45 AM", type: "earn" },
    { id: "tx-3", desc: "Unlocked Conceptual Hint on Transfer Problem", amount: "-5", date: "Yesterday", type: "spend" },
    { id: "tx-4", desc: "7-Day Streak Consistency Reward", amount: "+40", date: "Nov 02, 2026", type: "earn" },
    { id: "tx-5", desc: "Won Loop Runner Level 3 Challenge", amount: "+30", date: "Oct 31, 2026", type: "earn" },
    { id: "tx-6", desc: "Mastered Array Traversal foundational unit", amount: "+35", date: "Oct 28, 2026", type: "earn" }
  ],

  // Diagnostic questions for Problem 1 (Two Sum)
  problemsCatalog: [
    {
      id: "two-sum",
      title: "Two Sum",
      difficulty: "Easy / Medium Logic",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
        { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
      ],
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Exactly one valid answer exists."],
      diagnosticQuestions: [
        {
          id: "diag-1",
          aiPrompt: "Hi Alex! Let's examine Two Sum. Suppose we have `nums = [2, 7, 11, 15]` and `target = 9`. How would your intuition search for the pair without writing any complex code first?",
          suggestedAnswers: [
            "Check every pair using two nested loops (compare each item with every other item).",
            "Calculate what each number needs (complement = target - num) and check if we saw it before.",
            "Sort the array first and use two pointers moving inwards."
          ]
        },
        {
          id: "diag-2",
          aiPrompt: "Great observation! If you choose the nested loops approach, what is the time complexity as the array grows to 10,000 numbers?",
          suggestedAnswers: [
            "It will take O(N^2) time because for each element we scan the rest of the array.",
            "It will take O(N) linear time because it's only one array.",
            "It will take O(log N) time because pairs cancel out."
          ]
        },
        {
          id: "diag-3",
          aiPrompt: "Spot on! Quadratic O(N^2) becomes slow. To get O(N), we want instant lookup. What data structure lets us check 'have we seen the needed number before' in O(1) average time?",
          suggestedAnswers: [
            "A Hash Map (dictionary) mapping the number to its index.",
            "A Queue where we dequeue numbers one by one.",
            "A Linked List storing elements sequentially."
          ]
        }
      ],
      foundationalTasks: [
        {
          id: "task-1",
          title: "Single Pass Array Traversal",
          skill: "Array Iteration & Index Access",
          difficulty: "Introductory",
          description: "Write a function that iterates through `nums` and returns a list of tuples `(index, value)` so you are comfortable tracking both where an element sits and what it contains.",
          starterCode: "def track_indices(nums):\n    # Write your loop here\n    # Return a list of (index, val) pairs\n    result = []\n    for i in range(len(nums)):\n        result.append((i, nums[i]))\n    return result",
          testCases: [
            { input: "[2, 7, 11]", expected: "[(0, 2), (1, 7), (2, 11)]" }
          ],
          completed: true
        },
        {
          id: "task-2",
          title: "Complement Calculation Logic",
          skill: "Mathematical Invariants",
          difficulty: "Introductory",
          description: "Given a `target` and a current number `x`, write a function to calculate the required complement `target - x` and check if it exists in a provided lookup set.",
          starterCode: "def find_complement(x, target, seen_set):\n    needed = target - x\n    # Check if needed is in seen_set\n    return needed in seen_set",
          testCases: [
            { input: "x=7, target=9, seen_set={2, 5}", expected: "True" },
            { input: "x=11, target=9, seen_set={2, 5}", expected: "False" }
          ],
          completed: true
        },
        {
          id: "task-3",
          title: "Hash Map Value-to-Index Storage",
          skill: "Hash Map Construction",
          difficulty: "Foundational",
          description: "Build an active hash map as you traverse. If the complement is in the map, return both indices; otherwise store the current number's index.",
          starterCode: "def solve_pair_hash(nums, target):\n    lookup = {} # maps num -> index\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in lookup:\n            return [lookup[complement], i]\n        lookup[num] = i\n    return []",
          testCases: [
            { input: "nums=[2, 7, 11, 15], target=9", expected: "[0, 1]" },
            { input: "nums=[3, 2, 4], target=6", expected: "[1, 2]" }
          ],
          completed: false
        }
      ],
      progressiveHints: [
        {
          stage: 1,
          type: "Conceptual Hint",
          badge: "Mental Model",
          text: "Instead of searching forward for every number, flip the mental model: as you walk forward, ask 'Did I already encounter the number that adds up to target with me?'"
        },
        {
          stage: 2,
          type: "Directional Hint",
          badge: "Data Structure Strategy",
          text: "To answer that question in O(1) time instead of re-scanning the array, remember what you have seen using a Hash Map (Python dict or JS Map)."
        },
        {
          stage: 3,
          type: "Logic Hint",
          badge: "Key-Value Relationship",
          text: "What should be the key and what should be the value in your hash map? Key = the number value itself (for quick search), Value = the index where it occurred."
        },
        {
          stage: 4,
          type: "Pseudocode Hint",
          badge: "Algorithm Skeleton",
          text: "1. Initialize empty hash map `seen`.\n2. Loop `i` and `num` through `nums`:\n    `diff = target - num`\n    if `diff` in `seen`: return `[seen[diff], i]`\n    `seen[num] = i`\n3. Return empty list if no pair found."
        },
        {
          stage: 5,
          type: "Full Solution (Last Resort)",
          badge: "Reference Code",
          text: "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for idx, val in enumerate(nums):\n            diff = target - val\n            if diff in seen:\n                return [seen[diff], idx]\n            seen[val] = idx\n        return []"
        }
      ]
    }
  ]
};
