require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Parse arguments
const args = process.argv.slice(2).reduce((acc, kv) => {
    const [k, ...rest] = kv.split('=');
    acc[k] = rest.join('=');
    return acc;
}, {});

const EPIC_KEY = args.EPIC || process.env.EPIC;

if (!EPIC_KEY) {
    console.error('❌ Missing EPIC. Usage: node scripts/generate-epic-requirement.js EPIC=DEMO-1');
    process.exit(1);
}

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    console.error('❌ Missing Jira credentials');
    process.exit(1);
}

// Function to call Jira API
function jiraRequest(path) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
        const url = new URL(path, JIRA_BASE_URL);
        
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
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Jira API error: ${res.statusCode} - ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

// Get Epic Link field ID dynamically
async function getEpicLinkFieldId() {
    try {
        const fields = await jiraRequest('/rest/api/3/field');
        const epicLinkField = fields.find(f => f.name === 'Epic Link');
        return epicLinkField ? epicLinkField.id : null;
    } catch (e) {
        console.log('Could not fetch Epic Link field:', e.message);
        return null;
    }
}

// Search with pagination
async function searchAllIssues(jql) {
    let allIssues = [];
    let startAt = 0;
    const maxResults = 100;
    let total = 0;
    
    do {
        const encodedJql = encodeURIComponent(jql);
        const result = await jiraRequest(`/rest/api/3/search/jql?jql=${encodedJql}&startAt=${startAt}&maxResults=${maxResults}`);
        
        allIssues = allIssues.concat(result.issues || []);
        total = result.total;
        startAt += maxResults;
        
    } while (startAt < total);
    
    return allIssues;
}

// Extract text from Jira format
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
async function generateEpicRequirement() {
    console.log(`🔍 Fetching Epic: ${EPIC_KEY}...`);
    
    try {
        // Fetch epic
        const epic = await jiraRequest(`/rest/api/3/issue/${EPIC_KEY}`);
        const epicFields = epic.fields;
        
        // Get epic's child issues - try multiple JQL approaches
        console.log(`🔍 Fetching stories under ${EPIC_KEY}...`);
        
        let stories = [];
        let jqlUsed = '';
        
        // Try 1: Team-managed project (parentEpic)
        try {
            jqlUsed = `parentEpic = "${EPIC_KEY}" ORDER BY created ASC`;
            console.log(`Trying: ${jqlUsed}`);
            stories = await searchAllIssues(jqlUsed);
            if (stories.length > 0) {
                console.log(`✅ Success with parentEpic field`);
                console.log('DEBUG: Stories found:');
                stories.forEach(s => console.log(`  - ${s.key}: ${s.fields?.summary || 'No summary'} (Type: ${s.fields?.issuetype?.name})`));
            }
        } catch (e) {
            console.log(`parentEpic failed: ${e.message}`);
        }
        
        // Try 2: Company-managed project (Epic Link)
        if (stories.length === 0) {
            try {
                jqlUsed = `"Epic Link" = ${EPIC_KEY} ORDER BY created ASC`;
                console.log(`Trying: ${jqlUsed}`);
                stories = await searchAllIssues(jqlUsed);
                if (stories.length > 0) {
                    console.log(`✅ Success with "Epic Link" field`);
                    console.log('DEBUG: Stories found:');
                    stories.forEach(s => console.log(`  - ${s.key}: ${s.fields?.summary || 'No summary'} (Type: ${s.fields?.issuetype?.name})`));
                }
            } catch (e) {
                console.log(`"Epic Link" failed: ${e.message}`);
            }
        }
        
        // Try 3: Company-managed with custom field ID
        if (stories.length === 0) {
            const epicLinkFieldId = await getEpicLinkFieldId();
            if (epicLinkFieldId) {
                try {
                    jqlUsed = `${epicLinkFieldId} = ${EPIC_KEY} ORDER BY created ASC`;
                    console.log(`Trying: ${jqlUsed}`);
                    stories = await searchAllIssues(jqlUsed);
                    if (stories.length > 0) {
                        console.log(`✅ Success with custom field ${epicLinkFieldId}`);
                        console.log('DEBUG: Stories found:');
                        stories.forEach(s => console.log(`  - ${s.key}: ${s.fields?.summary || 'No summary'} (Type: ${s.fields?.issuetype?.name})`));
                    }
                } catch (e) {
                    console.log(`Custom field search failed: ${e.message}`);
                }
            }
        }
        
        // Filter out the epic itself
        const originalCount = stories.length;
        stories = stories.filter(s => s.key !== EPIC_KEY && s.fields?.issuetype?.name !== 'Epic');
        console.log(`✅ Found ${originalCount} total, ${stories.length} stories after filtering out epics`);
        
        // Build markdown content
        let content = `---
key: ${EPIC_KEY}
type: Epic
status: ${epicFields.status?.name || 'In Progress'}
stories: ${stories.length}
---

# Epic: ${epicFields.summary}

## Epic Description
${extractText(epicFields.description) || 'No description'}

## Business Value
${extractText(epicFields.customfield_10042) || 'TODO: Add business value'}

## Stories in This Epic

Total Stories: ${stories.length}

`;

        // Add each story
        for (const story of stories) {
            // Handle different response structures
            const fields = story.fields || story;
            const storyKey = story.key || story.id;
            
            // Fetch full story details if needed
            let fullStory = story;
            if (!fields.summary) {
                console.log(`Fetching details for ${storyKey}...`);
                fullStory = await jiraRequest(`/rest/api/3/issue/${storyKey}`);
            }
            
            const storyFields = fullStory.fields || fields;
            
            content += `
---

### ${storyKey}: ${storyFields.summary || 'No title'}

**Status:** ${storyFields.status?.name || 'To Do'} | **Priority:** ${storyFields.priority?.name || 'Medium'}

**Description:**
${extractText(storyFields.description) || 'No description'}

**Acceptance Criteria:**
${extractText(storyFields.customfield_10042) || 'No acceptance criteria'}

`;
        }
        
        // Add summary section
        content += `
---

## Epic Summary

**Total Stories:** ${stories.length}

`;
        
        if (stories.length > 0) {
            // Count by status
            const statusCounts = {};
            stories.forEach(s => {
                const status = s.fields?.status?.name || 'Unknown';
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });
            
            content += `**Stories by Status:**
`;
            Object.entries(statusCounts).forEach(([status, count]) => {
                content += `- ${status}: ${count}\n`;
            });
            
            content += `
**Story List:**
`;
            stories.forEach(s => {
                content += `- ${s.key}: ${s.fields?.summary || 'No title'}\n`;
            });
        }
        
        // Write file
        const outDir = path.join('docs', 'requirements');
        const outFile = path.join(outDir, `${EPIC_KEY}-epic.md`);
        
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outFile, content, 'utf8');
        
        console.log(`✅ Created epic requirement file: ${outFile}`);
        console.log(`📋 Epic: ${epicFields.summary}`);
        console.log(`📊 Stories: ${stories.length}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Run
generateEpicRequirement();