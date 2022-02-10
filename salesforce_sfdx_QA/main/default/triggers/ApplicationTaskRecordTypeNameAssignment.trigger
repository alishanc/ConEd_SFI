trigger ApplicationTaskRecordTypeNameAssignment on Application_Task__c  (before insert) {
Map<String, Id> typeMap = New Map<String, Id>();

   for(RecordType rt: [Select Name, Id From RecordType Where sObjectType = 'Application_Task__c']) {
      typeMap.put(rt.Name, rt.Id);
   }

   for (Application_Task__c at : trigger.new)  {
               at.RecordTypeId = typeMap.get(at.RecordTypeDeveloperName__c);
   }
}