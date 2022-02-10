trigger AccountGenerateContractorID on Account (before insert) {

    String contractorRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Contractor').getRecordTypeId();
            System.debug('contractorRecordTypeId = '+contractorRecordTypeId);
    //Added by Rajesh Turlapati on 12/14/2021
    //Adding to this to eliminate query exception during customer account creation.
    String checkrecordtype;
    
    for(Account a : Trigger.New) {
        checkrecordtype = a.RecordTypeId;
            System.debug('checkrecordtype = '+checkrecordtype);
        //check to see if there are no preexisting contractor Id 
        //Query to find the last contractor_Id
        if(checkrecordtype == contractorRecordTypeId){
            // THIS WILL FAIL IF NO RECORDS AND HARDCODED RECORD TYPE IDS DONT MIGRATE ACROSS ORGS PROPERLY 
            // also there is a race condition due to no record locking - two simultaneous creates can create duplicate ids.... 
            //String lastId = [SELECT Contractor_Id__c from Account WHERE Contractor_Id__c!=NULL AND RecordTypeId= '0128G000000GrxwQAC' ORDER BY CreatedDate DESC limit 1].Contractor_Id__c;

            Integer intNewId = 0;
            List<Account> contractorAccountList = [SELECT Contractor_Id__c from Account WHERE Contractor_Id__c!=NULL AND RecordTypeId = :contractorRecordTypeId ORDER BY CreatedDate DESC limit 1];
            System.debug('contractorAccountList = '+contractorAccountList);
            if(contractorAccountList.Size()>0){
                String lastId = contractorAccountList[0].Contractor_Id__c;
                System.debug('lastId = '+lastId);
                intNewId = Integer.valueOf(lastId.substring(4));
                System.debug('intNewId = '+intNewId);
            }
        
              
            intNewId+=1;
            System.debug('intNewId = '+intNewId);
            //pad Id with zeros
            String paddedId = String.valueOf(intNewId).leftPad(6,'0');
            System.debug('paddedId = '+paddedId);
            a.Contractor_Id__c = 'ACT-'+paddedId;
            System.debug('a.Contractor_Id__c = '+a.Contractor_Id__c);
        }
    }
}