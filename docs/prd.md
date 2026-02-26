# Vanta-Metalab Design Feedback Workstream: Product Requirements Document

## 1. Executive Summary

This document outlines the product requirements for a dedicated design feedback platform to streamline collaboration between Vanta Wireless and its design partner, Metalab. The primary objective is to establish a structured, decision-oriented feedback loop that enhances the quality and velocity of design iterations. The platform will replace ad-hoc feedback channels with a centralized Kanban-style board, standardized feedback templates, and automated reporting. Key features include a structured card creation flow, threaded commenting, a decision log, and integrations with Slack. This system is designed to provide clarity, accountability, and a single source of truth for the design process, ensuring that all feedback is captured, synthesized, and translated into actionable decisions. The successful implementation of this tool will accelerate the design lifecycle, improve the quality of design outcomes, and strengthen the partnership between Vanta Wireless and Metalab.

## 2. Problem Statement

The current design feedback process between Vanta Wireless and Metalab is fragmented, inconsistent, and lacks a systematic approach for tracking feedback from concept to decision. Feedback is scattered across multiple channels, including email, Slack, and meeting notes, leading to a loss of context, redundant conversations, and a high risk of valuable insights being overlooked. The absence of a standardized feedback template results in inconsistent and often unactionable input, creating ambiguity and slowing down the design iteration cycle. There is no single source of truth for design decisions, making it difficult to maintain institutional memory and ensure alignment across both teams. This lack of a structured system introduces significant friction into the collaborative design process, hindering the ability of both Vanta Wireless and Metalab to move quickly and decisively on critical design choices.

## 3. Target Users

The primary users of this platform are the core members of the Vanta Wireless and Metalab teams involved in the design workstream. The system is designed to cater to the distinct needs and workflows of three key personas: the Designer, the Product Lead, and the Decision Maker.

### Personas

| Persona | Role | Key Individuals | Core Needs | Frustrations |
| :--- | :--- | :--- | :--- | :--- |
| **The Designer** | Lead Interface Designer | Sue (Metalab), Edy Goulet (Metalab) | A simple, centralized way to share new design concepts. Structured, actionable, and consolidated feedback. Clarity on decisions and rationale. Reduced administrative overhead in managing feedback. | Vague, conflicting, or unactionable feedback. Feedback scattered across multiple channels. Delays in receiving decisions, blocking progress. Lack of clarity on feedback prioritization. |
| **The Product Lead** | Product Lead / Internal Stakeholder | Glenn Teuber (Vanta), Leon Anderson (Vanta) | An efficient process for reviewing designs and providing input. Visibility into all stakeholder feedback and design evolution. A clear, accessible log of all historical decisions. Confidence that feedback is being systematically addressed. | Excessive time spent in meetings to provide feedback. Difficulty tracking the latest design versions. No formal process for escalating critical questions. Decisions made without documented rationale. |
| **The Decision Maker** | CBO / Executive Sponsor | William Traylor (Vanta) | A high-level overview of design progress and key issues. A quick, structured way to make and communicate final decisions. An efficient process that respects time constraints. A system that ensures accountability and forward momentum. | Being pulled into low-level, tactical design debates. Lack of concise summaries for informed decision-making. The design process stalling due to indecision. Inability to easily track the history of key choices. |

## 4. DVF Assessment (Desirability, Viability, Feasibility)

A DVF (Desirability, Viability, Feasibility) assessment validates the product's potential for success by evaluating it from three critical perspectives.

