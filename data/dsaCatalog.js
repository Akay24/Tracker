export const DSA_CATALOG = [
  {
    id: "arrays-strings",
    title: "Arrays & Strings",
    subtopics: [
      {
        id: "arrays-foundations",
        title: "Arrays Foundations",
        patterns: [
          {
            id: "prefix-sum",
            title: "Prefix Sum (1D, 2D, Difference Array)",
            problems: [
              { id: "dsa:arrays-strings:prefix-sum:subarray-sum-equals-k", name: "Subarray Sum Equals K", difficulty: "Medium", pattern: "Prefix Sum" },
              { id: "dsa:arrays-strings:prefix-sum:range-sum-query", name: "Range Sum Query", difficulty: "Easy", pattern: "Prefix Sum" },
              { id: "dsa:arrays-strings:prefix-sum:continuous-subarray-sum", name: "Continuous Subarray Sum", difficulty: "Medium", pattern: "Prefix Sum" },
              { id: "dsa:arrays-strings:prefix-sum:range-sum-query-2d", name: "Range Sum Query 2D — Immutable", difficulty: "Medium", pattern: "2D Prefix Sum" },
              { id: "dsa:arrays-strings:prefix-sum:max-sum-rect", name: "Max Sum Rectangle in 2D Matrix", difficulty: "Hard", pattern: "2D Prefix Sum + Kadane" },
              { id: "dsa:arrays-strings:prefix-sum:difference-array-range-update", name: "Range Update (Difference Array)", difficulty: "Medium", pattern: "Difference Array" },
              { id: "dsa:arrays-strings:prefix-sum:car-pooling", name: "Car Pooling", difficulty: "Medium", pattern: "Difference Array" },
            ],
          },
          {
            id: "kadane",
            title: "Kadane Variations",
            problems: [
              { id: "dsa:arrays-strings:kadane:maximum-subarray", name: "Maximum Subarray", difficulty: "Easy", pattern: "Kadane" },
              { id: "dsa:arrays-strings:kadane:best-time-to-buy-sell-stock", name: "Best Time to Buy and Sell Stock", difficulty: "Easy", pattern: "Kadane" },
              { id: "dsa:arrays-strings:kadane:max-product-subarray", name: "Maximum Product Subarray", difficulty: "Medium", pattern: "Kadane (min/max track)" },
              { id: "dsa:arrays-strings:kadane:max-circular-subarray", name: "Maximum Sum Circular Subarray", difficulty: "Medium", pattern: "Kadane (total - min variant)" },
            ],
          },
          {
            id: "in-place",
            title: "In-Place / Partition",
            problems: [
              {
                id: "dsa:arrays-strings:in-place:dutch-national-flag",
                name: "Dutch National Flag (3-way partition)",
                difficulty: "Medium",
                pattern: "In-Place Partition",
              },
              {
                id: "dsa:arrays-strings:in-place:next-permutation",
                name: "Next Permutation",
                difficulty: "Medium",
                pattern: "In-Place",
              },
            ],
          },
        ],
      },
      {
        id: "strings-core",
        title: "Strings Core",
        patterns: [
          {
            id: "frequency",
            title: "Frequency Map",
            problems: [
              {
                id: "dsa:arrays-strings:frequency:valid-anagram",
                name: "Valid Anagram",
                difficulty: "Easy",
                pattern: "Frequency Map",
              },
              {
                id: "dsa:arrays-strings:frequency:group-anagrams",
                name: "Group Anagrams",
                difficulty: "Medium",
                pattern: "Frequency Map",
              },
            ],
          },
          {
            id: "palindrome",
            title: "Palindromes (Two Pointers)",
            problems: [
              {
                id: "dsa:arrays-strings:palindrome:valid-palindrome",
                name: "Valid Palindrome",
                difficulty: "Easy",
                pattern: "Two Pointers",
              },
              {
                id: "dsa:arrays-strings:palindrome:longest-palindromic-substring",
                name: "Longest Palindromic Substring",
                difficulty: "Medium",
                pattern: "Expand Around Center",
              },
            ],
          },
          {
            id: "pattern-matching",
            title: "Pattern Matching",
            problems: [
              {
                id: "dsa:arrays-strings:pattern-matching:kmp-concept",
                name: "Substring Search (KMP concept)",
                difficulty: "Medium",
                pattern: "KMP",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "hashing",
    title: "Hashing",
    subtopics: [
      {
        id: "hashing-patterns",
        title: "Core Patterns",
        patterns: [
          {
            id: "two-sum-family",
            title: "Two Sum Family",
            problems: [
              {
                id: "dsa:hashing:two-sum:two-sum",
                name: "Two Sum",
                difficulty: "Easy",
                pattern: "Hash Map",
              },
              {
                id: "dsa:hashing:two-sum:three-sum",
                name: "3Sum",
                difficulty: "Medium",
                pattern: "Hashing + Two Pointers",
              },
            ],
          },
          {
            id: "consecutive",
            title: "Consecutive / Set",
            problems: [
              {
                id: "dsa:hashing:set:longest-consecutive-sequence",
                name: "Longest Consecutive Sequence",
                difficulty: "Medium",
                pattern: "Hash Set",
              },
              {
                id: "dsa:hashing:set:first-unique-character",
                name: "First Unique Character",
                difficulty: "Easy",
                pattern: "Frequency Map",
              },
            ],
          },
          {
            id: "lru",
            title: "Cache (LRU)",
            problems: [
              {
                id: "dsa:hashing:lru:lru-cache",
                name: "LRU Cache",
                difficulty: "Medium",
                pattern: "Hash Map + DLL",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    subtopics: [
      {
        id: "window-core",
        title: "Window Patterns",
        patterns: [
          {
            id: "fixed",
            title: "Fixed Window",
            problems: [
              { id: "dsa:sliding-window:fixed:maximum-average-subarray", name: "Maximum Average Subarray", difficulty: "Easy", pattern: "Fixed Window" },
              { id: "dsa:sliding-window:fixed:sliding-window-maximum", name: "Sliding Window Maximum", difficulty: "Hard", pattern: "Monotonic Queue" },
              { id: "dsa:sliding-window:fixed:max-sum-k", name: "Max Sum of K Consecutive", difficulty: "Easy", pattern: "Fixed Window" },
            ],
          },
          {
            id: "variable",
            title: "Variable Window",
            problems: [
              { id: "dsa:sliding-window:variable:longest-substring-without-repeat", name: "Longest Substring Without Repeating Characters", difficulty: "Medium", pattern: "Variable Window" },
              { id: "dsa:sliding-window:variable:minimum-window-substring", name: "Minimum Window Substring", difficulty: "Hard", pattern: "Variable Window" },
              { id: "dsa:sliding-window:variable:max-consecutive-ones-iii", name: "Max Consecutive Ones III (K flips)", difficulty: "Medium", pattern: "Variable Window" },
              { id: "dsa:sliding-window:variable:fruit-into-baskets", name: "Fruit Into Baskets", difficulty: "Medium", pattern: "Variable Window" },
            ],
          },
          {
            id: "atmost-exactly-k",
            title: "At-Most-K / Exactly-K Distinct",
            problems: [
              { id: "dsa:sliding-window:k-distinct:subarrays-k-diff-ints", name: "Subarrays with K Different Integers", difficulty: "Hard", pattern: "Exactly K = AtMost(K) - AtMost(K-1)" },
              { id: "dsa:sliding-window:k-distinct:longest-subarray-k-zeros", name: "Longest Subarray with At Most K Zeros", difficulty: "Medium", pattern: "At Most K" },
              { id: "dsa:sliding-window:k-distinct:count-nice-subarrays", name: "Count Number of Nice Subarrays", difficulty: "Medium", pattern: "Exactly K" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    subtopics: [
      {
        id: "tp-core",
        title: "Core",
        patterns: [
          {
            id: "sorted",
            title: "Sorted Two Pointers",
            problems: [
              {
                id: "dsa:two-pointers:sorted:container-with-most-water",
                name: "Container With Most Water",
                difficulty: "Medium",
                pattern: "Two Pointers",
              },
              {
                id: "dsa:two-pointers:sorted:remove-duplicates-sorted-array",
                name: "Remove Duplicates from Sorted Array",
                difficulty: "Easy",
                pattern: "Two Pointers",
              },
            ],
          },
          {
            id: "fast-slow",
            title: "Fast/Slow Pointers",
            problems: [
              {
                id: "dsa:two-pointers:fast-slow:linked-list-cycle",
                name: "Linked List Cycle",
                difficulty: "Easy",
                pattern: "Floyd Cycle",
              },
              {
                id: "dsa:two-pointers:fast-slow:find-duplicate-number",
                name: "Find the Duplicate Number",
                difficulty: "Medium",
                pattern: "Floyd Cycle",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    subtopics: [
      {
        id: "bs-core",
        title: "Core + Answer Space",
        patterns: [
          {
            id: "classic",
            title: "Classic",
            problems: [
              {
                id: "dsa:binary-search:classic:binary-search",
                name: "Binary Search",
                difficulty: "Easy",
                pattern: "Binary Search",
              },
              {
                id: "dsa:binary-search:classic:first-last-position",
                name: "Find First and Last Position",
                difficulty: "Medium",
                pattern: "Binary Search",
              },
              {
                id: "dsa:binary-search:classic:search-rotated-array",
                name: "Search in Rotated Sorted Array",
                difficulty: "Medium",
                pattern: "Binary Search",
              },
            ],
          },
          {
            id: "answer-space",
            title: "Binary Search on Answer",
            problems: [
              {
                id: "dsa:binary-search:answer:koko-eating-bananas",
                name: "Koko Eating Bananas",
                difficulty: "Medium",
                pattern: "Binary Search on Answer",
              },
              {
                id: "dsa:binary-search:answer:capacity-to-ship-packages",
                name: "Capacity To Ship Packages",
                difficulty: "Medium",
                pattern: "Binary Search on Answer",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "linked-list",
    title: "Linked List",
    subtopics: [
      {
        id: "ll-core",
        title: "Core",
        patterns: [
          {
            id: "reversal",
            title: "Reversal",
            problems: [
              {
                id: "dsa:linked-list:reversal:reverse-linked-list",
                name: "Reverse Linked List",
                difficulty: "Easy",
                pattern: "Pointer Rewire",
              },
              {
                id: "dsa:linked-list:reversal:reverse-nodes-in-k-group",
                name: "Reverse Nodes in K-Group",
                difficulty: "Hard",
                pattern: "K-Group Reversal",
              },
            ],
          },
          {
            id: "merge",
            title: "Merge",
            problems: [
              {
                id: "dsa:linked-list:merge:merge-two-sorted-lists",
                name: "Merge Two Sorted Lists",
                difficulty: "Easy",
                pattern: "Merge",
              },
              {
                id: "dsa:linked-list:merge:merge-k-sorted-lists",
                name: "Merge K Sorted Lists",
                difficulty: "Hard",
                pattern: "Heap + Merge",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "stack-queue",
    title: "Stack & Queue (incl. Monotonic)",
    subtopics: [
      {
        id: "stack-core",
        title: "Stack Patterns",
        patterns: [
          {
            id: "parens",
            title: "Stack Validations",
            problems: [
              {
                id: "dsa:stack-queue:stack:valid-parentheses",
                name: "Valid Parentheses",
                difficulty: "Easy",
                pattern: "Stack",
              },
            ],
          },
          {
            id: "mono-stack",
            title: "Monotonic Stack",
            problems: [
              {
                id: "dsa:stack-queue:mono-stack:daily-temperatures",
                name: "Daily Temperatures",
                difficulty: "Medium",
                pattern: "Monotonic Stack",
              },
              {
                id: "dsa:stack-queue:mono-stack:largest-rectangle-histogram",
                name: "Largest Rectangle in Histogram",
                difficulty: "Hard",
                pattern: "Monotonic Stack",
              },
            ],
          },
          {
            id: "mono-queue",
            title: "Monotonic Queue",
            problems: [
              {
                id: "dsa:stack-queue:mono-queue:sliding-window-maximum",
                name: "Sliding Window Maximum",
                difficulty: "Hard",
                pattern: "Monotonic Queue",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "recursion-backtracking",
    title: "Recursion & Backtracking",
    subtopics: [
      {
        id: "rec-core",
        title: "Core Backtracking",
        patterns: [
          {
            id: "subsets-perms",
            title: "Subsets / Permutations",
            problems: [
              {
                id: "dsa:recursion-backtracking:subsets:subsets",
                name: "Subsets",
                difficulty: "Medium",
                pattern: "Backtracking",
              },
              {
                id: "dsa:recursion-backtracking:perms:permutations",
                name: "Permutations",
                difficulty: "Medium",
                pattern: "Backtracking",
              },
            ],
          },
          {
            id: "combination",
            title: "Combination Search",
            problems: [
              {
                id: "dsa:recursion-backtracking:combination:combination-sum",
                name: "Combination Sum",
                difficulty: "Medium",
                pattern: "Backtracking",
              },
              {
                id: "dsa:recursion-backtracking:constraint:n-queens",
                name: "N-Queens",
                difficulty: "Hard",
                pattern: "Backtracking + Constraints",
              },
            ],
          },
          {
            id: "grid-search",
            title: "Grid Search",
            problems: [
              {
                id: "dsa:recursion-backtracking:grid:word-search",
                name: "Word Search",
                difficulty: "Medium",
                pattern: "Backtracking on Grid",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "trees",
    title: "Trees",
    subtopics: [
      {
        id: "tree-traversal",
        title: "Traversal + Views",
        patterns: [
          {
            id: "dfs-bfs",
            title: "DFS / BFS",
            problems: [
              {
                id: "dsa:trees:traversal:binary-tree-level-order",
                name: "Binary Tree Level Order Traversal",
                difficulty: "Medium",
                pattern: "BFS",
              },
              {
                id: "dsa:trees:traversal:right-side-view",
                name: "Binary Tree Right Side View",
                difficulty: "Medium",
                pattern: "BFS",
              },
            ],
          },
          {
            id: "serialize",
            title: "Serialize / Deserialize",
            problems: [
              {
                id: "dsa:trees:serialize:serialize-deserialize-binary-tree",
                name: "Serialize and Deserialize Binary Tree",
                difficulty: "Hard",
                pattern: "DFS",
              },
            ],
          },
        ],
      },
      {
        id: "tree-advanced",
        title: "Core Algorithms",
        patterns: [
          {
            id: "lca",
            title: "Lowest Common Ancestor",
            problems: [
              {
                id: "dsa:trees:lca:lowest-common-ancestor",
                name: "Lowest Common Ancestor",
                difficulty: "Medium",
                pattern: "DFS",
              },
            ],
          },
          {
            id: "path-sum",
            title: "Path Sums",
            problems: [
              {
                id: "dsa:trees:path-sum:path-sum",
                name: "Path Sum",
                difficulty: "Easy",
                pattern: "DFS",
              },
              {
                id: "dsa:trees:path-sum:binary-tree-maximum-path-sum",
                name: "Binary Tree Maximum Path Sum",
                difficulty: "Hard",
                pattern: "DP on Trees",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "trie",
    title: "Trie",
    subtopics: [
      {
        id: "trie-core",
        title: "Core",
        patterns: [
          {
            id: "build-trie",
            title: "Trie Construction",
            problems: [
              {
                id: "dsa:trie:core:implement-trie",
                name: "Implement Trie",
                difficulty: "Medium",
                pattern: "Trie",
              },
            ],
          },
          {
            id: "trie-search",
            title: "Trie Search",
            problems: [
              {
                id: "dsa:trie:search:word-search-ii",
                name: "Word Search II",
                difficulty: "Hard",
                pattern: "Trie + Backtracking",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "graphs",
    title: "Graphs (incl. Advanced Graphs)",
    subtopics: [
      {
        id: "graph-core",
        title: "Core",
        patterns: [
          {
            id: "bfs-dfs",
            title: "BFS / DFS",
            problems: [
              {
                id: "dsa:graphs:bfs:number-of-islands",
                name: "Number of Islands",
                difficulty: "Medium",
                pattern: "BFS/DFS",
              },
              {
                id: "dsa:graphs:bfs:shortest-path-unweighted",
                name: "Shortest Path (Unweighted) — BFS",
                difficulty: "Medium",
                pattern: "BFS",
              },
            ],
          },
          {
            id: "topo",
            title: "Topological Sort",
            problems: [
              {
                id: "dsa:graphs:topo:course-schedule",
                name: "Course Schedule",
                difficulty: "Medium",
                pattern: "Topological Sort",
              },
            ],
          },
          {
            id: "union-find",
            title: "Union-Find",
            problems: [
              {
                id: "dsa:graphs:uf:redundant-connection",
                name: "Redundant Connection",
                difficulty: "Medium",
                pattern: "Union-Find",
              },
            ],
          },
          {
            id: "dijkstra",
            title: "Dijkstra",
            problems: [
              {
                id: "dsa:graphs:dijkstra:network-delay-time",
                name: "Network Delay Time",
                difficulty: "Medium",
                pattern: "Dijkstra",
              },
            ],
          },
        ],
      },
      {
        id: "graph-advanced",
        title: "Advanced",
        patterns: [
          {
            id: "multi-source-bfs",
            title: "Multi-source BFS",
            problems: [
              {
                id: "dsa:graphs:multi-source:rotting-oranges",
                name: "Rotting Oranges",
                difficulty: "Medium",
                pattern: "Multi-source BFS",
              },
            ],
          },
          {
            id: "zero-one-bfs",
            title: "0-1 BFS",
            problems: [
              {
                id: "dsa:graphs:0-1-bfs:min-cost-grid",
                name: "Minimum Cost Path in Grid",
                difficulty: "Hard",
                pattern: "0-1 BFS",
              },
            ],
          },
          {
            id: "scc",
            title: "SCC (Strongly Connected Components)",
            problems: [
              {
                id: "dsa:graphs:scc:kosaraju-tarjan",
                name: "SCC Decomposition (Kosaraju/Tarjan concept)",
                difficulty: "Hard",
                pattern: "SCC",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "heap",
    title: "Heap / Priority Queue",
    subtopics: [
      {
        id: "heap-core",
        title: "Core",
        patterns: [
          {
            id: "topk",
            title: "Top-K",
            problems: [
              { id: "dsa:heap:topk:top-k-frequent-elements", name: "Top K Frequent Elements", difficulty: "Medium", pattern: "Heap" },
              { id: "dsa:heap:topk:kth-largest", name: "Kth Largest Element", difficulty: "Medium", pattern: "Heap" },
              { id: "dsa:heap:topk:k-closest-points", name: "K Closest Points to Origin", difficulty: "Medium", pattern: "Heap" },
            ],
          },
          {
            id: "stream",
            title: "Streaming / Two Heaps",
            problems: [
              { id: "dsa:heap:stream:median-finder", name: "Find Median from Data Stream", difficulty: "Hard", pattern: "Two Heaps" },
              { id: "dsa:heap:stream:sliding-window-median", name: "Sliding Window Median", difficulty: "Hard", pattern: "Two Heaps" },
            ],
          },
          {
            id: "scheduling",
            title: "Scheduling",
            problems: [
              { id: "dsa:heap:sched:task-scheduler", name: "Task Scheduler", difficulty: "Medium", pattern: "Greedy + Heap" },
              { id: "dsa:heap:sched:ipo", name: "IPO (Maximize Capital)", difficulty: "Hard", pattern: "Two Heaps + Greedy" },
              { id: "dsa:heap:sched:meeting-rooms-ii", name: "Meeting Rooms II", difficulty: "Medium", pattern: "Heap" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    subtopics: [
      {
        id: "dp-1d",
        title: "1D DP",
        patterns: [
          {
            id: "classic-1d",
            title: "Classic 1D",
            problems: [
              { id: "dsa:dp:1d:climbing-stairs", name: "Climbing Stairs", difficulty: "Easy", pattern: "1D DP" },
              { id: "dsa:dp:1d:house-robber", name: "House Robber", difficulty: "Medium", pattern: "1D DP" },
              { id: "dsa:dp:1d:house-robber-ii", name: "House Robber II (Circular)", difficulty: "Medium", pattern: "1D DP" },
              { id: "dsa:dp:1d:coin-change", name: "Coin Change", difficulty: "Medium", pattern: "Unbounded Knapsack" },
              { id: "dsa:dp:1d:word-break", name: "Word Break", difficulty: "Medium", pattern: "DP + Hash Set" },
              { id: "dsa:dp:1d:decode-ways", name: "Decode Ways", difficulty: "Medium", pattern: "1D DP" },
              { id: "dsa:dp:1d:lis", name: "Longest Increasing Subsequence", difficulty: "Medium", pattern: "1D DP / Binary Search" },
            ],
          },
          {
            id: "knapsack",
            title: "Knapsack Variants",
            problems: [
              { id: "dsa:dp:knapsack:0-1-knapsack", name: "0/1 Knapsack", difficulty: "Medium", pattern: "0/1 Knapsack" },
              { id: "dsa:dp:knapsack:partition-equal-subset", name: "Partition Equal Subset Sum", difficulty: "Medium", pattern: "0/1 Knapsack" },
              { id: "dsa:dp:knapsack:target-sum", name: "Target Sum", difficulty: "Medium", pattern: "0/1 Knapsack" },
              { id: "dsa:dp:knapsack:unbounded-knapsack", name: "Unbounded Knapsack", difficulty: "Medium", pattern: "Unbounded Knapsack" },
              { id: "dsa:dp:knapsack:coin-change-ii", name: "Coin Change II (Ways)", difficulty: "Medium", pattern: "Unbounded Knapsack" },
            ],
          },
        ],
      },
      {
        id: "dp-2d",
        title: "2D DP",
        patterns: [
          {
            id: "paths",
            title: "Grid / Paths / Strings",
            problems: [
              { id: "dsa:dp:2d:unique-paths", name: "Unique Paths", difficulty: "Medium", pattern: "2D DP" },
              { id: "dsa:dp:2d:edit-distance", name: "Edit Distance", difficulty: "Hard", pattern: "2D DP" },
              { id: "dsa:dp:2d:lcs", name: "Longest Common Subsequence", difficulty: "Medium", pattern: "2D DP" },
              { id: "dsa:dp:2d:regular-expression", name: "Regular Expression Matching", difficulty: "Hard", pattern: "2D DP" },
              { id: "dsa:dp:2d:wildcard-matching", name: "Wildcard Matching", difficulty: "Hard", pattern: "2D DP" },
            ],
          },
          {
            id: "interval-dp",
            title: "Interval DP",
            problems: [
              { id: "dsa:dp:interval:burst-balloons", name: "Burst Balloons", difficulty: "Hard", pattern: "Interval DP" },
              { id: "dsa:dp:interval:palindrome-partitioning-ii", name: "Palindrome Partitioning II", difficulty: "Hard", pattern: "Interval DP" },
              { id: "dsa:dp:interval:stone-merge", name: "Minimum Cost to Merge Stones", difficulty: "Hard", pattern: "Interval DP" },
              { id: "dsa:dp:interval:matrix-chain", name: "Matrix Chain Multiplication", difficulty: "Hard", pattern: "Interval DP" },
            ],
          },
          {
            id: "dp-trees",
            title: "DP on Trees",
            problems: [
              { id: "dsa:dp:trees:binary-tree-max-path-sum", name: "Binary Tree Maximum Path Sum", difficulty: "Hard", pattern: "DP on Trees" },
              { id: "dsa:dp:trees:house-robber-iii", name: "House Robber III", difficulty: "Medium", pattern: "DP on Trees" },
              { id: "dsa:dp:trees:diameter-of-tree", name: "Diameter of Binary Tree", difficulty: "Easy", pattern: "DP on Trees" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "bit-manipulation",
    title: "Bit Manipulation",
    subtopics: [
      {
        id: "bit-core",
        title: "Core",
        patterns: [
          {
            id: "xor",
            title: "XOR",
            problems: [
              {
                id: "dsa:bit:xor:single-number",
                name: "Single Number",
                difficulty: "Easy",
                pattern: "XOR",
              },
            ],
          },
          {
            id: "bit-dp",
            title: "Bit DP / Counting",
            problems: [
              {
                id: "dsa:bit:counting:counting-bits",
                name: "Counting Bits",
                difficulty: "Easy",
                pattern: "Bit DP",
              },
              {
                id: "dsa:bit:tricks:hamming-distance",
                name: "Hamming Distance",
                difficulty: "Easy",
                pattern: "Bit Tricks",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "segment-tree",
    title: "Segment Tree (Optional Advanced)",
    subtopics: [
      {
        id: "seg-core",
        title: "Range Queries",
        patterns: [
          {
            id: "range-sum",
            title: "Range Sum / Min",
            problems: [
              {
                id: "dsa:segment-tree:range:range-sum-query-mutable",
                name: "Range Sum Query — Mutable",
                difficulty: "Medium",
                pattern: "Segment Tree",
              },
            ],
          },
        ],
      },
    ],
  },
];
