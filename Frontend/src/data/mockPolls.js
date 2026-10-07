const now = Date.now();

const minutesFromNow = (minutes) =>
  new Date(now + minutes * 60 * 1000).toISOString();

const hoursAgo = (hours) =>
  new Date(now - hours * 60 * 60 * 1000).toISOString();

export const MOCK_POLLS = [
  {
    id: "1",
    category: "others",
    question: "What's the best way to spend a Friday?",
    description:
      "How do you prefer to spend your Friday after a long week? Cast your vote and see what other Voxa users prefer.",

    options: [
      { id: "a", text: "Go clubbing" },
      { id: "b", text: "Netflix and chill" },
      { id: "c", text: "Sleep throughout" },
    ],

    status: "published",
    resultsVisibility: "after_vote",

    results: [
      { optionId: "a", percentage: 25 },
      { optionId: "b", percentage: 45 },
      { optionId: "c", percentage: 30 },
    ],

    votesCount: 1200,
    trending: false,
    createdAt: hoursAgo(5),
    closesAt: minutesFromNow(180),

    creator: {
      id: "mock-user-1",
      name: "Admin",
      initials: "AU",
    },
  },

  {
    id: "2",
    category: "food",
    question: "Rice or Beans?",
    description:
      "Which would you rather have for your next meal? Cast your vote and see what Voxa users think.",

    options: [
      { id: "a", text: "Rice" },
      { id: "b", text: "Beans" },
      { id: "c", text: "I rather eat swallow" },
    ],

    status: "published",
    resultsVisibility: "after_vote",

    results: [
      { optionId: "a", percentage: 50 },
      { optionId: "b", percentage: 15 },
      { optionId: "c", percentage: 35 },
    ],

    votesCount: 350,
    trending: true,
    createdAt: hoursAgo(2),
    closesAt: minutesFromNow(30),

    creator: {
      id: "mock-user-2",
      name: "Wummi",
      initials: "WU",
    },
  },

  {
    id: "3",
    category: "education",
    question: "Should 8a.m classes be banned?",
    description:
      "Early morning classes can be difficult for students. What do you think should happen to 8a.m classes?",

    options: [
      { id: "a", text: "Yes" },
      { id: "b", text: "No" },
      { id: "c", text: "Move to 9a.m" },
    ],

    status: "published",
    resultsVisibility: "after_vote",

    results: [
      { optionId: "a", percentage: 45 },
      { optionId: "b", percentage: 20 },
      { optionId: "c", percentage: 35 },
    ],

    votesCount: 1000,
    trending: true,
    createdAt: hoursAgo(1),
    closesAt: minutesFromNow(60),

    creator: {
      id: "mock-user-1",
      name: "Admin",
      initials: "AU",
    },
  },

  {
    id: "4",
    category: "technology",
    question: "Which device do you use most for studying?",
    description:
      "Technology plays a major role in learning. Which device do you rely on most when studying?",

    options: [
      { id: "a", text: "Laptop" },
      { id: "b", text: "Smartphone" },
      { id: "c", text: "Tablet" },
    ],

    status: "published",
    resultsVisibility: "after_vote",

    results: [
      { optionId: "a", percentage: 55 },
      { optionId: "b", percentage: 35 },
      { optionId: "c", percentage: 10 },
    ],

    votesCount: 850,
    trending: false,
    createdAt: hoursAgo(3),
    closesAt: minutesFromNow(2880),

    creator: {
      id: "mock-user-1",
      name: "Admin",
      initials: "AU",
    },
  },

  {
    id: "5",
    category: "sports",
    question: "What's your favourite sport?",
    description:
      "From the options below, choose the sport you enjoy watching or playing the most.",

    options: [
      { id: "a", text: "Football" },
      { id: "b", text: "Basketball" },
      { id: "c", text: "Tennis" },
    ],

    status: "published",
    resultsVisibility: "after_vote",

    results: [
      { optionId: "a", percentage: 65 },
      { optionId: "b", percentage: 25 },
      { optionId: "c", percentage: 10 },
    ],

    votesCount: 2100,
    trending: true,
    createdAt: hoursAgo(0.5),
    closesAt: minutesFromNow(360),

    creator: {
      id: "mock-user-3",
      name: "Elev",
      initials: "EV",
    },
  },

  {
    id: "6",
    category: "lifestyle",
    question: "How do you prefer to spend your weekends?",
    description:
      "Everyone spends their free time differently. Tell us how you usually prefer to spend your weekends.",

    options: [
      { id: "a", text: "Going out with friends" },
      { id: "b", text: "Staying at home" },
      { id: "c", text: "Learning something new" },
    ],

    status: "published",
    resultsVisibility: "after_vote",

    results: [
      { optionId: "a", percentage: 30 },
      { optionId: "b", percentage: 40 },
      { optionId: "c", percentage: 30 },
    ],

    votesCount: 430,
    trending: false,
    createdAt: hoursAgo(8),
    closesAt: minutesFromNow(720),

    creator: {
      id: "mock-user-4",
      name: "Philip",
      initials: "PH",
    },
  },
];