| Dimension | Assessment | Rationale |
| :--- | :--- | :--- |
| **Desirability** | **High** | The platform directly addresses the acute pain points of both the Vanta and Metalab teams. Designers crave a streamlined process for receiving clear, consolidated, and actionable feedback, while stakeholders require an efficient, transparent system for review and decision-making. By replacing a chaotic, multi-channel process with a single source of truth, the tool promises to reduce friction, increase mutual understanding, and foster a more effective partnership. The demand for a structured, centralized, and decision-oriented workflow is significant and shared by all target users. |
| **Viability** | **High** | From a business perspective, the investment in this platform is sound. The primary benefit is the acceleration of the design-to-development lifecycle, which directly impacts time-to-market for Vanta Wireless's core product offerings. By improving the quality of design outcomes and reducing the cost of rework, the tool provides a clear return on investment. The creation of a permanent decision log serves as a valuable long-term asset, preserving institutional knowledge and ensuring consistency in future design efforts. The platform's viability is further enhanced by its potential to serve as a model for other cross-functional collaborations. |
| **Feasibility** | **High** | The technical implementation of the proposed feature set is straightforward and carries low risk. The core components -- a Kanban board, threaded comments, user authentication, and activity feeds -- are well-established patterns in modern web applications. The proposed technology stack is standard, and the data model is not overly complex. The AI-driven features, such as weekly digests and audio summaries, can be implemented by integrating with robust third-party APIs. The project can be executed by a small, focused engineering team, making it a highly achievable initiative. |

## 5. Core Features

The platform will be developed with the following core features, prioritized to deliver maximum impact with a balanced level of effort. The **As-Built Status** column reflects the state of the Lovable deployment at `vantaloop.lovable.app` as of February 26, 2026.

| Feature | Priority | Effort | Impact | As-Built Status | Gap Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. New Card Creation Flow** | P0 | Medium | High | **Non-functional** | The "New Card" button is present in the UI but does not open a dialog or modal when clicked. This is a critical gap -- the guided creation flow with the pre-filled template is the single biggest lever for feedback quality. |
| **2. Threaded Comments** | P0 | Medium | High | **Display-only** | Comments are rendered correctly on the card detail panel with author names and timestamps. However, there is no visible input field for adding new comments, making this read-only. |
| **3. Decision Log View** | P0 | Medium | High | **Implemented (basic)** | A table at `/decision-log` shows card name, decision, rationale, and date. The implementation is simpler than spec -- it lacks search, date-range filtering, and the "Pending Decisions" section. |
| **4. Priority & Assignee Filters** | P1 | Low | Medium | **Working** | Priority filter chips (P0-P3) are functional and correctly reduce the card count. Assignee filter chips are present but were not verified during the audit. |
| **5. Feedback Type Tags** | P1 | Low | Medium | **Working** | Tags are displayed on cards in both the board view and the detail panel. Tags include Concept Direction, Visual Design, Information Architecture, Interaction Pattern, and Copy/Content. |
| **6. Slack Integration** | P1 | Medium | High | **Not implemented** | No Slack notification UI or simulated webhook data is visible anywhere in the application. |
| **7. Timeline/Activity View** | P2 | Medium | Medium | **Implemented** | A vertical activity feed at `/timeline` shows six events with actor, action, card title, and timestamp. Clean layout with a connecting vertical line and event-type icons. |
| **8. Stale Card Indicator** | P2 | Low | Medium | **Working** | The "Dashboard Information Architecture" card correctly displays an orange "Stale -- 5+ days" badge, as its date (2026-02-20) is more than five business days old. |
| **9. Weekly Digest Generation** | P2 | High | High | **Implemented (basic)** | The `/digest` page shows a summary paragraph, cards moved, and an audio summary placeholder. The implementation lacks the four-quadrant layout (new concepts, decisions, open items, stale items) and the AI-generation trigger. |
| **10. Podcast-Style Audio Summary** | P3 | High | Low | **Placeholder only** | The audio summary section displays "Audio summary not yet generated for this week." There is no audio player UI or generated audio file. |

## 6. Epics and User Stories

The development work is organized into four epics, each containing a set of user stories that deliver specific user value. Each story includes detailed acceptance criteria to ensure clarity and testability.

### EPIC-01: Feedback Hub Setup

This epic covers the foundational setup of the Kanban board, card structure, and basic user interactions.

**User Stories:**

