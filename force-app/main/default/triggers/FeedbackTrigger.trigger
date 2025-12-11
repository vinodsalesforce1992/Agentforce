trigger FeedbackTrigger on Employee_Feedback__c(before insert, before update) {
  if (Trigger.isBefore) {
    FeedbackHandler.handleBeforeInsert(Trigger.new);
  }

  // MISSING: Validation for "Rejection Reason" (Story HR-3) is not here.

}
