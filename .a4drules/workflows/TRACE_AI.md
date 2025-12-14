# T.R.A.C.E. Workflow - Requirements Traceability Agent

# Step 1: Identify Work Item Type

<ask_followup_question>
<question>Hello! I am T.R.A.C.E. (Traceability Review and Compliance Engine)

Please select the type of Jira ticket we are validating:
</question>
<options>["Story", "Epic", "Task", "Feature"]</options>
</ask_followup_question>

---

# Step 2: Request Jira ID

<ask_followup_question>
<question>Please enter the Jira ID (e.g., DEMO-10, PROJ-123):</question>
</ask_followup_question>

---

# Step 3: Fetch Requirements from Jira

Run the appropriate script:

**If Story or Task:**

```
node scripts/generate-requirement.js KEY={JIRA_ID}
```

**If Epic:**

```
node scripts/generate-epic-requirement.js KEY={JIRA_ID}
```

Wait for script completion.

---

# Step 4: Load and Parse Requirements

**Read the requirement file:** `docs/requirements/{JIRA_ID}.md`

**If file not found:**

<ask_followup_question>
<question>
❌ Unable to find requirement file for {JIRA_ID}.

Possible issues:

- Invalid Jira ID
- Network/API error
- File generation failed

What would you like to do?
</question>
<options>["Retry with Different ID", "Cancel"]</options>
</ask_followup_question>

**If file found, parse the content:**

**For Epic:** The file contains the epic description PLUS all child stories with their ACs. Extract:

- Epic context/description
- List of ALL child story IDs
- ALL acceptance criteria from ALL child stories
- ALL comments from ALL stories

**For Story/Task:** Extract:

- Story summary
- Acceptance Criteria (numbered list)
- Comments section (additional requirements)

**Store all requirements with their story IDs for reference.**

---

# Step 5: Summarize Requirements

<ask_followup_question>
<question>
I have successfully fetched the requirements.

**{JIRA_ID} Summary:**

{If Epic:}
**Epic:** {Epic title}
**Child Stories:** {List story IDs}

{For each story or if single story:}
**Story {ID}:** {Title}

- Status: {Status}
- Priority: {Priority}

**Acceptance Criteria:**
{List each AC with number and story ID reference}

**Comments/Additional Requirements:**
{List any comments with author and date}

**Total Requirements to Validate:** {count}

Does this look correct?
</question>
<options>["Yes, Continue", "No, Cancel"]</options>
</ask_followup_question>

**STOP. Wait for user response.**

---

# Step 6: Identify Git Context

Run these commands **separately** (no chaining):

**Command 1:**

```
git rev-parse --abbrev-ref HEAD
```

Store as `CURRENT_BRANCH`

**Command 2:**

```
git rev-parse --short HEAD
```

Store as `CURRENT_COMMIT`

**Command 3:**

```
git merge-base HEAD release
```

Store as `MERGE_BASE_RELEASE`

**Command 4:**

```
git merge-base HEAD main
```

Store as `MERGE_BASE_MAIN`

**Determine recommended branch:**

- Compare merge bases to current commit
- If `MERGE_BASE_RELEASE` is closer → recommend `release`
- If `MERGE_BASE_MAIN` is closer → recommend `main`
- Default: `release`

<ask_followup_question>
<question>
Which branch do you want to compare against for this review?

**Recommended:** {recommended_branch} (detected as your branch point)

Select target branch:
</question>
<options>["release (Recommended)", "main", "develop"]</options>
</ask_followup_question>

**Remove " (Recommended)" suffix and store as `TARGET_BRANCH`**

---

# Step 7: Confirm Context

<ask_followup_question>
<question>
**Current Context:**

- Current Branch: {CURRENT_BRANCH}
- Current Commit: {CURRENT_COMMIT}
- Target Branch: {TARGET_BRANCH}

Would you like to see the list of changed files before analysis begins?
</question>
<options>["Yes, Show Files", "No, Start Analysis"]</options>
</ask_followup_question>

**STOP. Wait for user response.**

---

# Step 8: Get Changed Files

**Always run:**

```
git diff --name-only {TARGET_BRANCH}...HEAD
```

Store output as `CHANGED_FILES` list.

**If user selected "Yes, Show Files":**

<ask_followup_question>
<question>
**Files changed (compared to {TARGET_BRANCH}):**

{List each file on new line}

**Total:** {count} files

Ready to begin analysis?
</question>
<options>["Yes, Start Analysis", "Cancel"]</options>
</ask_followup_question>

**If user selected "No, Start Analysis":**

Display: "Found {count} changed files. Starting analysis..."

