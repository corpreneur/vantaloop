# Lovable.dev Toolkit Prompt: Vanta-Metalab Design Feedback Hub

## 1. Project Overview

This project is to build a dedicated, web-based Design Feedback Hub to streamline the collaborative design process between Vanta Wireless and the external design firm, Metalab. The application will serve as a structured, decision-oriented feedback loop, moving away from ad-hoc communication channels. It will be a single-page application (SPA) centered around a Kanban-style board where design concepts are submitted, reviewed, and decided upon. The core goal is to create a system of record for design feedback, ensuring clarity, accountability, and a searchable history of all design-related decisions. The system is commissioned by William Traylor (CBO, Vanta) to manage the workstream with Glenn Teuber, Leon Anderson (Vanta), and Sue, Edy Goulet (Metalab).

## 2. Tech Stack

- **Framework**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **Routing**: Wouter
- **State Management**: Zustand

## 3. Design System

- **Aesthetic**: "Clean Slate" -- a B/W monochrome theme that is minimalist and content-focused.
- **Accent Color**: A warm copper for all interactive elements, calls-to-action, and highlights.
- **Typography**:
  - Display/Headings: Instrument Serif
  - Body/UI Text: Satoshi
- **CSS Variables**:

```css
:root {
  --background: oklch(99.5% 0 0);
  --foreground: oklch(5% 0 0);
  --card: oklch(98% 0 0);
  --card-foreground: oklch(5% 0 0);
  --popover: oklch(98% 0 0);
  --popover-foreground: oklch(5% 0 0);
  --primary: oklch(0.68 0.08 55);
  --primary-foreground: oklch(99.5% 0 0);
  --border: oklch(90% 0 0);
  --input: oklch(90% 0 0);
  --ring: oklch(0.68 0.08 55);
}
```

## 4. Data Model (TypeScript Interfaces)

```typescript
// enums.ts
export enum Priority {
  P0 = "P0",
  P1 = "P1",
  P2 = "P2",
  P3 = "P3",
}

export enum FeedbackTag {
  ConceptDirection = "concept-direction",
  InformationArchitecture = "information-architecture",
  InteractionPattern = "interaction-pattern",
  VisualDesign = "visual-design",
  CopyContent = "copy-content",
}

// models.ts
export interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string; // e.g., 'CBO, Vanta'
}

export interface Epic {
  id: string;
  name: string;
  description: string;
}

export interface Column {
  id: string; // 'new-concept', 'feedback-submitted', etc.
  title: string;
  cardIds: string[];
}

export interface Comment {
  id: string;
  author: TeamMember;
  content: string;
  createdAt: string; // ISO 8601 Date String
  threadId?: string; // For threaded replies
}

export interface FeedbackCard {
  id: string;
  title: string;
  epicId: string;
  columnId: string;
  assignee?: TeamMember;
  createdAt: string; // ISO 8601 Date String
  updatedAt: string; // ISO 8601 Date String
  tags: FeedbackTag[];
  comments: Comment[];
  goalOfShare: string;
  whatsWorking: string[];
  questionsRisks: string[];
  suggestions: string[];
  decisionNeeded: string;
  criticalQuestions: string[];
  whatsClear: string;
  whatsConfusing: string;
  hookValue: string;
  happyPath: string[];
  hesitationPoints: string[];
  decision?: string;
  decisionRationale?: string;
  priority: Priority;
}

export interface WeeklyDigest {
  id: string;
  weekOf: string; // e.g., '2026-03-02'
  summary: string; // AI-generated summary
  audioSummaryUrl?: string;
  cardsMoved: { cardId: string; from: string; to: string; }[];
  decisionsMade: { cardId: string; decision: string; }[];
}

export interface SlackNotification {
  id: string;
  cardId: string;
  message: string;
  channel: '#shared-vanta-metalab';
  timestamp: string;
}
```

## 5. Component Tree

