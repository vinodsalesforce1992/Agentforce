trigger AccountContractHealthTrigger on Account(before insert, before update) {
  // Realistic bug: Not bulkified - calculating in loop
  for (Account acc : Trigger.new) {
    ContractHealthScoreCalculator.calculateScore(acc);
  }
}
