public class ContractHealthScoreCalculator {
  public static void calculateScore(Account acc) {
    Decimal score = 0;

    // Contacted for renewal: 25 points
    if (acc.Contacted_For_Renewal__c == true) {
      score += 25;
    }

    // Realistic Bug #1: Uses > instead of >= (misses comment requirement)
    // Comment says "equals should also count" but developer used only >
    if (
      acc.Proposed_Renewal_Value__c != null &&
      acc.Annual_Contract_Value__c != null &&
      acc.Proposed_Renewal_Value__c > acc.Annual_Contract_Value__c
    ) {
      score += 25;
    }

    // Realistic Bug #2: No null check on Renewal_Probability__c
    // Will throw NullPointerException if field is blank
    if (acc.Renewal_Probability__c == 'High') {
      score += 30;
    } else if (acc.Renewal_Probability__c == 'Medium') {
      score += 15;
    } else if (acc.Renewal_Probability__c == 'Low') {
      score += 0;
    }

    // Contract expires in more than 90 days: 20 points
    if (acc.Contract_Expiration_Date__c != null) {
      Integer daysUntilExpiration = Date.today()
        .daysBetween(acc.Contract_Expiration_Date__c);
      if (daysUntilExpiration > 90) {
        score += 20;
      }
    }

    // Realistic Bug #3: Hardcoded point values (should use Custom Metadata)

    // Set the score
    acc.Contract_Health_Score__c = score;
  }
}