*   **Story 1.1: Board Visualization**
    *   **As a** team member,
    *   **I want** to see all design feedback cards organized in a Kanban board with the columns: New Concept, Feedback Submitted, In Review, Decision Made, and Archived,
    *   **so that** I can track the status of all design work at a glance.
    *   **Acceptance Criteria:**
        *   The main view of the application must be a Kanban board.
        *   The board must contain the five specified columns in the correct order.
        *   Users can see cards populated within each column.
        *   The interface must be clean, responsive, and easy to navigate.
    *   **As-Built:** Fully implemented. All five columns are present and populated. The "Decision Made" column is partially off-screen on smaller viewports but accessible via horizontal scroll.

*   **Story 1.2: New Card Creation with Template**
    *   **As a** Designer,
    *   **I want** to create a new card for a design concept using a pre-filled template,
    *   **so that** I can provide all necessary context for a productive feedback session.
    *   **Acceptance Criteria:**
        *   A "New Card" button must be prominently displayed.
        *   Clicking the button opens a modal or new view for card creation.
        *   The creation form must be pre-populated with all fields from the structured feedback template.
        *   The new card is added to the "New Concept" column upon submission.
    *   **As-Built:** The "New Card" button is present and styled correctly in the top-right corner of the board. However, clicking it does not open a dialog, modal, or navigate to a creation form. This story is not functional and requires remediation.

*   **Story 1.3: Card Details View**
    *   **As a** team member,
    *   **I want** to click on a card to view its full details in a focused view,
    *   **so that** I can review the design concept and all associated feedback.
    *   **Acceptance Criteria:**
        *   Clicking a card on the Kanban board opens a detailed view (modal or separate page).
        *   The detailed view displays all fields from the `FeedbackCard` data model.
        *   The layout must be clear and readable, with a logical separation between the original post and the feedback.
    *   **As-Built:** Fully implemented. Clicking a card opens a right-side overlay panel displaying all structured template fields, tags, assignee, and comments. The panel includes a close button and is scrollable for longer content.

### EPIC-02: Design Share & Feedback

This epic focuses on the core feedback exchange, enabling rich, contextual conversations.

**User Stories:**

*   **Story 2.1: Threaded Commenting on Cards**
    *   **As a** stakeholder,
    *   **I want** to add threaded comments to a specific feedback card,
    *   **so that** I can ask questions or provide feedback directly related to the design concept in an organized manner.
    *   **Acceptance Criteria:**
        *   Users can add comments to any card.
        *   Users can reply to existing comments, creating a nested thread.
        *   Comments must display the author's name and a timestamp.
        *   The comment input field should support basic Markdown formatting.
    *   **As-Built:** Comments are displayed with author name, avatar, and timestamp. However, no comment input field is visible, making this feature read-only. Threaded replies are not implemented. This story requires remediation to add the input field and reply functionality.

*   **Story 2.2: Categorize Feedback with Tags**
    *   **As a** Product Lead,
    *   **I want** to assign one or more feedback type tags to a card,
    *   **so that** I can categorize the feedback and later analyze trends.
    *   **Acceptance Criteria:**
        *   When creating or editing a card, the user can select from a predefined list of tags: `concept-direction`, `information-architecture`, `interaction-pattern`, `visual-design`, `copy-content`.
        *   Multiple tags can be applied to a single card.
        *   Applied tags are clearly visible on the card in both the board and detail views.
    *   **As-Built:** Tags are displayed on cards in both the board view and the detail panel. Multiple tags per card are supported. Tag assignment during card creation cannot be verified because the New Card dialog is non-functional.

*   **Story 2.3: Filter Board by Priority and Assignee**
    *   **As a** team member,
    *   **I want** to filter the Kanban board using priority and assignee chips,
    *   **so that** I can quickly find the cards that are most relevant to me.
    *   **Acceptance Criteria:**
        *   Filter chips for all priority levels (P0-P3) and all team members are displayed above the board.
        *   Clicking a filter chip reduces the visible cards to only those matching the selected criteria.
        *   Multiple filters can be applied simultaneously (e.g., P0 and assigned to Glenn Teuber).
        *   A clear "Clear Filters" option is available.
    *   **As-Built:** Priority filter chips are functional. Clicking P0 correctly reduced the board from 6 to 2 items. Assignee chips are present but were not verified. A search bar is also present. No explicit "Clear Filters" button was observed -- deselecting a chip appears to clear the filter.