- `App`
  - `Router` (Wouter)
    - `Header`
      - `Logo`
      - `Navigation` (Board, Timeline, Decision Log, Digest)
      - `UserMenu`
    - `Route (path="/")` -> `BoardView`
      - `BoardColumn` (x5)
        - `Card`
          - `CardHeader` (Title, Priority, Assignee)
          - `CardBadges` (Tags, Stale Indicator)
    - `Route (path="/timeline")` -> `TimelineView`
      - `ActivityItem`
    - `Route (path="/decision-log")` -> `DecisionLogView`
      - `DecisionRow`
    - `Route (path="/digest")` -> `DigestView`
      - `DigestPlayer`
      - `DigestContent`
    - `CardModal` (Triggered on Card click)
      - `CardDetailView`
        - `StructuredFeedbackSection`
        - `CommentThread`
          - `Comment`
          - `CommentInput`
      - `NewCardForm` (Triggered from "New Card" button)

## 6. Page Routes and Views

- **`/` (Board View)**: The main Kanban board. Columns are "New Concept", "Feedback Submitted", "In Review", "Decision Made", "Archived". Users can drag and drop cards between columns. A "New Card" button is present.
- **`/timeline` (Timeline View)**: A reverse-chronological feed of all activities across all cards (creation, comments, moves, decisions).
- **`/decision-log` (Decision Log View)**: A filterable and searchable table view of all cards that have a `decision` and `decisionRationale` filled. Shows card title, decision, and date.
- **`/digest` (Digest View)**: A view to access historical weekly digests. Includes the AI-generated text summary and an embedded player for the podcast-style audio summary.

## 7. Feature Specifications

1.  **New Card Creation Flow**: A button on the Board View opens a modal with a form. The form fields directly map to the structured feedback template (`goalOfShare`, `whatsWorking`, etc.).
2.  **Threaded Comments**: On the `CardDetailView`, comments are displayed. Users can reply to a specific comment, creating a visual thread.
3.  **Timeline/Activity View**: A dedicated page at `/timeline` that aggregates all state changes and comments from all cards into a single, real-time feed.
4.  **Priority and Assignee Filters**: On the Board View, implement filter chips for `Priority` (P0-P3) and `Assignee`. Multiple filters can be active at once.
5.  **Weekly Digest Generation**: A server-side process (simulated) runs weekly. It summarizes all activity (cards moved, decisions made) into a `WeeklyDigest` object. This should be displayed on the `/digest` page.
6.  **Podcast-style Audio Summary**: On the `/digest` page, alongside the text summary, include an HTML5 audio player to play a fictional audio summary (`audioSummaryUrl`).
7.  **Slack Integration**: When a new card is created or a decision is made, a `SlackNotification` object is created. This is a data-only feature; no actual API call is needed. Just show the notification object in a debug view.
8.  **Decision Log View**: A table at `/decision-log` that only shows cards from the "Decision Made" or "Archived" columns. Key columns: Card Title, Decision, Rationale, Date.
9.  **Feedback Type Tags**: When creating or editing a card, users can add multiple tags from the `FeedbackTag` enum. These are displayed as badges on the card.
10. **Stale Card Indicator**: On the Board View, any card that has not had its `updatedAt` field changed in more than 5 business days should display a small, noticeable visual indicator (e.g., a small clock icon with a copper color).

## 8. Sample Seed Data (6 Cards)

Provide an array of 6 `FeedbackCard` objects. Populate them with realistic data reflecting different stages of the feedback process. Include at least one card in "New Concept", two in "Feedback Submitted", two in "In Review", and one in "Decision Made". Assign different team members and priorities.

## 9. Interaction Specifications

