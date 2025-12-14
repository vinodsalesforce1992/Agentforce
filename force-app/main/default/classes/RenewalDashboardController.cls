public with sharing class RenewalDashboardController {
  @AuraEnabled(cacheable=true)
  public static List<Account> getUpcomingRenewals() {
    // Realistic Bug #1: Uses 90 days instead of 120 days (AC says 120)
    Date cutoffDate = Date.today().addDays(90);

    // Realistic Bug #2: Sorts by Name instead of Contract_Expiration_Date__c
    // AC says "Sort by expiration date with soonest first"
    return [
      SELECT
        Id,
        Name,
        Contract_Expiration_Date__c,
        Contract_Health_Score__c,
        Renewal_Probability__c,
        Contacted_For_Renewal__c,
        OwnerId
      FROM Account
      WHERE
        Contract_Expiration_Date__c != NULL
        AND Contract_Expiration_Date__c <= :cutoffDate
        AND Contract_Expiration_Date__c >= TODAY
        AND OwnerId = :UserInfo.getUserId()
      ORDER BY Name ASC
      LIMIT 50
    ];
  }
}