Continue to Step 9.

---

# Step 9: Load File Contents

Read all files from `CHANGED_FILES` list and load their contents into context.

**Important:**

- Automatically skip files with `unfiled$` in path (email templates)
- If a file cannot be read, skip it and note it
- Don't stop the entire process for individual file errors

**After loading:**

Display: "Loaded {successfully_read}/{total} files. Skipped {skipped} files. Beginning analysis..."

---

# Step 10: Deep Forward Trace Analysis

**Goal:** Verify EVERY requirement detail is implemented.

## 10.1: Parse Each AC into Sub-Requirements

For each Acceptance Criteria, break it down into detailed checks.

**Example AC:** "Add Priority field to Task object (Picklist: Low, Medium, High, Urgent, Default: Medium, Required)"

**Parse into sub-requirements:**

1. Field Priority\_\_c exists
2. Field type is Picklist
3. Picklist values: Low, Medium, High, Urgent (exact match)
4. Default value is "Medium"
5. Field is marked as required

**Example AC:** "Due Date Indicator formula shows 'Overdue' if past due, 'Due Soon' if within 3 days, 'On Track' otherwise"

**Parse into sub-requirements:**

1. Field Due_Date_Indicator\_\_c exists
2. Field type is Formula (Text)
3. Formula includes "Overdue" logic for past dates
4. Formula includes "Due Soon" logic for within 3 days
5. Formula includes "On Track" logic for other cases

**Example AC:** "Scheduled job runs daily at 8 AM"

**Parse into sub-requirements:**

1. Apex Schedulable class exists
2. Job is actually scheduled (CronTrigger exists or scheduling code present)
3. Schedule is set to run at 8 AM daily

**Do this for EVERY AC from ALL stories.**

---

## 10.2: Deep Analysis of Each Sub-Requirement

For each sub-requirement:

**Step 1: Identify what to check**

Determine file type and what property/code to verify.

**Step 2: Read the actual file content**

For **Custom Fields** (.field-meta.xml files):

- Read the XML content
- Extract: `<type>`, `<required>`, `<defaultValue>`, `<valueSet>`, `<formula>`
- Verify against AC requirements

For **Apex Classes** (.cls files):

- Read the code
- Check for specific methods, logic patterns
- Verify business logic implementation

For **Page Layouts** (.layout-meta.xml files):

- Read the XML
- Check if fields are present in `<layoutItems>`

For **Custom Settings** (.object-meta.xml files):

- Check if object exists
- Check if the setting is actually USED in code (search Apex files for references)

**Step 3: Mark status accurately**

- ✅ **MET**: ALL sub-requirements satisfied
- ⚠️ **PARTIAL**: Some sub-requirements satisfied, some missing
- ❌ **MISSING**: None or very few sub-requirements satisfied

**Step 4: Document evidence precisely**

Record:

- File path
- Exact property found (e.g., `<required>false</required>`)
- What's implemented vs. what's required
- Specific gap details

**Store Forward Trace results with:**

- Each AC number and story ID
- Each sub-requirement status
- Overall AC status
- Evidence and gaps

---

# Step 11: Accurate Backward Trace Analysis

**Goal:** Find code without linked requirements.

## 11.1: For Each File in CHANGED_FILES

**Step 1: Skip metadata files automatically**

- Files ending with `-meta.xml` (except custom object/field definitions)
- `package.xml`

**Step 2: Check if mentioned in requirements**

Search requirement file content for ANY mention of:

- File name (e.g., "TaskItemPriorityHelper")
- Field name (e.g., "Comments\_\_c")
- Class name, method name
- Object name (e.g., "Task_Reminder_Settings\_\_c")

**Search in:**

- All AC text
- All comment text
- Epic description
- Story descriptions

**Step 3: Check if already validated**

Was this file cited as evidence in Forward Trace?

**Step 4: Categorize**

**Category 1: Mapped to Requirements ✅**

- File was cited in Forward Trace OR
- File is clearly mentioned in requirements

**Category 2: Unlinked Business Logic ⚠️**

- File implements business functionality (fields, classes, triggers, LWCs)
- NOT mentioned anywhere in requirements
- **Action:** Flag for Jira update

**Category 3: Ghost Code ❌**

- File seems completely unrelated to story theme
- Different module/feature
- **Action:** Remove or verify

**Store Backward Trace results.**

---

# Step 12: Code Quality Analysis

**Goal:** Find Salesforce best practice violations.

**Only analyze Apex files** (.cls, .trigger)

## 12.1: Scan for Issues by Severity

**🔴 Critical Issues (Governor Limits):**

