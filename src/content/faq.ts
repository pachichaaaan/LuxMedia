export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export const faq: Faq[] = [
  {
    id: "start",
    question: "How quickly can you start?",
    answer:
      "Most clients are live within three weeks: one week to listen, one to plan, and one to produce the first month of posts. Community management can start sooner if something is already on fire.",
  },
  {
    id: "all-services",
    question: "Do we have to sign up for all six services?",
    answer:
      "No. Most clients start with two, usually content and community management, and add more once they've read a few Monday reports.",
  },
  {
    id: "who",
    question: "Who will actually run our accounts?",
    answer:
      "A named team: a lead, an editor, and whoever is on shift at the community desk. You'll meet them before you sign, and they'll be the same people six months later.",
  },
  {
    id: "always-on",
    question: "How does 24/7 work in practice?",
    answer:
      "Three teams in three time zones hand over at the end of each shift with written notes. Someone is always reading your comments, including at 3am on a public holiday.",
  },
  {
    id: "cost",
    question: "What does it cost?",
    answer:
      "Retainers start at $8,000 a month for one service on two platforms. Paid media budgets are separate and go straight to the platforms. We'll give you a proper quote after the first call.",
  },
  {
    id: "ownership",
    question: "Who owns the content you make?",
    answer:
      "You do. Everything we make for you is yours, including the raw footage. Creator content comes with usage rights written into the contract, so there are no surprises later.",
  },
];
