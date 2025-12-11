# Review Analysis Prompt

## Inputs Required
- Epic/Story key(s): e.g., DEMO-EPIC, DEMO-1, DEMO-2
- Branch/PR identifier: (optional) e.g., feature/DEMO-portfolio-risk, PR #42
- Current workspace: Checked out branch with code changes

## Analysis Steps

### Step 1: Load Requirements
- Read all `.md` files in `docs/requirements/` matching the provided keys
- For Epic: read epic file + all story files under it
- Extract from each requirement:
  - Story Key
  - Summary
  - Acceptance Criteria (numbered list)
  - Dependencies
  - Out of Scope items

### Step 2: Scan Code Changes
- If PR/branch specified: analyze only changed files (git diff)
- If no PR: scan entire workspace filtered by config globs
- Identify Salesforce components:
  - Custom Objects (*.object-meta.xml)
  - Custom Fields
  - Apex Classes (*.cls)
  - Apex Triggers (*.trigger)
  - Lightning Web Components (lwc/*)
  - Flows, Layouts, Permission Sets, etc.

### Step 3: Map AC to Code
For each Acceptance Criteria:
- Search for evidence in code
- Look for:
  - Field/object creation matching AC description
  - Logic in Apex that implements AC behavior
  - UI components (LWC) for AC requirements
  - Test classes covering AC scenarios
- Mark as:
  - ✅ **Met**: Clear evidence found, fully implemented
  - ⚠️ **Partial**: Some evidence, but incomplete or needs enhancement
  - ❌ **Missing**: No evidence found, not implemented

### Step 4: Identify Gaps and Risks
- **Orphaned Requirements**: AC with no code evidence
- **Orphaned Code**: Code changes not linked to any AC
- **Missing Tests**: AC without corresponding test coverage
- **Incomplete Implementation**: Partial implementations that need completion
- **Technical Debt**: Code quality issues, missing error handling
- **Edge Cases**: Scenarios not covered by AC or tests

### Step 5: Test Recommendations
For each story, recommend:
- Unit tests needed (specific Apex test methods)
- Integration test scenarios
- Edge cases to test
- Negative test cases
- Bulk operation tests

### Step 6: Generate Report
- Use template from `.agent/templates/report.md`
- Include all findings with file references and line numbers
- Provide approval decision with checklist
- Save to `docs/reviews/{KEY or PR}.md`

## Evidence Requirements
- Always cite specific files: `force-app/main/default/classes/ClassName.cls`
- Include line numbers when referencing code: `ClassName.cls:45-67`
- Quote relevant code snippets (keep under 10 lines)
- Reference git commits by hash when available
- Link test classes to the AC they cover

## Report Quality Standards
- Be specific, not vague ("Missing validation" → "Missing null check for Risk_Score__c in line 45")
- Provide actionable items ("Add test" → "Add test method testRiskScoreCalculationWithNullValues()")
- Use consistent formatting (tables, bullet points, code blocks)
- Include estimated effort for gaps (Quick/Medium/Complex)
- Prioritize findings (Critical/High/Medium/Low)