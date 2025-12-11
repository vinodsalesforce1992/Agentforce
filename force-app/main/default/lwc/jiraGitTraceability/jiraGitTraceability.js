import { LightningElement, track } from 'lwc';
import getStoryDetails from '@salesforce/apex/JiraService.getStoryDetails';
import getCommitsForStory from '@salesforce/apex/GitHubService.getCommitsForStory';

export default class JiraGitTraceability extends LightningElement {
    @track storyId = '';
    @track jiraData = {};
    @track gitCommits = [];
    @track isLoading = false;
    @track showResults = false;

    // GitHub repo details - update these to match your repo
    repoOwner = 'vinodsalesforce1992';
    repoName = 'Agentforce';

    handleStoryIdChange(event) {
        this.storyId = event.target.value;
    }

    handleAnalyze() {
        if (!this.storyId) {
            return;
        }

        this.isLoading = true;
        this.showResults = false;

        // Fetch JIRA data
        getStoryDetails({ storyId: this.storyId })
            .then(result => {
                this.jiraData = result;
                // Fetch Git commits
                return getCommitsForStory({ 
                    storyId: this.storyId,
                    repoOwner: this.repoOwner,
                    repoName: this.repoName
                });
            })
            .then(commits => {
                this.gitCommits = commits;
                this.showResults = true;
                this.isLoading = false;
            })
            .catch(error => {
                console.error('Error:', error);
                this.isLoading = false;
                // Show error to user
                alert('Error: ' + (error.body?.message || 'Something went wrong'));
            });
    }

    get hasCommits() {
        return this.gitCommits && this.gitCommits.length > 0;
    }

    get commitCount() {
        return this.gitCommits ? this.gitCommits.length : 0;
    }
}