public class TaskItemPriorityHelper {
  // This class is NOT mentioned in DEMO-11 requirements
  // Orphaned code - backward tracing gap

  public static String getPriorityColor(String priority) {
    switch on priority {
      when 'Low' {
        return 'green';
      }
      when 'Medium' {
        return 'yellow';
      }
      when 'High' {
        return 'orange';
      }
      when 'Urgent' {
        return 'red';
      }
      when else {
        return 'gray';
      }
    }
  }

  public static List<Task_Item__c> getHighPriorityItems() {
    return [
      SELECT Id, Name, Priority__c, Due_Date__c
      FROM Task_Item__c
      WHERE Priority__c IN ('High', 'Urgent')
      ORDER BY Due_Date__c
    ];
  }
}
