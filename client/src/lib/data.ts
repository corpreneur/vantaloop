/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Data model for the Vanta-Metalab Design Feedback Kanban board.
 * All data is client-side; this is a functional mockup.
 */

export type EpicId = "EPIC-01" | "EPIC-02" | "EPIC-03" | "EPIC-04";

export interface Epic {
  id: EpicId;
  name: string;
  description: string;
  color: string; // left-border accent
}

export const EPICS: Epic[] = [
  {
    id: "EPIC-01",
    name: "Feedback Hub Setup",
    description: "Establish the shared Notion workspace, templates, and onboard both teams.",
    color: "#000000",
  },
  {
    id: "EPIC-02",
    name: "Design Share & Feedback",
    description: "Define the process for sharing concepts and submitting structured feedback.",
    color: "#C4956A",
  },
  {
    id: "EPIC-03",
    name: "Synthesis & Decisions",
    description: "Triage, synthesize, and drive clear decisions on each design concept.",
    color: "#888888",
  },
  {
    id: "EPIC-04",
    name: "Agentic Aggregation",
    description: "Explore AI-driven automation for gathering and summarizing feedback.",
    color: "#D4A853",
  },
];

export type ColumnId =
  | "new-concept"
  | "feedback-submitted"
  | "in-review"
  | "decision-made"
  | "archived";

export interface Column {
  id: ColumnId;
  title: string;
  description: string;
}

export const COLUMNS: Column[] = [
  {
    id: "new-concept",
    title: "New Concept",
    description: "Design concepts awaiting feedback",
  },
  {
    id: "feedback-submitted",
    title: "Feedback Submitted",
    description: "Concepts with structured feedback from Vanta",
  },
  {
    id: "in-review",
    title: "In Review",
    description: "Feedback being synthesized and discussed",
  },
  {
    id: "decision-made",
    title: "Decision Made",
    description: "Concepts with a clear path forward",
  },
  {
    id: "archived",
    title: "Archived",
    description: "Completed or deferred items",
  },
];

export type TeamMember = {
  name: string;
  initials: string;
  team: "Vanta" | "Metalab";
};

export const TEAM_MEMBERS: TeamMember[] = [
  { name: "William Traylor", initials: "WT", team: "Vanta" },
  { name: "Glenn Teuber", initials: "GT", team: "Vanta" },
  { name: "Leon Anderson", initials: "LA", team: "Vanta" },
  { name: "Sue", initials: "SU", team: "Metalab" },
  { name: "Edy Goulet", initials: "EG", team: "Metalab" },
];

export type CriticalQuestion =
  | "Is this the right problem?"
  | "Which concept direction is strongest?"
  | "What are the biggest risks?"
  | "What should we prototype next?";

export type Decision =
  | "Proceed with concept A"
  | "Proceed with concept B"
  | "Combine A + B"
  | "Pause, redefine problem";

export interface FeedbackCard {
  id: string;
  title: string;
  epicId: EpicId;
  columnId: ColumnId;
  assignee?: TeamMember;
  createdAt: string;
  // Structured feedback fields
  goalOfShare: string;
  whatsWorking: string[];
  questionsRisks: string[];
  suggestions: string[];
  decisionNeeded: string;
  // Critical questions
  criticalQuestions: CriticalQuestion[];
  // Clarity + value
  whatsClear: string;
  whatsConfusing: string;
  hookValue: string;
  // Flow at 10,000 feet
  happyPath: string[];
  hesitationPoints: string[];
  // Decision
  decision?: Decision;
  decisionRationale?: string;
  // Priority
  priority: "P0" | "P1" | "P2" | "P3";
}

