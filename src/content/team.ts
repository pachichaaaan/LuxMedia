import type { Visual } from "./types";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  city: string;
  timezone: string;
  portrait: Visual;
};

const portrait = (id: string, name: string, tone: Visual["tone"]): Visual => ({
  id: `team-${id}`,
  ratio: "4:5",
  label: `Portrait, ${name.split(" ")[0]}`,
  alt: `Portrait of ${name}.`,
  tone,
});

/** People are fictional. Three time zones, matching the three shifts. */
export const team: TeamMember[] = [
  {
    id: "aiko-santos",
    name: "Aiko Santos",
    role: "Co-founder, managing director",
    city: "Manila",
    timezone: "Asia/Manila",
    portrait: portrait("aiko-santos", "Aiko Santos", "dusk"),
  },
  {
    id: "ben-lacson",
    name: "Ben Lacson",
    role: "Co-founder, head of studio",
    city: "Manila",
    timezone: "Asia/Manila",
    portrait: portrait("ben-lacson", "Ben Lacson", "lilac"),
  },
  {
    id: "rita-monteiro",
    name: "Rita Monteiro",
    role: "Head of community",
    city: "Lisbon",
    timezone: "Europe/Lisbon",
    portrait: portrait("rita-monteiro", "Rita Monteiro", "haze"),
  },
  {
    id: "tomas-herrera",
    name: "Tomás Herrera",
    role: "Night desk lead",
    city: "Mexico City",
    timezone: "America/Mexico_City",
    portrait: portrait("tomas-herrera", "Tomás Herrera", "midnight"),
  },
  {
    id: "joy-villanueva",
    name: "Joy Villanueva",
    role: "Strategy director",
    city: "Manila",
    timezone: "Asia/Manila",
    portrait: portrait("joy-villanueva", "Joy Villanueva", "lilac"),
  },
  {
    id: "carla-duarte",
    name: "Carla Duarte",
    role: "Senior editor, short-form",
    city: "Lisbon",
    timezone: "Europe/Lisbon",
    portrait: portrait("carla-duarte", "Carla Duarte", "dusk"),
  },
  {
    id: "miguel-andrade",
    name: "Miguel Andrade",
    role: "Paid social lead",
    city: "Mexico City",
    timezone: "America/Mexico_City",
    portrait: portrait("miguel-andrade", "Miguel Andrade", "haze"),
  },
  {
    id: "nina-reyes",
    name: "Nina Reyes",
    role: "Creator partnerships lead",
    city: "Manila",
    timezone: "Asia/Manila",
    portrait: portrait("nina-reyes", "Nina Reyes", "midnight"),
  },
  {
    id: "sam-okonkwo",
    name: "Sam Okonkwo",
    role: "Data and reporting",
    city: "Lisbon",
    timezone: "Europe/Lisbon",
    portrait: portrait("sam-okonkwo", "Sam Okonkwo", "lilac"),
  },
  {
    id: "lea-fontaine",
    name: "Léa Fontaine",
    role: "Community manager",
    city: "Lisbon",
    timezone: "Europe/Lisbon",
    portrait: portrait("lea-fontaine", "Léa Fontaine", "dusk"),
  },
  {
    id: "paolo-cruz",
    name: "Paolo Cruz",
    role: "Motion designer",
    city: "Manila",
    timezone: "Asia/Manila",
    portrait: portrait("paolo-cruz", "Paolo Cruz", "haze"),
  },
  {
    id: "daniela-ortiz",
    name: "Daniela Ortiz",
    role: "Account director",
    city: "Mexico City",
    timezone: "America/Mexico_City",
    portrait: portrait("daniela-ortiz", "Daniela Ortiz", "midnight"),
  },
];
