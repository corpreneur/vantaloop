# VantaLoop Project TODO

## Two-Stage Feedback System
- [x] Database schema: intake_items, register_items, comments, sms_conversations
- [x] tRPC procedures: intake.submit, intake.list, intake.triage
- [x] tRPC procedures: register.list, register.updateStatus
- [x] tRPC procedures: sms.webhook (conversational state machine)
- [x] Public web form at /submit (no auth required)
- [x] Triage dashboard at / (auth required, sidebar with Intake + Register views)
- [x] Intake list with status filters (All, New, Under Review, Promoted, Dismissed)
- [x] Intake detail panel with triage actions (Promote, Review, Dismiss)
- [x] Register Kanban view (Backlog, In Progress, Resolved, Archived)
- [x] Twilio SMS webhook Express route (/api/sms/webhook, returns TwiML)
- [ ] Twilio account setup (Account SID, Auth Token, Phone Number)
- [x] Vitest tests for intake.submit and sms.webhook procedures

## Documentation
- [x] PRD updated for two-stage intake/register model
- [x] Lovable toolkit prompt updated for new architecture
- [x] Notion template updated with Intake + Register databases
- [x] Lovable audit report
- [x] All docs in project docs/ directory

## Git
- [x] Docs copied to docs/ directory
- [ ] Push to corpreneur/vantaloop (pending token refresh)

## Design
- [x] Clean Slate monochrome design system (Instrument Serif + Satoshi)
- [x] Mobile-first public submit form
- [x] Dashboard layout with sidebar navigation

## Original V1/V2 Mockup Features (static, preserved in earlier checkpoints)
- [x] Kanban board with 5 columns
- [x] Card detail panel with structured feedback template
- [x] New card creation flow
- [x] Threaded comments
- [x] Timeline view
- [x] Decision Log view
- [x] Weekly Digest view
- [x] Priority and assignee filter chips
- [x] Feedback type tags
- [x] Stale card indicators
