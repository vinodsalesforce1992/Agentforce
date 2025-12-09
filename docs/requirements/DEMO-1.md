---
key: DEMO-1
type: Epic
child_count: 4
status: To Do
generated: 2025-12-09T05:16:51.275Z
---

# EPIC: Client Portfolio Risk Assessment & Alerts

> **Epic Context**
> Implement automated portfolio risk monitoring for wealth advisors. System should calculate risk scores, display dashboard, and send alerts when thresholds are breached.

---

# CHILD REQUIREMENTS (4)

## [DEMO-2] View Client Portfolio Risk Score on Account

**Type:** Story | **Status:** To Do | **Priority:** Medium

### Description

As a wealth advisor

I want to see each client's portfolio risk score on their Account record

So that I can quickly assess their investment risk exposure
The risk score should be calculated automatically based on their portfolio positions and categorized as Low, Medium, High, or Critical.

### Acceptance Criteria

When I open a client's Account record, I can see their Portfolio Risk Score (0-100)
I can see their Risk Category displayed clearly (Low/Medium/High/Critical)
I can see when the risk was last assessed
I can set a custom risk threshold for each client
I can create portfolio positions for the client with asset type, value, and risk weight
The risk score updates automatically based on the portfolio positions I add

### Technical Notes

- [ ] Validated against DEMO-2

---

## [DEMO-3] Risk Score Updates Automatically When Portfolio Changes

**Type:** Story | **Status:** To Do | **Priority:** Medium

### Description

As a wealth advisor

I want the client's risk score to update immediately when I add, change, or remove portfolio positions

So that I always see current risk information without manual recalculation

### Acceptance Criteria

When I add a new portfolio position, the risk score recalculates within 5 seconds
When I update a position's value or risk weight, the risk score updates automatically
When I delete a position, the risk score recalculates to reflect the change
The risk category (Low/Medium/High/Critical) updates based on the new score
The "Last Risk Assessment" date/time updates to show when it was calculated
This works even when I import multiple positions at once (bulk upload)

### Technical Notes

- [ ] Validated against DEMO-3

---

## [DEMO-4] Dashboard to Monitor All Clients' Risk Levels

**Type:** Story | **Status:** To Do | **Priority:** Medium

### Description

As a wealth advisor

I want to see a dashboard of all my clients sorted by risk level

So that I can prioritize which clients need immediate attention

### Acceptance Criteria

When I open my home page, I see a list of my clients with their risk information
For each client, I can see:
Client name
Portfolio value
Risk score with color coding (green/yellow/orange/red)
Risk category
When risk was last assessed
Clients are sorted with highest risk first by default
I can filter to see only High or Critical risk clients
I can click on a client to go directly to their Account record
The dashboard looks good on my laptop, tablet, and phone
I can see at least my top 10 highest risk clients at a glance

### Technical Notes

- [ ] Validated against DEMO-4

---

## [DEMO-5] Get Notified When Client Risk Exceeds Safe Limits

**Type:** Story | **Status:** To Do | **Priority:** Medium

### Description

As a wealth advisor

I want to receive automatic alerts when a client's portfolio risk exceeds their defined threshold

So that I can take immediate action to rebalance their portfolio or discuss with them

### Acceptance Criteria

When a client's risk score goes above their threshold, I receive an email alert
The email tells me:
Which client
Their current risk score
What their threshold is
A link to their Account record
I can see the alert on the client's Account record page
The alert shows as "New" until I acknowledge it
I can mark the alert as "Acknowledged" or "Resolved"
I don't receive multiple alerts for the same risk issue (no spam)
The alert shows how severe the breach is (slightly over vs way over threshold)

### Technical Notes

- [ ] Validated against DEMO-5

---