### EPIC-03: Synthesis & Decisions

This epic is centered on driving the feedback process toward clear, documented decisions.

**User Stories:**

*   **Story 3.1: Decision Log View**
    *   **As a** Product Lead,
    *   **I want** a dedicated "Decision Log" view that shows all cards moved to the "Decision Made" column,
    *   **so that** I have a permanent and searchable record of all key design decisions.
    *   **Acceptance Criteria:**
        *   A new primary navigation item for "Decision Log" is available.
        *   This view displays a list or table of all cards that are in or have passed through the "Decision Made" column.
        *   The view should be searchable by keyword and filterable by date range.
        *   Each entry must clearly display the final decision and rationale.
    *   **As-Built:** The Decision Log is accessible at `/decision-log` via sidebar navigation. It displays a table with CARD, DECISION, RATIONALE, and DATE columns. One decision is shown. The view lacks search and date-range filtering capabilities.

*   **Story 3.2: Chronological Activity View**
    *   **As a** team member,
    *   **I want** to see a timeline or activity feed for a specific card,
    *   **so that** I can understand the history of feedback and actions taken.
    *   **Acceptance Criteria:**
        *   Within the card detail view, there is a tab or section for "Activity".
        *   This feed lists all significant events in chronological order (e.g., card created, comment added, column changed, assignee changed).
        *   Each entry includes a timestamp and the name of the user who performed the action.
    *   **As-Built:** Implemented as a global Timeline view at `/timeline` rather than a per-card activity section. The feed shows six events with actor, action type, card title, and timestamp. The vertical line and event-type icons provide good visual structure. Consider adding a per-card activity tab in the detail panel as well.

*   **Story 3.3: Stale Card Visual Indicator**
    *   **As a** CBO,
    *   **I want** to easily see which design concepts are stalled,
    *   **so that** I can help unblock the team.
    *   **Acceptance Criteria:**
        *   Cards that have not been moved or had a new comment for 5+ business days will display a visual indicator (e.g., a red border or an icon).
        *   The indicator is visible on the main Kanban board view.
        *   Hovering over the indicator provides a tooltip (e.g., "Stale: 6 days without activity").
    *   **As-Built:** Working. The "Dashboard Information Architecture" card displays an orange "Stale -- 5+ days" badge at the top of the card in the Feedback Submitted column. The badge is clearly visible. Hover tooltip was not observed during the audit.

### EPIC-04: Agentic Aggregation

This epic introduces AI-powered features to automate summarization and communication, reducing manual overhead.

**User Stories:**

*   **Story 4.1: Automated Weekly Digest**
    *   **As a** CBO,
    *   **I want** to receive an automated weekly email digest summarizing board activity,
    *   **so that** I can stay informed on design progress without having to manually check the board.
    *   **Acceptance Criteria:**
        *   A script runs every Friday at 5 PM ET to generate the digest.
        *   The digest is sent via email to all team members.
        *   The email contains sections for: New Concepts, Key Decisions Made, and Cards Needing Attention (stale cards).
        *   The content is summarized by an AI model for conciseness.
    *   **As-Built:** A Weekly Digest view exists at `/digest` with a summary paragraph, cards moved section, and audio summary placeholder. The summary content is static/pre-written rather than AI-generated. There is no email delivery mechanism or scheduled generation trigger. The four-quadrant layout (new concepts, decisions, open items, stale items) from the spec is not implemented.

*   **Story 4.2: Slack Channel Notifications**
    *   **As a** team member,
    *   **I want** to receive notifications in the `#shared-vanta-metalab` Slack channel for important events,
    *   **so that** I am aware of updates in real-time.
    *   **Acceptance Criteria:**
        *   The platform is integrated with a Slack webhook for the specified channel.
        *   Notifications are sent for: new card creation, new comments, and decision made.
        *   Notifications must contain a direct link to the relevant card.
    *   **As-Built:** Not implemented. No Slack notification UI, simulated webhook data, or notification log is visible in the application.

