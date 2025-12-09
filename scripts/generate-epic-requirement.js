require("dotenv").config();
const fs = require("fs");
const path = require("path");
const https = require("https");

// --- Configuration ---
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const AC_FIELD_ID = "customfield_10042"; // Verify this ID matches your Jira

// --- Arguments ---
const args = process.argv.slice(2).reduce((acc, kv) => {
  const [k, ...rest] = kv.split("=");
  acc[k] = rest.join("=");
  return acc;
}, {});

const KEY = args.KEY || process.env.KEY;

if (!KEY) {
  console.error(
    "❌ Error: Missing KEY. Usage: node scripts/generate-epic-requirement.js KEY=DEMO-123"
  );
  process.exit(1);
}

if (!fs.existsSync(".env")) {
  console.error("❌ Error: .env file missing. Cannot connect to Jira.");
  process.exit(1);
}

// --- Helpers ---

// Unified Request Helper
function jiraRequest(apiPath, method = "GET", body = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString(
      "base64"
    );
    const url = new URL(apiPath, JIRA_BASE_URL);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON response: ${data}`));
          }
        } else {
          reject(new Error(`Jira API Error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", (error) => reject(error));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function extractText(obj) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (obj.type === "text") return obj.text || "";
  if (obj.content) return obj.content.map(extractText).join("\n");
  return "";
}

function formatIssueMarkdown(issue, isChild = false) {
  const fields = issue.fields;
  const summary = fields.summary || "";
  const description =
    extractText(fields.description) || "No description provided.";
  const ac =
    extractText(fields[AC_FIELD_ID]) || "TODO: Add acceptance criteria";
  const status = fields.status?.name || "To Do";
  const priority = fields.priority?.name || "Medium";
  const type = fields.issuetype?.name || "Story";

  const headerPrefix = isChild ? "##" : "#";

  return `
${headerPrefix} [${issue.key}] ${summary}
**Type:** ${type} | **Status:** ${status} | **Priority:** ${priority}

### Description
${description}

### Acceptance Criteria
${ac}

### Technical Notes
- [ ] Validated against ${issue.key}
---
`;
}

// --- Main Execution ---

async function generateEpicDoc() {
  console.log(`🔍 Fetching Epic: ${KEY}...`);

  try {
    // 1. Fetch the Epic itself
    const epicIssue = await jiraRequest(`/rest/api/3/issue/${KEY}`, "GET");

    // 2. Fetch Child Issues (Using the specific JQL endpoint)
    console.log(`👨‍👧‍👦 Finding child stories for ${KEY}...`);

    const searchBody = {
      jql: `parent = "${KEY}" ORDER BY key ASC`,
      maxResults: 50,
      fields: [
        "summary",
        "description",
        "status",
        "priority",
        "issuetype",
        AC_FIELD_ID
      ]
    };

    // FIXED: Pointing to /rest/api/3/search/jql as requested by the error
    const searchResults = await jiraRequest(
      "/rest/api/3/search/jql",
      "POST",
      searchBody
    );
    const children = searchResults.issues || [];

    console.log(`✅ Found ${children.length} child issues.`);

    // 3. Construct File Content
    let fileContent = `---
key: ${KEY}
type: Epic
child_count: ${children.length}
status: ${epicIssue.fields.status?.name}
generated: ${new Date().toISOString()}
---

# EPIC: ${extractText(epicIssue.fields.summary)}

> **Epic Context**
> ${extractText(epicIssue.fields.description)}

---
`;

    if (children.length > 0) {
      fileContent += `\n# CHILD REQUIREMENTS (${children.length})\n`;
      for (const child of children) {
        fileContent += formatIssueMarkdown(child, true);
      }
    } else {
      fileContent += `\n> *No child stories found linked to this Epic.*\n`;
    }

    // 4. Write to File
    const outDir = path.join("docs", "requirements");
    const outFile = path.join(outDir, `${KEY}.md`);

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outFile, fileContent, "utf8");

    console.log(`🎉 Success! Generated Consolidated Requirement Doc:`);
    console.log(`📄 ${outFile}`);
  } catch (error) {
    console.error("❌ Failed:", error.message);
    process.exit(1);
  }
}

generateEpicDoc();