export const INITIAL_CARDS: FeedbackCard[] = [
  {
    id: "card-1",
    title: "Notion Workspace Structure",
    epicId: "EPIC-01",
    columnId: "decision-made",
    assignee: TEAM_MEMBERS[3], // Sue
    createdAt: "2026-02-24",
    goalOfShare: "Decide on the Notion workspace structure and template format for the feedback loop.",
    whatsWorking: [
      "Existing Metalab templates provide a strong starting point",
      "Both teams aligned on the need for structured feedback",
    ],
    questionsRisks: [
      "Will the template be too rigid for early-stage concept feedback?",
      "How do we handle feedback that spans multiple concepts?",
    ],
    suggestions: [
      "Start with the User Feedback Tracker template and customize",
      "Add a 'cross-concept' tag for feedback that applies broadly",
    ],
    decisionNeeded: "Which Notion template to use as the base",
    criticalQuestions: ["Is this the right problem?"],
    whatsClear: "The need for structured feedback is clear to both teams.",
    whatsConfusing: "The relationship between the two Notion links shared is unclear.",
    hookValue: "A single source of truth for design feedback that drives decisions, not just opinions.",
    happyPath: [
      "Designer creates concept card",
      "Fills out template fields",
      "Vanta team reviews and adds feedback",
      "Product lead synthesizes and decides",
    ],
    hesitationPoints: ["Team members may default to Slack instead of Notion"],
    decision: "Proceed with concept A",
    decisionRationale: "Use the User Feedback Tracker as the base template, customized with the structured fields from William's thought starters.",
    priority: "P0",
  },
  {
    id: "card-2",
    title: "Onboarding Flow for Both Teams",
    epicId: "EPIC-01",
    columnId: "in-review",
    assignee: TEAM_MEMBERS[3], // Sue
    createdAt: "2026-02-25",
    goalOfShare: "Define how both Vanta and Metalab team members are onboarded to the new feedback process.",
    whatsWorking: [
      "Sue has experience spinning up shared Notion spaces",
      "Small team size makes onboarding manageable",
    ],
    questionsRisks: [
      "Do all team members have Notion accounts?",
      "How much process documentation is too much for a small team?",
    ],
    suggestions: [
      "Create a one-page 'How to Use This Board' guide pinned at the top",
      "Run a 15-minute walkthrough in the next shared meeting",
    ],
    decisionNeeded: "Approve the onboarding approach",
    criticalQuestions: ["What should we prototype next?"],
    whatsClear: "The template structure is well-defined.",
    whatsConfusing: "Nothing major, but the distinction between 'concept-level' and 'pixel-level' feedback needs reinforcement.",
    hookValue: "Get everyone contributing structured feedback within 24 hours of setup.",
    happyPath: [
      "Invite all members to Notion space",
      "Share the how-to guide",
      "Run a live walkthrough",
      "First real concept card is created",
    ],
    hesitationPoints: ["Some team members may not check Notion regularly"],
    priority: "P1",
  },
  {
    id: "card-3",
    title: "Mobile App Concept Direction",
    epicId: "EPIC-02",
    columnId: "new-concept",
    assignee: TEAM_MEMBERS[4], // Edy
    createdAt: "2026-02-26",
    goalOfShare: "Present two concept directions for the Vanta mobile app onboarding flow and get alignment on which to pursue.",
    whatsWorking: [
      "Strong visual identity established in the brand guidelines",
      "Clear user persona for creative entrepreneurs",
    ],
    questionsRisks: [
      "Concept A is more innovative but riskier from a usability standpoint",
      "Concept B is safer but may not differentiate enough",
    ],
    suggestions: [
      "Test both concepts with 3-5 users before committing",
      "Consider a hybrid that takes the navigation model from B and the visual language from A",
    ],
    decisionNeeded: "Which concept direction to prototype",
    criticalQuestions: [
      "Which concept direction is strongest?",
      "What are the biggest risks?",
    ],
    whatsClear: "The target user and their primary job-to-be-done.",
    whatsConfusing: "How the AI features integrate into the onboarding flow.",
    hookValue: "An onboarding experience that makes creative entrepreneurs feel like Vanta 'gets' them.",
    happyPath: [
      "User downloads app",
      "Sees personalized welcome based on creative type",
      "Connects existing tools in 2 taps",
      "Experiences first AI-powered moment",
      "Activates their line",
    ],
    hesitationPoints: [
      "Tool connection step may feel invasive",
      "AI moment needs to deliver immediate, tangible value",
    ],
    priority: "P0",
  },
  {
    id: "card-4",
    title: "Dashboard Information Architecture",
    epicId: "EPIC-02",
    columnId: "feedback-submitted",
    assignee: TEAM_MEMBERS[4], // Edy
    createdAt: "2026-02-25",
    goalOfShare: "Review the proposed information architecture for the main dashboard and validate the hierarchy of information.",
    whatsWorking: [
      "Usage data and billing are prominently placed",
      "AI assistant entry point is discoverable",
    ],
    questionsRisks: [
      "Too many widgets on the initial dashboard view",
      "The 'Formulas' section may confuse users who are new to the concept",
    ],
    suggestions: [
      "Reduce the dashboard to 3 primary cards on first load",
      "Add a progressive disclosure pattern for Formulas",
    ],
    decisionNeeded: "Approve the IA hierarchy or request revision",
    criticalQuestions: ["Is this the right problem?", "What are the biggest risks?"],
    whatsClear: "The primary user needs: check usage, manage account, access AI tools.",
    whatsConfusing: "The relationship between 'Formulas' and 'AI Assistant' is not immediately obvious.",
    hookValue: "A dashboard that surfaces the right information at the right time without overwhelming.",
    happyPath: [
      "User opens app",
      "Sees usage summary and key actions",
      "Taps into AI assistant or Formula",
      "Returns to dashboard to check result",
    ],
    hesitationPoints: ["Users may not understand what Formulas are on first encounter"],
    priority: "P1",
  },
  {
    id: "card-5",
    title: "Weekly Feedback Digest Automation",
    epicId: "EPIC-04",
    columnId: "new-concept",
    assignee: TEAM_MEMBERS[0], // William
    createdAt: "2026-02-26",
    goalOfShare: "Explore building an agentic workflow that aggregates weekly feedback into a digest.",
    whatsWorking: [
      "The structured template provides consistent data to aggregate",
      "Notion API enables programmatic access to feedback data",
    ],
    questionsRisks: [
      "Summarization quality depends on the quality of input feedback",
      "Risk of over-engineering for a small team",
    ],
    suggestions: [
      "Start with a simple weekly email digest before building full automation",
      "Explore Notebook LLM for podcast-style summaries as a stretch goal",
    ],
    decisionNeeded: "Whether to invest in automation now or after the manual process is validated",
    criticalQuestions: ["What should we prototype next?"],
    whatsClear: "The vision for AI-native feedback aggregation.",
    whatsConfusing: "The priority relative to getting the manual feedback loop working first.",
    hookValue: "Spend 0 minutes aggregating feedback, get a complete weekly brief automatically.",
    happyPath: [
      "Agent reads Notion database",
      "Aggregates feedback by concept and theme",
      "Generates summary with key decisions and open items",
      "Delivers via email or Slack",
    ],
    hesitationPoints: ["Team may not trust AI summaries initially"],
    priority: "P3",
  },
  {
    id: "card-6",
    title: "Feedback Template Field Validation",
    epicId: "EPIC-01",
    columnId: "feedback-submitted",
    assignee: TEAM_MEMBERS[2], // Leon
    createdAt: "2026-02-26",
    goalOfShare: "Validate that the structured feedback template fields capture everything needed for concept-level decisions.",
    whatsWorking: [
      "William's thought starters cover the key dimensions well",
      "The 'Decision needed today' field forces action-orientation",
    ],
    questionsRisks: [
      "Template may feel too long for quick feedback rounds",
      "Some fields may not apply to every type of design share",
    ],
    suggestions: [
      "Make 'Goal of this share' and 'Decision needed' required, rest optional",
      "Add a 'Quick Take' mode with just 3 fields for lightweight feedback",
    ],
    decisionNeeded: "Finalize which fields are required vs. optional",
    criticalQuestions: ["Is this the right problem?"],
    whatsClear: "The goal of structured, decision-oriented feedback.",
    whatsConfusing: "Whether all fields should be mandatory for every feedback submission.",
    hookValue: "A template that takes 5 minutes to fill out but captures 90% of what matters.",
    happyPath: [
      "Open template",
      "Fill in goal and decision needed",
      "Add working/risks/suggestions",
      "Submit feedback",
    ],
    hesitationPoints: ["Long template may discourage quick feedback"],
    priority: "P1",
  },
];
