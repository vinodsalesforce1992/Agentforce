# Step 1: Identify Work Item Type

You need to establish what kind of work item is being validated.
Ask the user to select the type first by providing clickable options.

<ask_followup_question>
<question>Hello! I am T.R.A.C.E. To begin, please select the type of Jira ticket we are validating:</question>
<options>["Story", "Epic", "Task", "Feature"]</options>
</ask_followup_question>

# Step 2: Request Jira ID

Now that the user has selected the type, request the specific Jira ID.

<ask_followup_question>
<question>Great. Please enter the specific Jira ID (e.g., PROJ-123).</question>
</ask_followup_question>

# Step 3: Fetching Requirements from Jira

If Jira Item Type is Story or a Task then run on terminal the command "node scripts/generate-requirement.js KEY=<replace the key with user input>"

If Jira Item Type is Epic then run on terminal the command node "scripts/generate-epic-requirement.js KEY=<replace the key with user input>"

# Step 4: Read Requirement File

Now that the requirement file is generated, you must read its content into your context so you can analyze it.

Read the file from requirements folder. Follow the file format <JiraId>.md. Replace jira Id provided by the user.

# Guard Rail

If no file found, Inform the user to validate the Id again or check Jira connectivity. If issue persists guide them to create the requirement file manually into requirement folder in the format <Jira_Id>.md manually.

<ask_followup_question>
<question>
Unable to find the item with the <Jira Id> (replace the value provided by the user). Are you sure the Id is valid?
</question>
<options>["Yes", "No"]</options>
</ask_followup_question>

# Step 5: Summarize and Confirm

Now that you have read the file content from Step 4, you must summarize the requirements for the user and ask for confirmation.

<ask_followup_question>
<question>
I have successfully fetched the requirements.

Here is a summary of **<Jira_ID>**:
[Generate a bulleted summary of the requirements for each story found in the file]

Does this look correct?
</question>
<options>["Yes", "No"]</options>
</ask_followup_question>

# Step 6: Identify Git Context (Basic Info)

You need to identify the current work context. Run these two commands to get the Branch and Commit ID.

**6a. Identify Branch:**
Run command: `git rev-parse --abbrev-ref HEAD`

**6b. Identify Commit:**
Run command: `git rev-parse --short HEAD`

# Step 7: Confirm Context & Offer Detail

Display the Branch and Commit ID you just found.
Then, ask the user if they want to see the specific list of changed files.

<ask_followup_question>
<question>
I have detected the current context:
**Branch:** [Insert Branch Name]
**Commit:** [Insert Commit Hash]

Would you like to review the list of changed files before we proceed?
</question>
<options>["Yes", "No"]</options>
</ask_followup_question>

# Step 8: Conditional File List & Confirmation

Act based on the user's choice in Step 7.

**If User said "Yes":**

1. Run the command: `git --no-pager diff --name-only main...HEAD`
2. Display the list of files to the user.

Does the list looks good?
</question>
<options>["Yes", "No"]</options>
</ask_followup_question>

**If User said "No":**

1. Simply reply: "Understood. Proceeding to validation."

# Step 9: Load All Changed Context

You have the list of changed files from Step 8.
Now, you must read the **content** of _every_ file in that list, regardless of its type.

**Action:**
Run the terminal command: `cat <file_path>` for each file in the changed list.
(Ensure you read all files to have the full context before proceeding to analysis).

# Step 10: Multi-Dimensional Forensic Analysis

Now perform the forensic analysis. You must differentiate between "Missing Requirements," "Comment-Based Requirements," and "Unrecorded Scope."

**Analysis A: Forward Trace (Requirement → Implementation)**

1. **Core AC Check:** Verify each Acceptance Criterion from the main description.
2. **Comment Scope Check:** Scan the _Comments Section_ of the requirement file.
   - Treat any directive in the comments (e.g., "Also make field X mandatory") as a **Hard Requirement**.
   - Check if these comment-based requirements are implemented.

**Analysis B: Backward Trace (Code → Requirement)**
For every piece of code/metadata found, categorize it into one of these four buckets:

1. **Directly Mapped:** Code clearly links to a Story AC.
2. **Comment Mapped:** Code links to a directive found in the Jira Comments.
3. **Implicit Technical:** Essential engineering components (e.g., Test Factories, Helper Utils, Error Logging) that don't need a Story. **(Auto-Pass)**.
4. **Unlinked Business Logic:**
   - _Definition:_ Valid functional code (e.g., a new validation rule or field update) that is **NOT** in the Story OR Comments.
   - _Verdict:_ **"Potential Unrecorded Requirement"**. (This is likely the "Verbal Discussion" scenario).
   - _Action:_ Flag this specifically so the user knows to update the Jira Story.

