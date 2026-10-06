export type Step = {
  name: string;
  body: string;
};

/** A real sequence, so it is numbered 1 to 4. */
export const processSteps: Step[] = [
  {
    name: "Listen",
    body: "Two weeks reading your comments, reviews, and DMs before we post anything. Then we tell you what we heard.",
  },
  {
    name: "Plan",
    body: "A month of posts on one shared calendar, approved in one meeting, with room left for whatever happens next.",
  },
  {
    name: "Publish",
    body: "We post, reply, and moderate in shifts, around the clock. Nothing waits until Monday.",
  },
  {
    name: "Learn",
    body: "A one-page report every Monday: what worked, what didn't, and what changes this week.",
  },
];