*   **Story 4.3: Podcast-Style Audio Summary**
    *   **As a** busy stakeholder,
    *   **I want** the option to listen to a short, podcast-style audio summary of the weekly digest,
    *   **so that** I can catch up on design progress while multitasking.
    *   **Acceptance Criteria:**
        *   The weekly digest email includes an attached MP3 file or a link to it.
        *   The audio is generated using a text-to-speech AI model.
        *   The tone is conversational and easy to listen to.
        *   The audio summary is no longer than 3-4 minutes.
    *   **As-Built:** Placeholder only. The audio summary section on the Digest page displays "Audio summary not yet generated for this week." There is no audio player UI or generated audio file.

## 7. User Journeys

These user journeys illustrate how the target personas will interact with the platform to accomplish their goals.

### Journey 1: Designer Submitting a New Concept

1.  **Context:** Edy Goulet from Metalab has just finished a new set of wireframes for the Vanta Wireless customer onboarding flow. She needs to get feedback from the Vanta team.
2.  **Action:** Edy logs into the feedback platform. She clicks the "New Card" button.
3.  **Action:** The card creation form appears, pre-populated with the structured feedback template. She fills out each section:
    *   **Goal of this share:** "To get feedback on the proposed 3-step customer onboarding flow."
    *   **What's working:** She attaches the wireframe images and notes that the flow is optimized for mobile-first.
    *   **Questions/risks:** "Is the language for the data privacy consent clear enough?"
    *   **Decision needed today:** "Approval on the overall flow direction."
4.  **Action:** She sets the priority to P1, as this is on the critical path. She does not assign it to anyone specific yet. She adds the `interaction-pattern` and `visual-design` tags.
5.  **Outcome:** Edy submits the card. It appears in the "New Concept" column. A notification is instantly posted to the `#shared-vanta-metalab` Slack channel, alerting the team that a new concept is ready for review.

> **As-Built Note:** This journey is currently blocked by the non-functional New Card button (Story 1.2). Once remediated, the journey should be re-tested end-to-end.

### Journey 2: Stakeholder Providing Feedback

1.  **Context:** Glenn Teuber from Vanta sees the Slack notification about the new onboarding flow. He has 15 minutes before his next meeting to provide feedback.
2.  **Action:** He clicks the link in the Slack message, which takes him directly to the new card in the feedback platform.
3.  **Action:** He reviews the wireframes and Edy's notes. He has a question about the data privacy language. He navigates to the threaded comments section.
4.  **Action:** He posts a comment: "Regarding the privacy consent, we may need to run this by legal. The current language might be too casual. Can we add a link to the full privacy policy?"
5.  **Action:** He also adds a suggestion in the main feedback section: "The progress bar at the top is great. It clearly shows users where they are in the process."
6.  **Outcome:** His feedback is captured on the card. Edy receives a notification and can immediately see his input. The conversation is neatly contained within the card, avoiding a long email chain.

> **As-Built Note:** This journey is partially blocked. The card detail panel renders correctly, but the comment input field is missing (Story 2.1), preventing Glenn from posting feedback. Slack integration (Story 4.2) is also not implemented.

### Journey 3: Product Lead Making a Decision

1.  **Context:** William Traylor, the CBO, has blocked off time to review the week's design progress. He sees the onboarding flow card has received feedback from several team members and is now in the "In Review" column.
2.  **Action:** He opens the card and reads through all the comments and suggestions. He sees the discussion about the privacy language and the consensus on the overall flow.
3.  **Action:** He makes a decision. He navigates to the "Decision with rationale" section of the card.
4.  **Action:** He writes: "**Decision:** Approved. Proceed with this 3-step flow. **Rationale:** The flow is logical and user-friendly. For the privacy language, let's proceed with the current text but add a prominent link to the full policy as suggested. We can refine the exact wording in a later iteration."
5.  **Action:** He moves the card from the "In Review" column to the "Decision Made" column.
6.  **Outcome:** The decision is now formally documented and visible to everyone. A notification is sent to Slack. The card is now part of the permanent Decision Log, providing a clear record of why this direction was chosen. Metalab is unblocked and can proceed with high-fidelity designs.

