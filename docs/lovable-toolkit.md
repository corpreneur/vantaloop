
_VantaLoop Design Feedback System -- Lovable Toolkit Prompt_

## 1. System Overview and Architecture

The VantaLoop system is a two-stage design feedback collection and management tool for the Vanta Wireless team. It is designed to capture raw, unstructured feedback through accessible channels and then triage it into a structured, actionable register.

*   **Stage 1: Intake:** Team members can submit feedback via a public, mobile-first web form or a conversational SMS loop. This stage prioritizes ease of submission to encourage a high volume of input.
*   **Stage 2: Triage & Register:** A protected dashboard allows designated reviewers (William Traylor, Sue from Metalab) to review all intake items weekly. Actionable feedback is promoted to a formal Kanban-style register for tracking and resolution.

**Technical Architecture:**

*   **Frontend:** React 19, Tailwind 4
*   **Backend:** Node.js with Express 4
*   **API:** tRPC 11 for end-to-end typesafe API routes
*   **Database:** MySQL
*   **ORM:** Drizzle ORM
*   **SMS:** Twilio API for the conversational intake channel

This architecture provides a modern, scalable, and type-safe foundation for the application.

## 2. Component & Page Specifications

### a. `SubmitFeedback` Page (`/submit`)

**Purpose:** Public, mobile-first form for submitting raw feedback. No authentication required.

**Component Breakdown:**
*   A single-page React component handling the form state and submission.
*   Uses Tailwind CSS for responsive styling.
*   Form fields correspond to the structured feedback template.

**Fields:**
*   Submitter Name (text input, optional)
*   Feedback Type (select dropdown: `concept-direction`, `information-architecture`, `interaction-pattern`, `visual-design`, `copy-content`, `general`)
*   Subject (text input, required)
*   Goal of Share (textarea, optional)
*   What's Working (textarea, optional)
*   Questions/Risks (textarea, optional)
*   Suggestions (textarea, optional)
*   Decision Needed (textarea, optional)

### b. `TriageDashboard` Page (Protected Route)

**Purpose:** Allows authenticated users (William, Sue) to review intake items and promote them to the register.

**Component Breakdown:**
*   A table view of all items from the `intake_items` table with a "New" status.
*   Each row should have buttons to "Promote to Register" or "Dismiss".
*   "Promote" opens a modal to create a new `register_items` entry, pre-filling data from the intake item.
*   "Dismiss" changes the intake item's status to "Dismissed".

### c. `RegisterKanban` Page (Protected Route)

**Purpose:** A Kanban board to track the status of formal feedback items.

**Component Breakdown:**
*   Displays `register_items` as cards in columns corresponding to their status.
*   Columns: `Backlog`, `In Progress`, `Resolved`, `Archived`.
*   Cards should be draggable between columns to update status.
*   Clicking a card opens a detailed view with all fields and a section for comments.

### d. SMS Webhook (`/api/sms`)

**Purpose:** An Express route to handle incoming Twilio SMS messages.

**Logic:**
*   Receives POST requests from Twilio.
*   Manages a conversational state for each user (phone number) in the `sms_conversations` table.
*   Prompts the user for each feedback field one by one.
*   Handles `SKIP` commands to move to the next optional field.
*   On completion, creates a new entry in the `intake_items` table with `channel` set to `SMS`.

_VantaLoop Design Feedback System -- Lovable Toolkit Prompt_

## 1. System Overview and Architecture

The VantaLoop system is a two-stage design feedback collection and management tool for the Vanta Wireless team. It is designed to capture raw, unstructured feedback through accessible channels and then triage it into a structured, actionable register.

*   **Stage 1: Intake:** Team members can submit feedback via a public, mobile-first web form or a conversational SMS loop. This stage prioritizes ease of submission to encourage a high volume of input.
*   **Stage 2: Triage & Register:** A protected dashboard allows designated reviewers (William Traylor, Sue from Metalab) to review all intake items weekly. Actionable feedback is promoted to a formal Kanban-style register for tracking and resolution.

**Technical Architecture:**

*   **Frontend:** React 19, Tailwind 4
*   **Backend:** Node.js with Express 4
*   **API:** tRPC 11 for end-to-end typesafe API routes
*   **Database:** MySQL
*   **ORM:** Drizzle ORM
*   **SMS:** Twilio API for the conversational intake channel

This architecture provides a modern, scalable, and type-safe foundation for the application.

## 2. Component & Page Specifications

### a. `SubmitFeedback` Page (`/submit`)

**Purpose:** Public, mobile-first form for submitting raw feedback. No authentication required.

**Component Breakdown:**
*   A single-page React component handling the form state and submission.
*   Uses Tailwind CSS for responsive styling.
*   Form fields correspond to the structured feedback template.

**Fields:**
*   Submitter Name (text input, optional)
*   Feedback Type (select dropdown: `concept-direction`, `information-architecture`, `interaction-pattern`, `visual-design`, `copy-content`, `general`)
*   Subject (text input, required)
*   Goal of Share (textarea, optional)
*   What's Working (textarea, optional)
*   Questions/Risks (textarea, optional)
*   Suggestions (textarea, optional)
*   Decision Needed (textarea, optional)

### b. `TriageDashboard` Page (Protected Route)

**Purpose:** Allows authenticated users (William, Sue) to review intake items and promote them to the register.

**Component Breakdown:**
*   A table view of all items from the `intake_items` table with a "New" status.
*   Each row should have buttons to "Promote to Register" or "Dismiss".
*   "Promote" opens a modal to create a new `register_items` entry, pre-filling data from the intake item.
*   "Dismiss" changes the intake item's status to "Dismissed".

### c. `RegisterKanban` Page (Protected Route)

