# Product Requirements Document: VantaLoop Design Feedback System

## Executive Summary

This document outlines the requirements for the VantaLoop Design Feedback System, a two-stage model designed to streamline the collection and processing of design feedback for Vanta Wireless. The system will provide a structured and efficient workflow for Vanta team members to submit feedback and for the core team (William Traylor and Sue from Metalab) to triage and act upon it.

The first stage, **Weekly Intake**, allows for the submission of raw feedback through two distinct channels: a public, mobile-first web form and a conversational SMS text loop. This dual-channel approach ensures that feedback can be captured easily and conveniently, regardless of the user's context.

The second stage, **Triage and Register**, involves a weekly review of all submitted feedback. Actionable items are promoted to a formal feedback register, which is visualized as a Kanban board. This process ensures that valuable feedback is not lost and is tracked through to resolution.

This system is built on a modern technology stack, including React 19, Tailwind 4, Express 4, tRPC 11, and Drizzle ORM with a MySQL database, to deliver a robust and scalable solution.

## Epics and User Stories

### Epic 1: Web Form Intake

**As-Built Status:** Built

As a Vanta team member, I want to be able to submit design feedback through a simple, mobile-first web form so that I can quickly share my thoughts without needing to log in.

**User Stories:**

*   **Story 1.1:** As a user, I can access the public web form at `/submit`.
    *   **Acceptance Criteria:**
        *   The form is accessible without authentication.
        *   The form is responsive and optimized for mobile devices.
*   **Story 1.2:** As a user, I can fill out the structured feedback template.
    *   **Acceptance Criteria:**
        *   The form includes fields for: submitter name, feedback type, subject, goal of share, what's working, questions/risks, suggestions, and decision needed.
        *   The form validates that all required fields are completed before submission.
*   **Story 1.3:** As a user, I can submit the form and receive a confirmation message.
    *   **Acceptance Criteria:**
        *   Upon submission, the data is saved to the `intake_items` table.
        *   A confirmation message is displayed to the user.

### Epic 2: SMS Text Loop Intake

**As-Built Status:** SMS backend built, awaiting Twilio credentials

As a Vanta team member, I want to be able to submit design feedback by texting a number, so that I can provide feedback on the go.

**User Stories:**

*   **Story 2.1:** As a user, I can initiate a feedback submission by sending a text to a designated phone number.
    *   **Acceptance Criteria:**
        *   The system responds with a welcome message and the first prompt.
*   **Story 2.2:** As a user, I am guided through the feedback submission process with a series of prompts.
    *   **Acceptance Criteria:**
        *   The system prompts for each field of the structured feedback template.
        *   The conversation is stored in the `sms_conversations` table.
*   **Story 2.3:** As a user, I can skip optional fields.
    *   **Acceptance Criteria:**
        *   The system recognizes a "SKIP" command and moves to the next prompt.
*   **Story 2.4:** As a user, my feedback is saved upon completion of the conversation.
    *   **Acceptance Criteria:**
        *   The completed feedback is saved to the `intake_items` table.

### Epic 3: Triage Dashboard

**As-Built Status:** In progress

As a triage team member (William or Sue), I want a protected dashboard to review all incoming feedback so that we can efficiently process the weekly intake.

**User Stories:**

*   **Story 3.1:** As a triage team member, I must log in to access the triage dashboard.
    *   **Acceptance Criteria:**
        *   The dashboard is behind an authentication wall.
        *   Only authorized users can access the dashboard.
*   **Story 3.2:** As a triage team member, I can view all feedback submitted in the last week.
    *   **Acceptance Criteria:**
        *   The dashboard displays a list of all items from the `intake_items` table with a status of "New".
*   **Story 3.3:** As a triage team member, I can promote an intake item to the formal register.
    *   **Acceptance Criteria:**
        *   Promoting an item creates a new entry in the `register_items` table.
        *   The status of the original intake item is updated to "Promoted".

### Epic 4: Formal Register/Kanban

**As-Built Status:** In progress

As a triage team member, I want to manage and track the status of promoted feedback items on a Kanban board so that we have a clear view of our workflow.

**User Stories:**

*   **Story 4.1:** As a triage team member, I can view the feedback register as a Kanban board.
    *   **Acceptance Criteria:**
        *   The board has columns for: Backlog, In Progress, Resolved, and Archived.
        *   Each card on the board represents an item from the `register_items` table.
*   **Story 4.2:** As a triage team member, I can move cards between columns.
    *   **Acceptance Criteria:**
        *   Dragging and dropping a card updates the status of the corresponding `register_item`.

### Epic 5: Weekly Digest

As a stakeholder, I want to receive a weekly email digest of all new and resolved feedback so that I can stay informed about the design process.

**User Stories:**

*   **Story 5.1:** As a system, we automatically generate and send a weekly digest email.
    *   **Acceptance Criteria:**
        *   The email is sent every Monday at 9:00 AM.
        *   The email includes a summary of all new intake items and all register items moved to "Resolved" in the past week.

### Epic 6: Twilio Integration Setup

As a developer, I need to configure the Twilio integration so that the SMS feedback loop is operational.

**User Stories:**

*   **Story 6.1:** As a developer, I can configure the Twilio Account SID, Auth Token, and Phone Number in the application's environment variables.
    *   **Acceptance Criteria:**
        *   The application successfully connects to the Twilio API.
        *   The application can send and receive SMS messages.

## Data Model Reference

| Table Name          | Key Fields                                                                                                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `intake_items`      | `id`, `submitter_name`, `feedback_type`, `subject`, `goal_of_share`, `whats_working`, `questions_risks`, `suggestions`, `decision_needed`, `created_at`                                                     |
| `register_items`    | `id`, `title`, `status`, `created_at`, `updated_at`                                                                                                                                                 |
| `comments`          | `id`, `register_item_id`, `user_id`, `content`, `created_at`                                                                                                                                         |
| `sms_conversations` | `id`, `phone_number`, `current_step`, `feedback_data`, `created_at`                                                                                                                                 |
| `users`             | `id`, `name`, `email`, `password_hash`, `created_at`                                                                                                                                                |

## Non-Functional Requirements

*   **Mobile-First:** All public-facing interfaces must be designed with a mobile-first approach.
*   **Public Form:** The web form for submitting feedback must be publicly accessible without requiring authentication.
*   **Authentication:** The triage dashboard and feedback register must be protected and require user authentication.
*   **Professional Tone:** All user-facing copy should be professional and avoid the use of emojis. Ellipses (...) should be used in place of em-dashes.

---

Vanta Wireless -- VantaLoop Design Feedback System