> **As-Built Note:** The card detail panel and Decision Log are functional. Drag-and-drop between columns was not tested during the audit. The decision input mechanism on the card detail panel needs verification.

## 8. As-Built Audit Summary (vantaloop.lovable.app)

The following table provides a consolidated view of the audit conducted on February 26, 2026, against the live Lovable deployment.

### Overall Assessment

The Lovable build at `vantaloop.lovable.app` successfully implements the core board structure, card detail views, priority filtering, feedback type tags, stale card indicators, and the Timeline, Decision Log, and Weekly Digest views. The design uses a warm, earthy color palette with colored priority badges and avatar circles, diverging from the monochrome "Clean Slate" design system specified in the toolkit but achieving a clean, professional aesthetic. The application uses URL-based routing (`/timeline`, `/decision-log`, `/digest`) which is a solid architectural choice.

### Critical Gaps Requiring Remediation

| Gap | Severity | Story | Description | Remediation |
| :--- | :--- | :--- | :--- | :--- |
| **New Card dialog non-functional** | **P0 -- Blocker** | Story 1.2 | The "New Card" button does not open a dialog, modal, or navigate to a creation form. Without this, no new feedback can be submitted through the platform. | Wire the button's `onClick` handler to open a modal containing the `NewCardForm` component with all structured template fields. |
| **No comment input field** | **P0 -- Blocker** | Story 2.1 | Comments are displayed read-only. There is no text input, textarea, or form for adding new comments. | Add a `CommentInput` component at the bottom of the `CommentThread` section in the card detail panel. Include author selection and a submit button. |
| **Slack integration absent** | **P1 -- Gap** | Story 4.2 | No Slack notification UI or simulated data is present. | Add a `SlackNotification` data model and display a notification log on the Weekly Digest page or as a separate debug view. For production, integrate with a Slack webhook. |

### Enhancement Opportunities

| Area | Current State | Recommended Enhancement |
| :--- | :--- | :--- |
| **Decision Log** | Simple four-column table | Add keyword search, date-range filter, and a "Pending Decisions" section showing cards in "In Review" that have a `decisionNeeded` field filled. |
| **Weekly Digest** | Static summary paragraph | Implement the four-quadrant layout (New Concepts, Decisions Made, Open Items, Stale Cards) and add an AI-generation trigger button. |
| **Audio Summary** | Placeholder text only | Add an HTML5 audio player UI with play/pause controls, even if the audio file is not yet generated. |
| **Timeline View** | Global activity feed only | Add per-card activity tabs in the card detail panel, and add priority/assignee filter chips to the Timeline view. |
| **Drag and Drop** | Not verified | Implement drag-and-drop for cards between columns using a library like `@dnd-kit/core` or `react-beautiful-dnd`. |
| **Epic Filtering** | Sidebar epics listed but click behavior unverified | Ensure clicking an epic in the sidebar filters the board to show only cards belonging to that epic. |

## 9. Edge Cases and Risks

Identifying and planning for edge cases and risks is critical for building a robust and reliable platform.

