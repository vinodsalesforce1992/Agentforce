# Traceability Review Report: {KEY or PR}

**Generated:** {Date}
**Reviewer:** AI Agent
**Branch/PR:** {Branch/PR identifier}
**Stories Analyzed:** {Story keys}

---

## Executive Summary

**Overall Status:** {✅ Ready / ⚠️ Needs Work / ❌ Blocked}

**Statistics:**
- Total Acceptance Criteria: {count}
- Met: {count} ({percentage}%)
- Partial: {count} ({percentage}%)
- Missing: {count} ({percentage}%)
- Test Coverage: {percentage}%

**Quick Verdict:**
{One paragraph summary of readiness for UAT/merge}

---

## Coverage Matrix

| Story | AC # | Acceptance Criteria | Status | Evidence | Notes |
|-------|------|---------------------|--------|----------|-------|
| DEMO-1 | 1 | ... | ✅ Met | File.cls:45 | ... |
| DEMO-1 | 2 | ... | ⚠️ Partial | File.cls:67 | Missing validation |
| DEMO-1 | 3 | ... | ❌ Missing | - | Not implemented |

---

## Files Touched

### Added Files
- `force-app/.../ClassName.cls` - Purpose and relation to AC
- `force-app/.../Component.js` - Purpose and relation to AC

### Modified Files
- `force-app/.../ExistingClass.cls` - Changes made and why
  - Lines 45-67: Implements AC #1
  - Lines 120-145: Implements AC #2

### Salesforce Components Created
- Custom Object: `Object__c`
- Custom Fields: `Field1__c`, `Field2__c`
- Apex Classes: `ClassName1`, `ClassName2`
- LWC Components: `componentName`

---

## Detailed Findings

### ✅ Fully Implemented (Met)

#### AC #1: {Acceptance Criteria Text}
**Evidence:**
- File: `ClassName.cls` lines 45-67
- Logic: {Brief description of implementation}
- Test: `ClassNameTest.testMethod()` lines 23-45

**Assessment:** Fully implemented with proper error handling and test coverage.

---

### ⚠️ Partially Implemented

#### AC #2: {Acceptance Criteria Text}
**Evidence:**
- File: `ClassName.cls` lines 89-110
- Logic: {What's implemented}

**Gaps:**
- Missing null check for edge case
- Error message not user-friendly
- Bulk operation not tested

**Effort to Complete:** Medium (2-4 hours)

---

### ❌ Not Implemented (Missing)

#### AC #5: {Acceptance Criteria Text}
**Status:** No code found

**Impact:** Critical - blocks UAT for this feature

**Recommendation:** Implement in `ClassName.cls`, estimated 4-6 hours

---

## Orphaned Code

**Code without linked requirements:**
- `HelperClass.cls` - Purpose unclear, no story reference
- `OldTrigger.trigger` - Legacy code, consider removing

**Recommendation:** Link to stories or document as technical debt

---

## Test Coverage Analysis

### Test Classes Found
- `ClassNameTest.cls` - Covers AC #1, #2 (85% coverage)
- `TriggerHandlerTest.cls` - Covers AC #4 (90% coverage)

### Missing Tests
- **AC #3**: No test found for bulk operation scenario
- **AC #5**: Not implemented, no tests
- **Edge Cases**: Null values, special characters, governor limits

### Test Recommendations
1. Add `testBulkOperationWith200Records()` for AC #3
2. Add `testNullValueHandling()` for edge cases
3. Add `testInvalidInputValidation()` for error scenarios
4. Add integration test for full user workflow

---

## Risks and Concerns

### 🔴 Critical
- AC #5 completely missing - blocks UAT
- No bulk testing - governor limit risk in production

### 🟡 Medium
- Error handling incomplete in ClassName.cls:67
- Missing validation for null inputs

### 🟢 Low
- Code comments could be improved
- Variable naming inconsistent

---

## Dependencies Check

### External Dependencies
- ✅ GitHub PR linked correctly
- ✅ JIRA stories referenced in commits
- ⚠️ Dependent story DEMO-2 not yet merged

### Technical Dependencies
- ✅ Required custom objects created
- ✅ Permission sets updated
- ❌ Email template not created (AC #4)

---

## Recommendations

### Before Merge
1. **Must Have:**
   - [ ] Implement AC #5
   - [ ] Add bulk operation tests
   - [ ] Fix null handling in ClassName.cls:67

2. **Should Have:**
   - [ ] Add error messages
   - [ ] Improve test coverage to 90%+
   - [ ] Add code comments

3. **Nice to Have:**
   - [ ] Refactor for better readability
   - [ ] Add logging for debugging

### Estimated Effort to Complete
- Critical items: 6-8 hours
- Total remaining work: 8-12 hours

---

## Approval Decision

**Status:** {✅ APPROVED / ⚠️ APPROVED WITH CONDITIONS / ❌ BLOCKED}

### Checklist
- [ ] All acceptance criteria met or have approved work