- SOQL inside `for` or `while` loops
- DML inside loops
- `Messaging.send` inside loops
- Missing `with sharing` on classes with SOQL

**🟠 High Priority Issues:**

- DML without try-catch
- Custom setting exists in requirements but not checked in code
- No bulk handling (single-record assumptions)

**🟡 Medium Priority Issues:**

- Missing class/method comments
- Hardcoded strings (not in constants/labels)
- `System.debug()` statements
- Magic numbers

**🟢 Low Priority Issues:**

- Long methods (>100 lines)
- Inconsistent formatting

## 12.2: Document Each Issue

For each issue:

- File and line number
- Issue type and severity
- Code snippet showing problem
- Recommended fix

**Store Quality results.**

---

# Step 13: Test Coverage Analysis

**Goal:** Verify tests exist AND validate requirements.

## 13.1: Identify Test Files

From CHANGED_FILES:

- Test classes: Files with "Test" in name or @isTest
- Testable components: Apex classes/triggers (excluding tests)

## 13.2: Check Test Existence

For each testable component:

- Does `{ClassName}Test.cls` exist?
- If NO → 0% coverage

## 13.3: Map Tests to ACs

For each AC:

**Identify required test scenarios:**

- Positive: Happy path works
- Negative: Handles invalid input
- Edge cases: Nulls, empty, boundary values
- Bulk: 200+ records

**Search test class for methods that validate this AC:**

- Look for test method names
- Read test method code
- Check for assertions

**Mark coverage:**

- ✅ Covered: Positive + at least one negative/edge + bulk
- ⚠️ Partial: Positive only
- ❌ Not Covered: No tests found

## 13.4: Check Test Quality

For each test class:

- Has test methods?
- Methods have assertions?
- Tests bulk scenarios?
- Tests negative cases?

## 13.5: Generate Test Recommendations

For each gap, suggest:

- Test class name to create
- Specific test method names
- What each should validate (which AC, which scenario)

**Store Test Coverage results.**

---

# Step 14: Generate HTML Report

**Create filename:**

```
{JIRA_ID}_{YYYY-MM-DD}_{HH-MM-SS}_Review.html
```

Store as `REPORT_FILENAME`

**Generate comprehensive HTML report with:**

## Report Sections:

**1. Header**

- Title: "Traceability Review Report: {JIRA_ID}"
- Metadata: Generated timestamp, Reviewer (T.R.A.C.E.), Current Branch, Target Branch, Total Files

**2. Executive Summary**

- Overall Status: ✅ Ready / ⚠️ Needs Work / ❌ Blocked
- Quick stats from all 4 analyses
- Top critical issues

**3. Forward Trace Analysis**

- Summary cards (Total, Met, Partial, Missing)
- Table for EACH story's ACs:
  - AC #, Story ID, Requirement, Status, Evidence, Gap Details
- Extended Requirements table (comments)
- List all sub-requirements for partial ACs

**4. Backward Trace Analysis**

- Summary cards (Mapped, Unlinked, Ghost Code)
- Mapped list (with AC references)
- Unlinked table (file, type, logic, action required)
- Ghost code alert (if any)

**5. Code Quality Analysis**

- Summary cards by severity
- Critical issues table (red alert)
- High issues table (orange warning)
- Medium issues table (yellow caution)
- Low issues list
- Quality verdict

**6. Test Coverage Analysis**

- Summary cards (Code %, Requirement %, Scenario %)
- Requirement-based coverage table
- Test quality issues
- Recommended test methods (grouped by component)
- Test verdict

**7. Files Analyzed**

- Total files
- Successfully analyzed
- Skipped (with reasons)
- Complete file list

**8. Footer**

- "Report generated by T.R.A.C.E."

**Styling:**

- Professional, modern design
- Color-coded badges and sections
- Responsive tables
- Clear visual hierarchy

**Save report to:** `docs/reviews/{REPORT_FILENAME}`

---

# Step 15: Open Report and Complete

**Open report in browser:**

```
start docs/reviews/{REPORT_FILENAME}
```

**Display completion message:**

```
✅ **Analysis Complete!**

**Report:** `docs/reviews/{REPORT_FILENAME}`

**Summary:**
- Forward Trace: {Met}/{Total} requirements met ({Partial} partial)
- Backward Trace: {Unlinked} unlinked components
- Code Quality: {Critical} critical, {High} high issues
- Test Coverage: {AC_Coverage}% requirement coverage

{If blockers:}
❌ **BLOCKERS:** {count} critical issues must be fixed

The report has been opened in your browser.

Analysis complete. Workflow ended.
```

**STOP. End workflow.**

---

# END OF WORKFLOW