| Category | Description | Mitigation Strategy |
| :--- | :--- | :--- |
| **Technical Risks** | **Third-Party API Failure:** The AI-powered features for weekly digests and audio summaries depend on external services. An outage or change in these APIs could disrupt functionality. | Implement graceful degradation. If the AI service fails, the system should fall back to a simpler, non-AI-generated notification. Have a secondary API provider as a backup. Monitor API status and have alerts in place. |
| | **Data Integrity:** With multiple users interacting with the platform, there is a risk of data being accidentally deleted or incorrectly modified. | Implement soft deletes instead of hard deletes, allowing for data recovery. Maintain a comprehensive activity log for all changes to cards. Use optimistic locking to prevent simultaneous edits from overwriting each other. |
| **User-Related Risks** | **Low Adoption:** The tool will only be effective if it is consistently used by both teams. If users revert to old habits (email, Slack DMs), the platform's value will be diminished. | Provide clear onboarding and training for all team members. Secure executive sponsorship from both Vanta and Metalab leadership to champion its use. The CBO and other leaders must model the desired behavior by exclusively using the platform for feedback. |
| | **Poor Quality Input:** The structured template is designed to encourage high-quality feedback, but users could still provide vague or unactionable input. | The Product Lead will be responsible for coaching users on how to provide effective feedback. The platform can include placeholder text in the template fields with examples of good feedback. Periodically review feedback quality and provide gentle course corrections to the team. |
| **Process Risks** | **Scope Creep:** The AI features, while valuable, could become a distraction and delay the delivery of the core feedback functionality. | Adhere to the prioritized feature list. Core functionality (P0, P1) must be delivered and stable before significant resources are allocated to experimental P3 features like the audio summary. |
| | **Decision Bottlenecks:** The platform makes bottlenecks visible but does not automatically resolve them. A key decision-maker becoming unavailable could still stall the process. | Designate a proxy decision-maker for when the primary one is unavailable. The stale card indicator and weekly digests are designed to bring visibility to these bottlenecks so they can be addressed proactively. |

## 10. Success Metrics

The success of the design feedback platform will be measured by a set of quantitative and qualitative metrics focused on efficiency, engagement, and the quality of outcomes.

| Metric | KPI | Target | Measurement Method |
| :--- | :--- | :--- | :--- |
| **Design Velocity** | **Average time from "New Concept" to "Decision Made"** | < 3 business days | The platform will track the timestamp of each column change for every card. This KPI will be calculated as the average duration for all cards that reach the "Decision Made" state. |
| **Feedback Quality** | **Percentage of cards with a clear, actionable decision** | 95% | A card is considered actionable if the "Decision with rationale" field is filled out. This will be a simple query on the `FeedbackCard` data. |
| **User Engagement** | **Weekly Active Users (WAU)** | 90% of the core team | The system will log user activity. A user is considered active if they have created a card, commented, or moved a card within a given week. |
| **Process Efficiency** | **Number of stale cards per week** | < 2 | The platform will automatically flag stale cards. This metric will be tracked weekly and included in the automated digest to ensure visibility. |
| **Reduced Friction** | **Qualitative feedback from team members** | Positive sentiment | A short, anonymous survey will be sent to the team after the first month of use, asking them to rate the new process compared to the old one on a scale of 1-5. |
| **Centralization** | **Percentage of design feedback captured in the platform** | > 98% | The Product Lead will monitor other channels (Slack, email) and gently redirect any feedback conversations back to the platform. This will be a manual audit initially. |

## 11. Technical Architecture

This section provides a high-level overview of the proposed technical architecture, including the data model, component hierarchy, and API surface. The architecture is designed to be scalable, maintainable, and built with modern web technologies.

### Data Model

The core of the platform is the `FeedbackCard` data model. The following table details the fields for this primary entity and its related objects.