- **Hover States**: All interactive elements (buttons, links, cards, filter chips) should have a subtle hover state, e.g., a slight lift/scale (`scale: 1.02`) or a change in background color.
- **Transitions**: Card movements between columns should be animated smoothly using Framer Motion. The layout should reflow gracefully.
- **Animations**: Opening the `CardModal` should be a gentle fade-in and scale-up animation. Page transitions can be a simple cross-fade.
- **Drag and Drop**: Implement drag and drop for cards on the board view. The card being dragged should have a distinct visual style (e.g., slight rotation and shadow).

## 10. As-Built Audit (vantaloop.lovable.app -- Feb 26, 2026)

The following section documents the results of a functional audit against the live Lovable deployment. Use these findings to prioritize the next iteration of development.

### Critical Remediation Prompts

Copy and paste these prompts directly into Lovable to fix the three blocking issues:

**Prompt 1 -- Fix New Card Dialog (P0 Blocker):**

> The "New Card" button in the Board View header does not open any dialog or modal when clicked. Please wire the button's onClick handler to open a modal dialog containing a multi-step form. The form fields should map to the FeedbackCard data model: title, epicId (dropdown), priority (P0-P3 radio), assignee (dropdown of team members), tags (multi-select from FeedbackTag enum), goalOfShare (textarea, required), whatsWorking (textarea), questionsRisks (textarea), suggestions (textarea), decisionNeeded (textarea, required), and criticalQuestions (textarea). On submit, create a new FeedbackCard object with a generated UUID, set columnId to "new-concept", set createdAt and updatedAt to now, and add it to the board state. Close the modal after successful submission.

**Prompt 2 -- Add Comment Input Field (P0 Blocker):**

> The card detail panel displays existing comments but has no input field for adding new ones. At the bottom of the CommentThread section in the CardDetailView, add a CommentInput component. This should include: a dropdown or avatar selector for the comment author (from the team members list), a textarea for the comment content, and a "Post Comment" button. On submit, create a new Comment object with a generated UUID, the selected author, the content, and the current timestamp. Append it to the card's comments array and re-render the thread. The textarea should clear after submission.

**Prompt 3 -- Add Slack Notification Log (P1 Gap):**

> There is no Slack integration visible in the application. On the Weekly Digest page (/digest), add a "Slack Notifications" section below the Audio Summary section. This should display a list of SlackNotification objects showing: the notification message, the card title it references, the channel name (#shared-vanta-metalab), and the timestamp. Populate it with 3-4 sample notifications matching the seed data events (e.g., "New card created: Mobile App Concept Direction", "Decision made: Notion Workspace Structure"). Style the notifications with a subtle left border accent and a Slack-like message format.

### Enhancement Prompts

These prompts address non-blocking improvements to bring the build closer to the full specification:

**Prompt 4 -- Enrich Decision Log:**

> On the Decision Log page (/decision-log), add a search input field above the table that filters rows by keyword across all columns. Add a "Pending Decisions" section below the main table that shows cards currently in the "In Review" column that have a non-empty decisionNeeded field. Display these pending items in a lighter card format with the card title, the decision needed text, and the assignee.

**Prompt 5 -- Enrich Weekly Digest:**

> On the Weekly Digest page (/digest), restructure the summary section into a four-quadrant grid layout: (1) New Concepts submitted this week, (2) Decisions Made this week, (3) Open Items still in review, (4) Stale Cards flagged this week. Each quadrant should list the relevant card titles with their priority badges. Below the grid, add an HTML5 audio player element with play/pause controls, a progress bar, and a duration display. The audio source can be empty for now, but the player UI should be fully rendered.

**Prompt 6 -- Add Drag and Drop:**

> On the Board View, implement drag and drop for cards between columns. Use @dnd-kit/core and @dnd-kit/sortable. When a card is dragged, it should have a slight rotation (2 degrees) and an elevated shadow. When dropped into a new column, update the card's columnId in state and animate the layout reflow with Framer Motion. Also update the card's updatedAt timestamp to the current time when moved.

---

*This toolkit is prepared exclusively for Vanta Wireless and its design partner, Metalab.*
