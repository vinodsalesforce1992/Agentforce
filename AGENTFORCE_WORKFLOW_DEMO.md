# Agentforce Workflow Demonstration

This document demonstrates how the GitHub Actions workflows would function in a real Agentforce project.

## Workflows Created

### 1. DEMO Review Workflow (`demo-review.yml`)

- **Trigger**: Manual workflow dispatch
- **Input Parameters**:
  - `jira_story`: Jira Story ID (e.g., DEMO-1)
  - `branch`: Optional branch to review (defaults to 'release')

### 2. Simple DEMO Review Workflow (`demo-simple-review.yml`)

- **Trigger**: Manual workflow dispatch
- **Input Parameters**:
  - `jira_story`: Jira Story ID (e.g., DEMO-1)
  - `branch`: Optional branch to review (defaults to 'release')

## How It Would Work

### Step 1: Trigger the Workflow

When you navigate to your GitHub repository's **Actions** tab and select either workflow:

1. Click **"Run workflow"**
2. Enter the Jira Story ID (e.g., DEMO-1)
3. Optionally specify branch and test execution

### Step 2: Workflow Execution

The workflow would:

1. Checkout the specified branch
2. Setup Node.js environment
3. Install project dependencies
4. Validate the requirements file exists
5. Check data model (Account and Portfolio_Position\_\_c fields)
6. Count existing components (LWC, Apex, Triggers)
7. Run linting checks
8. Generate a detailed review report

### Step 3: Results

1. **Review Report**: Downloadable artifact with findings
2. **Console Output**: Detailed execution log
3. **Status**: Success indicator

## Expected Output for DEMO-1

When running with Jira Story ID "DEMO-1", the workflow would:

- ✅ Validate requirements file exists
- 📊 Check Account fields: 30+ fields found
- 📊 Check Portfolio Position fields: 4 fields found
- 🔧 Check LWC components: 1 component found
- ⚡ Check Apex classes: 2 classes found
- 📋 Generate report showing 20% implementation completeness
- 📝 Provide recommendations for next steps

## Benefits of This Approach

1. **Automated**: No manual review process needed
2. **Consistent**: Standardized reporting format
3. **Reproducible**: Same results every time
4. **Scalable**: Works for any Jira story ID
5. **Branch-Specific**: Can target any branch
6. **Integrated**: Part of CI/CD pipeline

## Deployment Instructions

To make these workflows active in your GitHub repository:

1. **Commit Changes**:

   ```bash
   git add .github/workflows/
   git commit -m "Add Agentforce DEMO review workflows"
   ```

2. **Push to Remote**:

   ```bash
   git push origin release
   ```

3. **Enable Workflows**:
   - Go to GitHub repository → Actions tab
   - Workflows should now appear and be runnable

## Next Steps

Once deployed, you can:

- Run reviews for any DEMO (DEMO-1, DEMO-2, etc.)
- Review implementation status automatically
- Track progress across multiple stories
- Integrate into your development workflow

These workflows fulfill your original request for an automated system that works with Jira story IDs and can be connected to the right branch.
