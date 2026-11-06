/**
 * ALTA - Data Store (Clean Onboarding & Real Initial States)
 * Zero invented progress: New users start with honest Level 1, 0 streak, 0 tokens, and Day 1 of the 90-Day Challenge.
 */

const ALTA_DATA = {
  user: {
    name: "Alex Johnson",
    username: "@alexj_dev",
    email: "alex.johnson@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    level: 1,
    levelTitle: "Logic Novice",
    xp: 0,
    xpToNext: 250,
    tokens: 0,
    streak: 0,
    preferredLanguage: "Python",
    joinedDate: "Today",
    role: "Apprentice Learner",
    bio: "Starting the ALTA 90-Day Challenge to build permanent algorithmic reasoning."
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
    minutes: [0, 0, 0, 0, 0, 0, 0],
    problemsSolved: [0, 0, 0, 0, 0, 0, 0]
  },

  skills: [
    { name: "Logic & Conditionals", mastery: 0, status: "Not Started", color: "#10B981" },
    { name: "Array Manipulation", mastery: 0, status: "Not Started", color: "#00F2FE" },
    { name: "Hash Maps & Sets", mastery: 0, status: "Not Started", color: "#A855F7" },
    { name: "Time & Space Complexity", mastery: 0, status: "Not Started", color: "#3B82F6" },
    { name: "Recursion & Trees", mastery: 0, status: "Not Started", color: "#F59E0B" }
  ],

  // Honest empty state for new user
  recentActivities: [],

  // All 8 badges start locked with transparent progression targets
  badges: [
    {
      id: "b1",
      title: "First Problem Solved",
      tier: "Common",
      icon: "🎯",
      description: "Successfully solve your first logic challenge independently.",
      earnedDate: null,
      unlocked: false,
      progress: 0,
      progressLabel: "0 / 1 solved"
    },
    {
      id: "b2",
      title: "7-Day Streak",
      tier: "Common",
      icon: "🔥",
      description: "Maintain a continuous daily coding streak for 7 consecutive days.",
      earnedDate: null,
      unlocked: false,
      progress: 0,
      progressLabel: "0 / 7 streak days"
    },
    {
      id: "b3",
      title: "Logic Builder",
      tier: "Rare",
      icon: "🧩",
      description: "Complete 15 foundational logic and conditional reasoning exercises.",
      earnedDate: null,
      unlocked: false,
      progress: 0,
      progressLabel: "0 / 15 tasks"
    },
    {
      id: "b4",
      title: "Hint-Free Hero",
      tier: "Epic",
      icon: "⚡",
      description: "Solve 10 original problems without unlocking any hints.",
      earnedDate: null,
      unlocked: false,
      progress: 0,
      progressLabel: "0 / 10 hint-free"
    },
    {
      id: "b5",
      title: "Array Explorer",
      tier: "Rare",
      icon: "📊",
      description: "Master pointer arithmetic, in-place swaps, and sliding windows.",
      earnedDate: null,
      unlocked: false,
      progress: 0,
      progressLabel: "0 / 5 array drills"
    },
    {
      id: "b6",
      title: "Debugging Expert",
      tier: "Rare",
      icon: "🐞",
      description: "Diagnose and resolve 20 intentional edge-case bugs.",
      earnedDate: null,
      unlocked: false,
      progress: 0,
      progressLabel: "0 / 20 bugs resolved"
    },
    {
      id: "b7",
      title: "30-Day Consistency",
      tier: "Epic",
      icon: "🛡️",
      description: "Demonstrate 30 days of genuine active logic practice.",
      earnedDate: null,
      unlocked: false,
      progress: 0,
      progressLabel: "0 / 30 active days"
    },
    {
      id: "b8",
      title: "90-Day Achiever",
      tier: "Legendary",
      icon: "👑",
      description: "Complete all 90-Day Challenge milestones and capstone assessment.",
      earnedDate: null,
      unlocked: false,
      progress: 0,
      progressLabel: "Day 1 / 90 days"
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
      { rank: 7, name: "Liam O'Connor", level: 11, tokens: 1320, independentRate: "81.0%", streak: 12 },
      { rank: 8, name: "Zara Kim", level: 10, tokens: 1180, independentRate: "79.5%", streak: 9 },
      { rank: 9, name: "Tariq Mansoor", level: 9, tokens: 980, independentRate: "78.0%", streak: 8 },
      { rank: 10, name: "Alex Johnson (You)", level: 1, tokens: 0, independentRate: "--%", streak: 0, isUser: true }
    ]
  },

  // 90-Day Challenge: Day 1 honest start
  challenge90Days: {
    startDate: "Today",
    currentDay: 1,
    activeDays: 0,
    streak: 0,
    totalCodingTasksCompleted: 0,
    originalProblemsSolved: 0,
    independentSolvingPerformance: 0.0,
    skillImprovementPercent: "0%",
    finalAssessmentStatus: "Locked until Day 80 & 60 Tasks Completed",
    eligibilityStatus: "Not Eligible", // Starts as Not Eligible
    milestones: [
      { week: 1, title: "Algorithmic Intuition & Logic Foundations", status: "in-progress", tasks: 6, completedTasks: 0 },
      { week: 2, title: "Array Traversal & In-Place Pointer Manipulation", status: "locked", tasks: 7, completedTasks: 0 },
      { week: 3, title: "Hash Tables, Space-Time Tradeoffs & Lookup Sets", status: "locked", tasks: 8, completedTasks: 0 },
      { week: 4, title: "Two-Pointer Strategy & Sliding Windows", status: "locked", tasks: 8, completedTasks: 0 },
      { week: 5, title: "Stack & Queue Mechanics in Logic Framing", status: "locked", tasks: 7, completedTasks: 0 },
      { week: 6, title: "Binary Search & Divide-and-Conquer Mental Models", status: "locked", tasks: 5, completedTasks: 0 },
      { week: 7, title: "Recursion Trees & Backtracking Deconstruction", status: "locked", tasks: 6, completedTasks: 0 },
      { week: 8, title: "Dynamic Programming Memoization vs Tabulation", status: "locked", tasks: 7, completedTasks: 0 },
      { week: 9, title: "Graph Traversal BFS & DFS Decomposition", status: "locked", tasks: 6, completedTasks: 0 },
      { week: 10, title: "Advanced Data Structures & Heap Priority", status: "locked", tasks: 6, completedTasks: 0 },
      { week: 11, title: "Complex Transfer Problems & Stress Testing", status: "locked", tasks: 8, completedTasks: 0 },
      { week: 12, title: "Capstone Blind Assessment & Certification Defense", status: "locked", tasks: 4, completedTasks: 0 }
    ]
  },

  // Honest empty wallet for new user
  tokenTransactions: [],

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
      // All 3 foundational tasks start as uncompleted
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
          completed: false
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
          completed: false
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
