# GitHub Workflows for DEMO Reviews

This project includes automated workflows for reviewing Jira stories and DEMOs. These workflows can be triggered manually from the GitHub Actions interface.

## Available Workflows

### 1. Simple DEMO Review Workflow

- **File**: `.github/workflows/demo-simple-review.yml`
- **Trigger**: Manual workflow dispatch
- **Purpose**: Automated review of Jira stories with basic checks

### 2. DEMO Review Workflow

- **File**: `.github/workflows/demo-review.yml`
- **Trigger**: Manual workflow dispatch
- **Purpose**: Comprehensive review with detailed reporting

## How to Use

### Running a Review

1. Go to the **Actions** tab in your GitHub repository
2. Select the workflow you want to run:
   - "Simple DEMO Review" or "DEMO Review Workflow"
3. Click **Run workflow**
4. Enter the required parameters:
   - **Jira Story ID**: The ID of the story to review (e.g., DEMO-1)
   - **Branch**: Optional - Branch to review (defaults to 'release')
   - **Include tests**: Optional - Run unit tests during review

### Workflow Features

#### Simple DEMO Review

- Validates requirements file exists
- Checks data model (Account and Portfolio_Position\_\_c fields)
- Counts existing components (LWC, Apex, Triggers)
- Runs linting checks
- Generates a simple review report
- Uploads report as workflow artifact

#### DEMO Review Workflow

- All features of Simple DEMO Review
- More detailed analysis and reporting
- Option to include unit test execution
- Enhanced reporting with key findings

## Workflow Outputs

After running a workflow:

1. **Artifacts**: A review report file will be available for download
2. **Logs**: Complete execution logs are available in the workflow run
3. **Summary**: Console output shows the review results

## Requirements

- GitHub repository with the project structure
- Properly configured `.github/workflows` directory
- Access to run GitHub Actions workflows
- Valid Jira story requirements files in `docs/requirements/`

## Example Usage

To review DEMO-1:

1. Trigger the workflow
2. Set Jira Story ID to: `DEMO-1`
3. Leave branch as default (`release`)
4. Review the generated report in the artifacts section

## Customization

You can modify these workflows by:

1. Editing the workflow YAML files directly
2. Adding new steps for additional checks
3. Changing the report format
4. Modifying the conditions for execution
