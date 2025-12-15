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
<question>Please enter the Jira ID (e.g., DEMO-14, PROJ-123):</question>
</ask_followup_question>

---

# Step 3: Fetch Requirements from Jira

Run the appropriate script based on work item type:

**If Story or Task:**

```
node scripts/generate-requirement.js KEY={JIRA_ID}
```

**If Epic:**

```
node scripts/generate-epic-requirement.js KEY={JIRA_ID}
```

Wait for the script to complete.

---

# Step 4: Load Requirements File

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

**If file found, parse it:**

**For Epic:** Extract:

- Epic description
- All child story IDs
- All acceptance criteria from all child stories
- All comments from all stories

**For Story/Task:** Extract:

- Story summary
- Acceptance Criteria (numbered list)
- Comments section

Store all requirements for analysis.

---

# Step 5: Summarize and Confirm Requirements

<ask_followup_question>
<question>
I have successfully fetched the requirements for **{JIRA_ID}**.

{If Epic:}
**Epic:** {Epic title}
**Child Stories:** {List story IDs}

{For each story:}
**Story {ID}:** {Title}

- Status: {Status}
- Priority: {Priority}

**Acceptance Criteria:**
{List each AC with number}

**Comments:**
{List comments if any}

**Total Requirements:** {count}

Does this look correct?
</question>
<options>["Yes, Continue", "No, Cancel"]</options>
</ask_followup_question>

**STOP. Wait for user response.**

---

# Step 6: Identify Git Context

Run these commands separately (no chaining with &&):

**Command 1:**

```
git rev-parse --abbrev-ref HEAD
```

Store result as `CURRENT_BRANCH`

**Command 2:**

```
git rev-parse --short HEAD
```

Store result as `CURRENT_COMMIT`

**Command 3:**

```
git merge-base HEAD release
```

Store result as `MERGE_BASE_RELEASE`

**Command 4:**

```
git merge-base HEAD main
```

Store result as `MERGE_BASE_MAIN`

**Determine recommended target branch:**
Compare the merge bases to decide which branch is the better comparison point. Default to `release` if unclear.

<ask_followup_question>
<question>
Which branch do you want to compare against?

**Recommended:** {recommended_branch}

Select target branch:
</question>
<options>["release (Recommended)", "main", "develop"]</options>
</ask_followup_question>

Remove " (Recommended)" suffix from user selection and store as `TARGET_BRANCH`

---

# Step 7: Confirm Context

<ask_followup_question>
<question>
**Git Context:**

- Current Branch: {CURRENT_BRANCH}
- Current Commit: {CURRENT_COMMIT}
- Target Branch: {TARGET_BRANCH}

Would you like to see the list of changed files?
</question>
<options>["Yes, Show Files", "No, Start Analysis"]</options>
</ask_followup_question>

**STOP. Wait for user response.**

---

# Step 8: Get Changed Files List

**Run this command:**

```
git --no-pager diff --name-only {TARGET_BRANCH}...HEAD
```

**CRITICAL:** Store the complete output as `CHANGED_FILES` list. This is the ONLY list of files you will analyze in all subsequent steps.

**Count the files:** Store the total count as `TOTAL_FILES`

**If user selected "Yes, Show Files":**

<ask_followup_question>
<question>
**Files changed (compared to {TARGET_BRANCH}):**

{Display each file path on a new line}

**Total:** {TOTAL_FILES} files

Ready to begin analysis?
</question>
<options>["Yes, Start Analysis", "Cancel"]</options>
</ask_followup_question>

**If user selected "No, Start Analysis":**

Display: "Found {TOTAL_FILES} changed files. Starting analysis..."

Proceed to Step 9.

---

# Step 9: Load Changed Files Content

**Read the content of files from the CHANGED_FILES list.**

**Files to skip:**

- Any file with `unfiled$` in the path
- Files that cause read errors

**After reading, note:**

- Successfully read: {count}
- Skipped: {count}

Display: "Loaded {successfully_read} of {TOTAL_FILES} files. Beginning analysis..."

---

# Step 10: Forward Trace Analysis

**Goal:** Validate that EVERY acceptance criterion is fully implemented with DEEP analysis.

CRITICAL: You MUST read actual file contents. DO NOT guess based on field names.

