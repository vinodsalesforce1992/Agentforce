// This batch class is NOT mentioned in DEMO-12 requirements
// Backward tracing gap - orphaned code
public class TaskItemReminderBatch implements Database.Batchable<SObject> {
  public Database.QueryLocator start(Database.BatchableContext bc) {
    return Database.getQueryLocator(
      [
        SELECT Id, Name, Priority__c, Due_Date__c, OwnerId
        FROM Task_Item__c
        WHERE Priority__c = 'Urgent'
      ]
    );
  }

  public void execute(Database.BatchableContext bc, List<Task_Item__c> scope) {
    // Alternative batch implementation - not requested
    System.debug('Batch processing: ' + scope.size());
  }

  public void finish(Database.BatchableContext bc) {
    System.debug('Batch complete');
  }
}
