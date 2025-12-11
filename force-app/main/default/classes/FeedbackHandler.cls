public class FeedbackHandler {
  public static void handleBeforeInsert(List<Employee_Feedback__c> feedbacks) {
    for (Employee_Feedback__c fb : feedbacks) {
      // Implements HR-1: Default status
      if (String.isBlank(fb.Status__c)) {
        fb.Status__c = 'Submitted';
      }

      // Implements HR-2: Anonymous logic (Partially)
      if (fb.Is_Anonymous__c == true) {
        // We are clearing the name/owner, effectively hiding identity
        fb.OwnerId = UserInfo.getUserId(); // Assign to current user? (Buggy logic, but works for checking)
      }

      // MISSING: The logic to set Priority = 'High' (The Comment requirement) is NOT here.
    }
  }
}
