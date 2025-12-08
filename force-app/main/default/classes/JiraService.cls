public with sharing class JiraService {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getStoryDetails(String storyId) {
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint('callout:JIRA_API/rest/api/3/issue/' + storyId);
            req.setMethod('GET');
            req.setHeader('Accept', 'application/json');
            req.setTimeout(60000);
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
                Map<String, Object> parsed = parseJiraResponse(result);
                
                System.debug('Parsed Result: ' + JSON.serializePretty(parsed));
                
                return parsed;
            } else {
                throw new CalloutException('JIRA API Error: ' + res.getStatus());
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage());
            throw new AuraHandledException('Error: ' + e.getMessage());
        }
    }
    
    private static Map<String, Object> parseJiraResponse(Map<String, Object> jiraData) {
        Map<String, Object> fields = (Map<String, Object>) jiraData.get('fields');
        
        Map<String, Object> result = new Map<String, Object>();
        result.put('key', jiraData.get('key'));
        result.put('summary', fields.get('summary'));
        result.put('description', fields.get('description'));
        result.put('acceptanceCriteria', fields.get('customfield_10042'));
        result.put('status', getNestedValue(fields, 'status.name'));
        result.put('priority', getNestedValue(fields, 'priority.name'));
        
        return result;
    }
    
    private static String getNestedValue(Map<String, Object> data, String path) {
        List<String> keys = path.split('\\.');
        Object current = data;
        
        for (String key : keys) {
            if (current instanceof Map<String, Object>) {
                current = ((Map<String, Object>) current).get(key);
            } else {
                return null;
            }
        }
        
        return current != null ? String.valueOf(current) : '';
    }
}