RULE: Explicitly check each word in the requirements (AC, Description and Comments) and ensure the implementation matches with proper logic.

Read all acceptance criteria and comments. For each AC:

1. Find the files that should implement it
2. **Use `view` tool to read those files**
3. Check if EVERYTHING in the AC is implemented exactly
4. Mark: ✅ MET, ⚠️ PARTIAL, or ❌ MISSING
5. Record: AC #, Story, Requirement, Status, Evidence, Gaps, Suggestions

**CRITICAL RULES:**

1. **NEVER mark as MET without reading the actual file**
2. **NEVER assume or guess file contents**
3. **ALWAYS use the view tool to read files**
4. **ALWAYS document what you found vs what was required**
5. **Be strict: only MET if EVERYTHING matches exactly**

**Status Guidelines:**

- ✅ **MET**: Implementation exists AND matches ALL AC requirements exactly
- ⚠️ **PARTIAL**: Implementation exists BUT has gaps (wrong type, wrong value, wrong operator, missing property)
- ❌ **MISSING**: Implementation does not exist

---

# Step 11: Backward Trace Analysis

**Goal:** Ensure all changed code is mapped to requirements.

**CRITICAL: Only analyze files from the CHANGED_FILES list. Do NOT scan workspace.**

For each file in CHANGED_FILES:

1. Check if it's mentioned in any requirement
2. Check if it was used in Forward Trace
3. Mark: ✅ MAPPED, ⚠️ UNLINKED, or ❌ GHOST

**Skip these files:**

- `-meta.xml` files (except `.field-meta.xml`, `.object-meta.xml`)
- `package.xml`
- Files in `__tests__` directory

**Categories:**

- ✅ **MAPPED**: File is linked to requirements
- ⚠️ **UNLINKED**: Business logic NOT mentioned in requirements
- ❌ **GHOST**: File from different feature/epic

---

# Step 12: Code Quality Analysis

**Goal:** Find Salesforce best practice violations.

**Only analyze Apex files (.cls, .trigger) from CHANGED_FILES.**

For each Apex file:

1. **Use `view` tool to read the file**
2. Scan for issues by severity
3. Record: File, Line, Issue, Code snippet, Fix

**Severity Levels:**

🔴 **Critical** (Governor Limits/Security):

- SOQL in loops
- DML in loops
- Missing `with sharing`
- Wrong operators (> instead of >=)
- Wrong thresholds (30 instead of 60)

🟠 **High Priority**:

- Missing null checks
- No try-catch around DML
- Not bulkified

🟡 **Medium Priority**:

- Hardcoded values (should use Custom Metadata)
- Missing ApexDoc comments

🟢 **Low Priority**:

- Long methods (>100 lines)
- Formatting issues

---

# Step 13: Generate HTML Report

**Filename:** `{JIRA_ID}_{YYYY-MM-DD}_{HH-MM-SS}_Review.html`

Create one HTML file with these sections:

**1. Header**

- Title, Date, Branch, Commit, Files count

**2. Executive Summary**

- Summary cards with counts (MET/PARTIAL/MISSING/CRITICAL/HIGH)
- Overall status
- Top 5 critical issues list

**3. Forward Trace**

- Summary cards
- Table with ALL ACs: AC #, Story, Requirement, Status, Evidence, Gaps, Suggestions

**4. Backward Trace**

- Summary cards
- Mapped files list
- Unlinked table (if any)
- Ghost code alerts (if any)

**5. Code Quality**

- Summary cards by severity
- Tables for Critical/High/Medium issues
- List for Low issues

**6. Files Analyzed**

- Total count
- Successfully analyzed count
- Collapsible list of all files

Use professional styling with colored badges and cards.

**Save to:** `docs/reviews/{REPORT_FILENAME}`

**Then open in browser:**

```bash
start docs/reviews/{REPORT_FILENAME}
```

**Display completion message:**

```
✅ Analysis Complete!

Report: docs/reviews/{REPORT_FILENAME}

Summary:
- Forward Trace: {MET}/{TOTAL} met ({PARTIAL} partial, {MISSING} missing)
- Backward Trace: {MAPPED} mapped, {UNLINKED} unlinked
- Code Quality: {CRITICAL} critical, {HIGH} high issues

{If critical issues:}
❌ BLOCKERS: {count} critical issues must be fixed
```

# END OF WORKFLOW
