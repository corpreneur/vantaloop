
_# VantaLoop: Design Feedback Notion Template_

This document outlines the structure and setup for a comprehensive design feedback system within Notion, tailored for the VantaLoop project. It includes two core databases, "Weekly Intake" and "Feedback Register," designed to streamline the process from initial submission to final resolution.

---

## 1. Weekly Intake Database

The "Weekly Intake" database serves as the central repository for all incoming feedback, whether from the web form or the SMS loop. Each entry represents a single piece of raw, unprocessed feedback.

### Properties

| Property | Type | Description |
| --- | --- | --- |
| **Subject** | `Title` | The main subject or title of the feedback. |
| **Submitter** | `Text` | The name of the person who submitted the feedback. |
| **Channel** | `Select` | The source of the feedback. Options: `Web`, `SMS`. |
| **Feedback Type** | `Multi-select` | The category of the feedback. Options: `Concept-Direction`, `Information-Architecture`, `Interaction-Pattern`, `Visual-Design`, `Copy-Content`, `General`. |
| **Status** | `Select` | The current status of the feedback. Options: `New`, `Under Review`, `Promoted`, `Dismissed`. |
| **Week** | `Text` | The week number or date range when the feedback was submitted (e.g., "2024-W08"). |
| **Triaged By** | `Person` | The team member(s) who reviewed the feedback. |
| **Triage Notes** | `Text` | Notes and comments from the triage session. |
| **Goal of Share** | `Text` | What the submitter aimed to achieve by sharing this feedback. |
| **What's Working** | `Text` | Positive aspects highlighted by the submitter. |
| **Questions/Risks** | `Text` | Any questions or potential risks raised. |
| **Suggestions** | `Text` | Specific suggestions for improvement. |
| **Decision Needed** | `Text` | Any specific decision required from the team. |

### Views

- **All Intake:** A simple table view showing all submitted feedback, sorted by week.
- **This Week:** A filtered view showing only feedback submitted in the current week.
- **Needs Triage:** A filtered view showing all feedback with the status "New," serving as the primary queue for the weekly triage meeting.

## 2. Feedback Register Database

Once a piece of feedback from the "Weekly Intake" is deemed actionable, it is promoted to the "Feedback Register." This database tracks the entire lifecycle of a formal feedback item, from backlog to resolution.

### Properties

| Property | Type | Description |
| --- | --- | --- |
| **Title** | `Title` | A concise, actionable title for the feedback item. |
| **Epic** | `Select` | The larger product or design epic this feedback relates to. |
| **Priority** | `Select` | The priority of the feedback. Options: `High`, `Medium`, `Low`. |
| **Status** | `Select` | The current stage of the feedback. Options: `Backlog`, `In Progress`, `Resolved`, `Archived`. |
| **Assignee** | `Person` | The team member(s) responsible for addressing the feedback. |
| **Feedback Type** | `Multi-select` | The category of the feedback, inherited from the intake item. |
| **Decision** | `Text` | The final decision made regarding the feedback. |
| **Decision Rationale** | `Text` | The reasoning behind the final decision. |
| **Promoted From** | `Relation` | A relation to the original item in the "Weekly Intake" database. |

### Template: New Intake Item

Create a template within the "Weekly Intake" database with the following fields pre-filled to guide submitters and streamline the triage process.

- **Subject:** [Briefly describe the core feedback]
- **Goal of Share:** [What do you hope to achieve by sharing this? e.g., get a decision, share a concern, suggest an improvement]
- **What's Working:** [What aspects of the current design/concept are effective?]
- **Questions/Risks:** [Are there any open questions or potential risks you foresee?]
- **Suggestions:** [What specific changes or improvements would you recommend?]
- **Decision Needed:** [Is there a specific decision you need from the team?]

### Views

- **Register Board:** A Kanban board view grouped by the "Status" property, providing a clear visual overview of the feedback pipeline.
- **Decision Log:** A filtered table view showing only items with the status "Resolved," creating a searchable log of all final decisions.

## 3. Notion Setup Instructions

We will follow a step-by-step process to configure the Notion workspace. First, create a new page in Notion and title it "VantaLoop Design Feedback." Second, create the two databases as described above, "Weekly Intake" and "Feedback Register." Third, populate the properties for each database exactly as specified in the tables. Fourth, establish the relation between the "Feedback Register" and "Weekly Intake" databases using the "Promoted From" property. Fifth, create the new intake item template within the "Weekly Intake" database. Finally, configure the specified views for both databases to create the necessary dashboards for triage and tracking.


---

_Vanta Wireless ... VantaLoop Design Feedback System_
