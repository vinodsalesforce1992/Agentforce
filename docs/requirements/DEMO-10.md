---
key: DEMO-10
type: Epic
child_count: 2
status: In Progress
generated: 2025-12-14T10:44:05.782Z
---

# EPIC: Task Priority Management System

> **Epic Context**
> Simple system to help users manage and track high-priority tasks with visual indicators and notifications. This epic includes: - Priority fields and color coding - Email reminders for urgent tasks

---

# CHILD REQUIREMENTS (2)

## [DEMO-11] Add Priority Field and Color Coding to Tasks

**Type:** Story | **Status:** In Progress | **Priority:** Medium

### Description

As a user I want to see task priority with color coding So that I can quickly identify urgent tasks

### Acceptance Criteria

Add Priority field to Task object
Picklist with values: Low, Medium, High, Urgent
Default value: Medium
Required field
Add Due Date Indicator field to Task
Formula field
Shows "Overdue" if past due date, "Due Soon" if within 3 days, "On Track" otherwise
Create Lightning Web Component for task list
Displays user's tasks
Color-coded by priority (Low=Green, Medium=Yellow, High=Orange, Urgent=Red)
Shows 10 tasks at a time
Add Task Priority field to Task page layout
Visible on standard Task layout
Positioned near Subject field

### Comments from Jira

**Comment by Vinod Kumar Palanisamy (2025-12-11):**
Additional requirement from stakeholder meeting: When Priority is set to "Urgent", automatically populate a field called "Escalation_Needed\_\_c" (checkbox) to TRUE. This will help the support team filter urgent items that need escalation.

### Technical Notes

- [ ] Validated against DEMO-11

---

## [DEMO-12] Send Email Reminders for Urgent Tasks

**Type:** Story | **Status:** In Progress | **Priority:** Medium

### Description

As a user

I want to receive daily email reminders for my urgent tasks

So that I don't miss critical deadlines

### Acceptance Criteria

Create email template for task reminders
Subject: "You have {count} urgent tasks"
Body includes: Task subject, due date, priority
Company branding colors
Apex scheduled job runs daily at 8 AM
Queries all tasks with Priority = 'Urgent' and Status != 'Completed'
Groups by owner
Sends one email per user with their urgent tasks
Custom setting to enable/disable reminders
Name: Task_Reminder_Settings**c
Checkbox: Enable_Daily_Reminders**c
Only sends emails if enabled
Test class with 85% coverage
Test email is sent
Test multiple users
Test when setting is disabled

### Technical Notes

- [ ] Validated against DEMO-12

---
