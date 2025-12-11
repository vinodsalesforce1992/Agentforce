require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration from environment variables
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, kv) => {
    const [k, ...rest] = kv.split('=');
    acc[k] = rest.join('=');
    return acc;
}, {});

const KEY = args.KEY || process.env.KEY;

if (!KEY) {
    console.error('❌ Missing KEY. Usage: node scripts/generate-requirement.js KEY=DEMO-1');
    process.exit(1);
}

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    console.error('❌ Missing Jira credentials. Set JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN');
    process.exit(1);
}

// Function to call Jira API
function fetchJiraIssue(key) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
        const url = new URL(`/rest/api/3/issue/${key}`, JIRA_BASE_URL);
        
        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Jira API error: ${res.statusCode} - ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

// Function to extract text from Jira description format
function extractText(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (obj.type === 'text') return obj.text || '';
    if (obj.content) {
        return obj.content.map(extractText).join('\n');
    }
    return '';
}

// Main function
async function generateRequirement() {
    console.log(`🔍 Fetching Jira issue: ${KEY}...`);
    
    try {
        const issue = await fetchJiraIssue(KEY);
        const fields = issue.fields;
        
        // Extract data
        const summary = fields.summary || '';
        const description = extractText(fields.description) || '';
        const status = fields.status?.name || 'To Do';
        const priority = fields.priority?.name || 'Medium';
        const assignee = fields.assignee?.displayName || fields.assignee?.emailAddress || 'unassigned';
        
        // Get acceptance criteria from custom field
        const acceptanceCriteria = extractText(fields.customfield_10042) || 'TODO: Add acceptance criteria';
        
        // Build the markdown content
        const frontmatter = `---
key: ${KEY}
type: Story
epic: ${fields.parent?.key || 'TODO'}
owner: ${assignee}
status: ${status}
priority: ${priority}
---

`;
        
        const content = `# ${KEY}: ${summary}

## Summary
${summary}

## Description
${description}

## Acceptance Criteria
${acceptanceCriteria}

## Technical Notes
- TODO: Add technical implementation details
- Expected Salesforce components
- Integration points

## Dependencies
- TODO: List prerequisite stories or dependencies

## Out of Scope
- TODO: What is explicitly NOT included
`;

        // Write to file
        const outDir = path.join('docs', 'requirements');
        const outFile = path.join(outDir, `${KEY}.md`);
        
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outFile, frontmatter + content, 'utf8');
        
        console.log(`✅ Created requirement file: ${outFile}`);
        console.log(`📋 Story: ${summary}`);
        console.log(`📊 Status: ${status} | Priority: ${priority}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run
generateRequirement();