**Purpose:** A Kanban board to track the status of formal feedback items.

**Component Breakdown:**
*   Displays `register_items` as cards in columns corresponding to their status.
*   Columns: `Backlog`, `In Progress`, `Resolved`, `Archived`.
*   Cards should be draggable between columns to update status.
*   Clicking a card opens a detailed view with all fields and a section for comments.

### d. SMS Webhook (`/api/sms`)

**Purpose:** An Express route to handle incoming Twilio SMS messages.

**Logic:**
*   Receives POST requests from Twilio.
*   Manages a conversational state for each user (phone number) in the `sms_conversations` table.
*   Prompts the user for each feedback field one by one.
*   Handles `SKIP` commands to move to the next optional field.
*   On completion, creates a new entry in the `intake_items` table with `channel` set to `SMS`.

## 3. Data Model (TypeScript Interfaces)

```typescript
export const feedbackTypes = [
  'concept-direction',
  'information-architecture',
  'interaction-pattern',
  'visual-design',
  'copy-content',
  'general',
] as const;

export type FeedbackType = typeof feedbackTypes[number];

export interface IntakeItem {
  id: number;
  createdAt: Date;
  submitterName?: string;
  channel: 'WEB' | 'SMS';
  feedbackType: FeedbackType;
  subject: string;
  goalOfShare?: string;
  whatsWorking?: string;
  questionsRisks?: string;
  suggestions?: string;
  decisionNeeded?: string;
  status: 'New' | 'Under Review' | 'Promoted' | 'Dismissed';
}

export interface RegisterItem {
  id: number;
  createdAt: Date;
  title: string;
  epic?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Backlog' | 'In Progress' | 'Resolved' | 'Archived';
  assigneeId?: number;
  feedbackType: FeedbackType;
  decision?: string;
  decisionRationale?: string;
  promotedFromId?: number; // Foreign key to IntakeItem
}

export interface Comment {
  id: number;
  createdAt: Date;
  content: string;
  authorId: number;
  registerItemId: number;
}

export interface SMSConversation {
  id: number;
  phoneNumber: string;
  currentStep: string; // e.g., 'awaiting_subject', 'awaiting_goal'
  completed: boolean;
  intakeData: Partial<IntakeItem>;
}

export interface User {
  id: number;
  name: string;
  email: string; // For login
  role: 'Admin' | 'Reviewer';
}
```

## 4. API Route Reference (tRPC Procedures)

```typescript
// server/routers/_app.ts
import { createRouter } from "../createRouter";
import { intakeRouter } from "./intake";
import { registerRouter } from "./register";

export const appRouter = createRouter()
  .merge("intake.", intakeRouter)
  .merge("register.", registerRouter);

export type AppRouter = typeof appRouter;

// server/routers/intake.ts
export const intakeRouter = createRouter()
  .query("getAll", {
    // ... returns all intake_items
  })
  .mutation("createFromWeb", {
    input: /* Zod schema for web form */,
    // ... creates new intake_item with channel: 'WEB'
  })
  .mutation("updateStatus", {
    input: z.object({ id: z.number(), status: z.enum(['New', 'Under Review', 'Promoted', 'Dismissed']) }),
    // ... updates status of an intake_item
  });

// server/routers/register.ts
export const registerRouter = createRouter()
  .query("getAll", {
    // ... returns all register_items
  })
  .mutation("createFromIntake", {
    input: /* Zod schema for promotion modal */,
    // ... creates new register_item, updates intake_item status
  })
  .mutation("updateStatus", {
    input: z.object({ id: z.number(), status: z.enum(['Backlog', 'In Progress', 'Resolved', 'Archived']) }),
    // ... updates status of a register_item
  });
```

## 5. Copy-Paste Remediation Prompts

### a. Build the Triage Dashboard

"Using the `IntakeItem` interface and the tRPC `intake.getAll` query, build the `TriageDashboard` React component. It should display all intake items with a status of "New" in a table. Each row must include the submitter, type, subject, and channel. Add two buttons to each row: 'Promote to Register' and 'Dismiss'. The 'Dismiss' button should call the `intake.updateStatus` mutation to set the status to 'Dismissed'. The 'Promote' button will be wired up next."

### b. Build the Register Kanban Board

"Build the `RegisterKanban` component. Fetch all items using the `register.getAll` query. Create columns for `Backlog`, `In Progress`, `Resolved`, and `Archived`. Render each register item as a card in the appropriate column. Use a drag-and-drop library like `react-beautiful-dnd` to allow moving cards between columns. On drop, call the `register.updateStatus` mutation with the new status."

### c. Implement the SMS Webhook Logic

"Create the Express route at `/api/sms` to handle POST requests from Twilio. Implement the conversational logic using the `sms_conversations` table to track state. On receiving a message, identify the user by phone number. If it's a new conversation, greet them and ask for the 'Subject'. For subsequent messages, save the previous input and prompt for the next field in the `IntakeItem` sequence. Support a `SKIP` keyword for optional fields. Once all required fields are collected, create the `IntakeItem` in the database, set the channel to `SMS`, and thank the user."

## 6. Twilio Setup Instructions

Once the Twilio account is provisioned, the following credentials need to be configured as environment variables in the application deployment environment:

*   `TWILIO_ACCOUNT_SID`: Your unique Twilio Account SID.
*   `TWILIO_AUTH_TOKEN`: Your Twilio authentication token.
*   `TWILIO_PHONE_NUMBER`: The Twilio-provided phone number for the SMS loop.

After setting these variables, the webhook URL (`https://<your_domain>/api/sms`) must be configured in the Twilio console for the specified phone number. Set it to trigger on "a message comes in" with an `HTTP POST` request.

---

Vanta Wireless ... VantaLoop Design Feedback System