5. **True Ghost Code:**
   - _Definition:_ Code that contradicts the story or seems completely unrelated/malicious.

**Analysis C: Test Scenario Coverage**
Check for Positive, Negative, and Bulk scenarios as defined previously.

# Step 11: Generate and Save Compliance Report

Generate the Markdown report using the Strict Template below.
Save it to: `docs/reviews/<Jira_ID>_Review.md`.

**Template:**

# Traceability Review Report: {KEY or PR}

**Generated:** {Date}
**Reviewer:** AI Agent (T.R.A.C.E.)
**Branch:** {Branch Name}
**Stories Analyzed:** {Jira ID}

---

## Executive Summary

**Overall Status:** {✅ Ready / ⚠️ Needs Work / ❌ Blocked}

**Statistics:**

- Core ACs Met: {count}/{total}
- Comment Requirements Met: {count}/{total}
- Unrecorded Logic Detected: {Yes/No}
- Test Coverage: {Percentage/Verdict}

**Quick Verdict:**
{Summary paragraph. Explicitly mention if Unrecorded Logic requires a Jira update.}

---

## 1. Requirement Traceability Matrix

### A. Core Acceptance Criteria (From Description)

| AC # | Requirement | Status  | Evidence (File:Line) |
| ---- | ----------- | ------- | -------------------- |
| 1    | {Text}      | {✅/❌} | {File.cls:45}        |

### B. Extended Scope (From Jira Comments)

| Source            | Requirement            | Status  | Evidence      |
| ----------------- | ---------------------- | ------- | ------------- |
| Comment by {User} | "Add validation for X" | {✅/❌} | {File.cls:80} |

---

## 2. Backward Trace Analysis

### ✅ Mapped & Technical

- **Mapped:** `Class.methodA` (Links to AC #1)
- **Technical:** `TestDataFactory.cls` (Implicit requirement for testing)

### ⚠️ Unrecorded Business Logic (Potential "Verbal" Scope)

_Code found here implements logic NOT present in Story or Comments. Please confirm if this was discussed verbally and update the Story._

- **File/Element:** `{Filename}: {Method/Field}`
  - **Logic Identified:** {Describe what this code does}
  - **Action Required:** 🛑 **Update Jira Story** to include this logic OR remove code.

### 👻 True Ghost Code (Unknown Origin)

- `{Filename}` - {Reason why this is flagged as irrelevant/risk}

---

## 3. Test Coverage Analysis

- **Positive Scenarios:** {Pass/Fail}
- **Negative Scenarios:** {Pass/Fail}
- **Bulk Scenarios:** {Pass/Fail}

**Missing Tests:**

- {List missing specific scenarios}

---

## 4. Approval Decision

**Status:** {✅ APPROVED / ⚠️ CONDITIONALLY APPROVED / ❌ BLOCKED}

**Conditions:**

- [ ] Update Jira {Key} to include "Unrecorded Logic" items listed above.
- [ ] Fix missing tests for AC #{Number}.

# Step 12: Final Execution & Save

1. **Generate Content:** Fill the template above.
2. **Save File:** Run the command to save the `.md` file.

3. **Intelligent Confirmation:**
   If you detected **"Unrecorded Business Logic"** (Category 4 in Backward Trace), you MUST highlight this in the chat summary.

   <ask_followup_question>
   <question>
   I have completed the analysis and saved the report to `docs/reviews/<Jira_ID>_Review.md`.

   **Summary:**
   - Requirements Met: [X/Y]
   - Ghost/Unrecorded Code: [Yes/No]

   **⚠️ ATTENTION:** I found implementation logic that is not in the Jira Story (likely from a verbal discussion).
   Please review the "Unrecorded Business Logic" section in the report and update Jira if valid.

   Would you like to open the report now?
   </question>
   <options>["Yes, Open Report", "No, I'm Done"]</options>
   </ask_followup_question>

   # Step 13: Handle Final Action

Based on the user's response in Step 12:

**If User said "Yes, Open Report":**

1. Run the command: `code docs/reviews/<Jira_ID>_Review.md`
   _(Replace `<Jira_ID>` with the actual ID used throughout the workflow)_.
2. Respond: "Opening the report now. Happy reviewing!"

**If User said "No, I'm Done":**

1. Respond: "Understood. Analysis complete. Have a great day!"