**`FeedbackCard`**

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary key for the feedback card. |
| `title` | String | The title of the design concept being shared. |
| `epicId` | UUID | Foreign key linking to a higher-level epic or project. |
| `columnId` | Enum | The current column in the Kanban board (e.g., `NEW_CONCEPT`, `FEEDBACK_SUBMITTED`). |
| `assignee` | User | The team member currently assigned to the card. |
| `createdAt` | DateTime | Timestamp of when the card was created. |
| `updatedAt` | DateTime | Timestamp of the last update to the card. |
| `tags` | FeedbackTag[] | An array of tags categorizing the feedback. |
| `comments` | Comment[] | An array of threaded comments on the card. |
| `goalOfShare` | String | The primary objective of sharing this design. |
| `whatsWorking` | String[] | A list of points describing what is successful about the design. |
| `questionsRisks` | String[] | A list of open questions or potential risks. |
| `suggestions` | String[] | A list of specific suggestions for improvement. |
| `decisionNeeded` | String | The specific decision required from the team. |
| `criticalQuestions` | String[] | A list of blocking questions that need answers. |
| `whatsClear` | String | Description of what is clear and easy to understand. |
| `whatsConfusing` | String | Description of what is confusing or unclear. |
| `hookValue` | String | Explanation of the design's primary value proposition. |
| `happyPath` | String[] | A list of steps in the ideal user flow. |
| `hesitationPoints` | String[] | A list of potential points of user friction or hesitation. |
| `decision` | String | The final decision made on the concept. |
| `decisionRationale` | String | The reasoning behind the final decision. |
| `priority` | Enum | The priority level of the card (P0, P1, P2, P3). |

### Component Hierarchy

The front-end will be built as a single-page application (SPA) using a component-based architecture (e.g., React). The component hierarchy will be structured as follows:

-   **`App`** (Root component)
    -   **`Navbar`** (Top navigation, including links to Board and Decision Log)
    -   **`KanbanBoardView`**
        -   **`FilterBar`** (Contains `PriorityFilter` and `AssigneeFilter` chips)
        -   **`KanbanColumn`** (e.g., "New Concept")
            -   **`FeedbackCard`** (Summary view)
    -   **`CardDetailView`** (Modal or separate page)
        -   **`CardHeader`** (Title, priority, assignee)
        -   **`CardBody`** (Contains all structured feedback fields)
        -   **`CommentThread`**
            -   **`Comment`**
            -   **`CommentInput`**
    -   **`DecisionLogView`**
        -   **`DecisionTable`** (Sortable and filterable list of decided cards)

### API Surface

A RESTful API will serve as the interface between the front-end application and the back-end server. The following endpoints represent the core API surface:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cards` | Fetches all feedback cards. Supports query parameters for filtering by `priority`, `assignee`, and `tags`. |
| `POST` | `/api/cards` | Creates a new feedback card. |
| `GET` | `/api/cards/{id}` | Fetches a single feedback card by its ID. |
| `PUT` | `/api/cards/{id}` | Updates a feedback card (e.g., to change its column or content). |
| `POST` | `/api/cards/{id}/comments` | Adds a new comment to a feedback card. |
| `GET` | `/api/decisions` | Fetches all cards that have a decision, for the Decision Log. |
| `POST` | `/api/integrations/slack/notify` | Internal endpoint to send a notification to Slack. |
| `POST` | `/api/agent/digest` | Internal endpoint to trigger the generation of the weekly AI digest. |

## 12. Appendix

This appendix contains the full structured feedback template that will be pre-filled in every new card created on the platform. The purpose of this template is to ensure that all design shares are accompanied by the necessary context, and that all feedback is captured in a consistent and actionable format.

### Structured Feedback Template

---

**Goal of this share:**
*_(Required)_ What is the primary objective of sharing this design? What specific feedback are you looking for?*

**What's working:**
*_(Optional)_ Briefly describe what you believe is successful about this design direction.*

**Questions/risks:**
*_(Optional)_ What are the open questions or potential risks associated with this approach?*

**Suggestions:**
*_(Optional)_ If you have specific ideas for improvement, list them here.*

**Decision needed today:**
*_(Required)_ What is the specific decision you need from the team to move forward?*

**Critical questions:**
*_(Optional)_ Are there any blocking questions that need to be answered before a decision can be made?*

---

### Feedback & Synthesis Fields

**Clarity + value:**
*What's the single most important thing? What's clear, what's confusing? What's the hook?*

**Flow at 10,000 feet:**
*What's the happy path? Where do you expect hesitation?*

**Decision with rationale:**
*_(Required for moving to "Decision Made")_ State the final decision and provide a clear, concise rationale for it. This is the source of truth for the Decision Log.*

---

*This document is prepared exclusively for Vanta Wireless and its design partner, Metalab.*
