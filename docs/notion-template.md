# Vanta <> Metalab: Design Feedback

This template provides a structured format for submitting design feedback. The goal is to ensure all feedback is clear, actionable, and tied to a specific decision.

---

**Epic**: [Link to Epic]
**Priority**: [P0-P3]
**Feedback Type**: [Concept-Direction, Information-Architecture, Interaction-Pattern, Visual-Design, Copy-Content]
**Assignee**: [Name]
**Status**: [New Concept, Feedback Submitted, In Review, Decision Made, Archived]

---

### Goal of this share
*A concise, one-sentence summary of the design goal.*

### What's working
*What aspects of the design are effective and should be kept?*
- 
- 
- 

### Questions/risks
*What open questions or potential risks does this design raise?*
- 
- 
- 

### Suggestions
*Propose specific, testable changes to address the questions and risks.*

### Decision needed today
*Clearly state the primary decision required based on this feedback (e.g., "Proceed with Concept A vs. B").*

---

### Critical Questions
- [ ] Is this the right problem to solve?
- [ ] Which concept direction is strongest?
- [ ] What are the biggest risks with this approach?
- [ ] What should we prototype next?

### Clarity + Value
- **What part is immediately clear?**
- **What feels confusing or missing?**
- **What is the hook or main value in one sentence?**

### Flow at 10,000 feet
- **What is the happy path in 4-6 steps?**
- **Where would a user hesitate or drop off?**

---

### Decision
- [ ] Proceed with concept A
- [ ] Proceed with concept B
- [ ] Combine A + B
- [ ] Pause and redefine the problem

**Rationale:**
*Provide a clear justification for the decision.*

---

## Notion Setup Instructions

To set up this feedback workstream in Notion, follow these steps:

**Step 1 -- Create the Database.** In the shared Vanta-Metalab workspace, create a new full-page database. Name it "Design Feedback Board". Set the default view to "Board" and group by a "Status" select property with the following options: New Concept, Feedback Submitted, In Review, Decision Made, Archived.

**Step 2 -- Add Properties.** Add the following properties to the database: "Epic" (Select: Feedback Hub Setup, Design Share & Feedback, Synthesis & Decisions, Agentic Aggregation), "Priority" (Select: P0, P1, P2, P3), "Feedback Type" (Multi-select: Concept-Direction, Information-Architecture, Interaction-Pattern, Visual-Design, Copy-Content), "Assignee" (Person), "Created" (Created time), and "Last Edited" (Last edited time).

**Step 3 -- Create the Template.** Inside the database, create a new template. Name it "Design Feedback Card". Paste the full template content above (from "Goal of this share" through "Rationale") into the template body. This ensures every new card starts with the structured format.

**Step 4 -- Create Additional Views.** Add a "Timeline" view (timeline by Created time, grouped by Epic). Add a "Decision Log" view (table, filtered to Status = Decision Made, showing only Title, Decision, Rationale, and Last Edited columns). Add a "Stale Items" view (table, filtered to Last Edited is more than 5 days ago AND Status is not Decision Made or Archived).

**Step 5 -- Share with the Team.** Add all Vanta and Metalab team members to the workspace. Set permissions so that all members can edit. Pin the database to the sidebar for easy access.

---

*Vanta Wireless <> Metalab Design Workstream*
