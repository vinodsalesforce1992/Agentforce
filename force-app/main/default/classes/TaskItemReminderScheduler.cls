public class TaskItemReminderScheduler implements Schedulable {
  // Missing class header comments - code quality issue

  public void execute(SchedulableContext ctx) {
    System.debug('Testing - remove before deploy'); // Debug statement - should be removed

    // BAD: Not checking custom setting (AC #3 requirement ignored!)

    List<User> users = [SELECT Id, Email FROM User WHERE IsActive = TRUE];

    // CRITICAL BUG: SOQL in loop and Email in loop
    for (User u : users) {
      // BAD: SOQL inside loop - governor limit issue
      List<Task_Item__c> urgentTasks = [
        SELECT Id, Name, Priority__c, Due_Date__c
        FROM Task_Item__c
        WHERE OwnerId = :u.Id AND Priority__c = 'Urgent'
      ];

      if (!urgentTasks.isEmpty()) {
        // BAD: Email inside loop - governor limit issue
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new List<String>{ u.Email });
        email.setSubject('You have urgent task items'); // Hardcoded - should use template
        email.setPlainTextBody('You have urgent tasks'); // Hardcoded - should use template

        // BAD: No try-catch, no error handling
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ email });
      }
    }

    // No grouped sending (AC #2 says one email per user with ALL their tasks)
    // Currently sends individual emails
  }
}
