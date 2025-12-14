import { LightningElement, wire } from "lwc";
import getUpcomingRenewals from "@salesforce/apex/RenewalDashboardController.getUpcomingRenewals";

export default class RenewalDashboard extends LightningElement {
  renewals;
  error;

  @wire(getUpcomingRenewals)
  wiredRenewals({ error, data }) {
    if (data) {
      // Process data and add computed properties
      this.renewals = data.map((renewal) => {
        const today = new Date();
        const expDate = new Date(renewal.Contract_Expiration_Date__c);
        const daysUntil = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));

        // Realistic Bug #3: Warning at 60 days instead of 30 days (AC says 30)
        const showRed = !renewal.Contacted_For_Renewal__c && daysUntil < 60;
        const showGreen = renewal.Contacted_For_Renewal__c;

        return {
          ...renewal,
          daysUntilExpiration: daysUntil,
          showGreen: showGreen,
          showRed: showRed
        };
      });
      this.error = undefined;
    } else if (error) {
      this.error = error.body.message;
      this.renewals = undefined;
    }
  }
}
