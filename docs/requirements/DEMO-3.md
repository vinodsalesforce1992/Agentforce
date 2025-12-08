---
key: DEMO-3
type: Story
epic: DEMO-1
owner: Vinod Kumar Palanisamy
status: To Do
priority: Medium
---

# DEMO-3: Risk Score Updates Automatically When Portfolio Changes

## Summary

Risk Score Updates Automatically When Portfolio Changes

## Description

As a wealth advisor
I want the client's risk score to update immediately when I add, change, or remove portfolio positions
So that I always see current risk information without manual recalculation

## Acceptance Criteria

- When I add a new portfolio position, the risk score updates automatically
- When I modify an existing portfolio position, the risk score recalculates immediately
- When I remove a portfolio position, the risk score adjusts accordingly
- The risk score calculation happens in real-time without requiring manual intervention
- The system provides immediate feedback that the risk score has been updated

## Technical Notes

- Need to implement event-driven architecture to trigger risk score recalculations
- Should integrate with existing Portfolio_Position\_\_c object changes
- Consider performance implications of frequent recalculations
- May need to implement background processing for complex calculations

## Dependencies

- Portfolio_Position\_\_c object and its CRUD operations
- Risk calculation engine logic
- Account record display functionality

## Out of Scope

- Manual risk score override capability
- Historical risk score tracking
- Risk score calculation for multiple clients simultaneously

## Related Issues

- Epic: DEMO-1 - Client Portfolio Risk Assessment & Alerts
- Story: DEMO-2 - View Client Portfolio Risk Score on Account
- Story: DEMO-4 - Dashboard to Monitor All Clients' Risk Levels
- Story: DEMO-5 - Get Notified When Client Risk Exceeds Safe Limits

## Status

To Do

## Created

2025-12-08

## Link

https://vinodsalesforcepoc.atlassian.net/browse/DEMO-3
