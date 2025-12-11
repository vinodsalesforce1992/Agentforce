public with sharing class GitHubService {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getCommitsForStory(String storyId, String repoOwner, String repoName) {
        try {
            HttpRequest req = new HttpRequest();
            String endpoint = 'callout:GitHub_API/repos/' + repoOwner + '/' + repoName + '/commits?per_page=100';
            req.setEndpoint(endpoint);
            req.setMethod('GET');
            req.setHeader('Accept', 'application/vnd.github.v3+json');
            req.setTimeout(60000);
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                List<Object> commits = (List<Object>) JSON.deserializeUntyped(res.getBody());
                return filterCommitsByStoryId(commits, storyId);
            } else {
                throw new CalloutException('GitHub API Error: ' + res.getStatus());
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error: ' + e.getMessage());
        }
    }
    
    private static List<Map<String, Object>> filterCommitsByStoryId(List<Object> commits, String storyId) {
        List<Map<String, Object>> matchingCommits = new List<Map<String, Object>>();
        
        for (Object commitObj : commits) {
            Map<String, Object> commitData = (Map<String, Object>) commitObj;
            Map<String, Object> commitDetails = (Map<String, Object>) commitData.get('commit');
            String message = (String) commitDetails.get('message');
            
            if (message != null && message.containsIgnoreCase(storyId)) {
                Map<String, Object> result = new Map<String, Object>();
                result.put('sha', commitData.get('sha'));
                result.put('message', message);
                
                Map<String, Object> authorData = (Map<String, Object>) commitDetails.get('author');
                if (authorData != null) {
                    result.put('author', authorData.get('name'));
                    result.put('date', authorData.get('date'));
                }
                
                matchingCommits.add(result);
            }
        }
        
        return matchingCommits;
    }
}