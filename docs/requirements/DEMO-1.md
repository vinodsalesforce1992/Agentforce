---
key: DEMO-1
type: Epic
owner: Vinod Kumar Palanisamy
status: To Do
priority: Medium
---

# DEMO-1: Client Portfolio Risk Assessment & Alerts

## Summary

Implement automated portfolio risk monitoring for wealth advisors. System should calculate risk scores, display dashboard, and send alerts when thresholds are breached.

## Description

As a wealth advisor, I want to have a comprehensive portfolio risk monitoring system that automatically calculates risk scores, displays them in a dashboard, and sends alerts when risk levels exceed predefined thresholds. This will help me quickly identify clients who need immediate attention and make informed decisions about portfolio adjustments.

## Acceptance Criteria

- Risk scores are calculated automatically based on portfolio positions
- Risk scores are displayed on Account records
- Dashboard shows all clients sorted by risk level
- Alerts are sent when risk exceeds defined thresholds
- Risk scores update in real-time when portfolio positions change
- System provides historical risk tracking capabilities

## Technical Notes

- Need to implement risk scoring algorithm
- Should integrate with existing Portfolio_Position\_\_c object
- Requires dashboard component development
- Must include alert notification system
- Consider performance optimization for large datasets

## Dependencies

- Portfolio_Position\_\_c object and its CRUD operations
- Risk calculation engine logic
- Account record display functionality
- Dashboard component framework
- Notification/alert system

## Out of Scope

- Manual risk score override capability
- Third-party risk data integration
- Advanced analytics and reporting features
- Mobile application support

## Related Stories

### DEMO-2: View Client Portfolio Risk Score on Account

**Status**: To Do  
**Description**: As a wealth advisor, I want to see each client's portfolio risk score on their Account record so that I can quickly assess their investment risk exposure. The risk score should be calculated automatically based on their portfolio positions and categorized as Low, Medium, High, or Critical.

**Key Requirements**:

- Display risk score (0-100) on Account records
- Show risk category (Low/Medium/High/Critical) clearly
- Display last assessment date
- Allow custom risk threshold setting per client

### DEMO-3: Risk Score Updates Automatically When Portfolio Changes

**Status**: To Do  
**Description**: As a wealth advisor, I want the client's risk score to update immediately when I add, change, or remove portfolio positions so that I always see current risk information without manual recalculation.

**Key Requirements**:

- Real-time risk score updates when portfolio positions change
- Immediate feedback on risk score adjustments
- Event-driven architecture for triggering recalculations
- Performance considerations for frequent updates

### DEMO-4: Dashboard to Monitor All Clients' Risk Levels

**Status**: To Do  
**Description**: As a wealth advisor, I want to see a dashboard of all my clients sorted by risk level so that I can prioritize which clients need immediate attention.

**Key Requirements**:

- Dashboard showing all clients with risk levels
- Sorting by risk level (high to low)
- Quick access to client details
- Visual indicators for risk categories
- Filtering capabilities

### DEMO-5: Get Notified When Client Risk Exceeds Safe Limits

**Status**: To Do  
**Description**: As a wealth advisor, I want to receive automatic alerts when a client's portfolio risk exceeds their defined threshold so that I can take immediate action to rebalance their portfolio or discuss with them.

**Key Requirements**:

- Automatic alert generation when risk exceeds threshold
- Configurable threshold settings per client
- Multiple notification channels (email, in-app)
- Alert history tracking
- Escalation procedures

## Status

To Do

## Created

2025-12-08

## Link

https://vinodsalesforcepoc.atlassian.net/browse/DEMO-1
